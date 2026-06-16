/**
 * GET /api/admin/health
 * Health check endpoint for Vercel deployment
 */

import { NextResponse } from 'next/server'
import { getClientIP } from '@/lib/ip-validation'

export async function GET(req) {
  const clientIP = getClientIP(req)
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    clientIP,
    version: '1.0.0'
  })
}
