/**
 * POST /api/admin/login
 * Validates IP whitelist, verifies credentials, and returns JWT token
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientIP, isIPWhitelisted, logFailedAttempt } from '@/lib/ip-validation'
import { createToken } from '@/lib/jwt'
import { supabase, isAdminUser } from '@/lib/supabase'

// Rate limiting store (in production, use Redis)
const attemptStore = new Map()

const checkRateLimit = (ip) => {
  const now = Date.now()
  const window = parseInt(process.env.RATE_LIMIT_WINDOW || '900000') // 15 min
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5')
  
  if (!attemptStore.has(ip)) {
    attemptStore.set(ip, [])
  }
  
  const attempts = attemptStore.get(ip).filter(time => now - time < window)
  
  if (attempts.length >= maxRequests) {
    return false
  }
  
  attempts.push(now)
  attemptStore.set(ip, attempts)
  return true
}

export async function POST(req) {
  try {
    const clientIP = getClientIP(req)
    const body = await req.json()
    const { email, password, token } = body

    // 1. Validate IP whitelist
    if (!isIPWhitelisted(clientIP)) {
      await logFailedAttempt(clientIP, email, 'IP not whitelisted')
      return NextResponse.json(
        { error: 'Access denied: IP not authorized' },
        { status: 403 }
      )
    }

    // 2. Check rate limiting
    if (!checkRateLimit(clientIP)) {
      await logFailedAttempt(clientIP, email, 'Rate limit exceeded')
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // 3. Verify admin secret token (client-side first gate)
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      await logFailedAttempt(clientIP, email, 'Invalid admin token')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 4. Authenticate with Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !data.user) {
      await logFailedAttempt(clientIP, email, 'Auth failed')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 5. Verify user is in admins table
    const isAdmin = await isAdminUser(data.user.id)
    if (!isAdmin) {
      await logFailedAttempt(clientIP, email, 'User not admin')
      return NextResponse.json(
        { error: 'User is not authorized as admin' },
        { status: 403 }
      )
    }

    // 6. Create JWT with IP binding
    const jwtToken = await createToken(
      {
        sub: data.user.id,
        email: data.user.email,
        role: 'admin'
      },
      clientIP
    )

    // 7. Return secure response
    const response = NextResponse.json(
      {
        success: true,
        token: jwtToken,
        user: {
          id: data.user.id,
          email: data.user.email
        }
      },
      { status: 200 }
    )

    // Set secure headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
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
