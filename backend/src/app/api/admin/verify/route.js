/**
 * POST /api/admin/verify
 * Validates JWT token and IP binding
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientIP } from '@/lib/ip-validation'
import { verifyToken } from '@/lib/jwt'

export async function POST(req) {
  try {
    const clientIP = getClientIP(req)
    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      )
    }

    // Verify token and IP binding
    const payload = await verifyToken(token, clientIP)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}

export async function OPTIONS(req) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
