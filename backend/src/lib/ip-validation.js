/**
 * IP Whitelist and validation utilities
 * Supports both IPv4 and IPv6, including CIDR notation
 */

import { match } from 'ip-matcher'

const parseWhitelist = () => {
  const whitelist = process.env.IP_WHITELIST || '127.0.0.1,::1'
  return whitelist.split(',').map(ip => ip.trim())
}

const getClientIP = (req) => {
  // Vercel headers
  const forwarded = req.headers.get('x-forwarded-for')
  const clientIP = forwarded ? forwarded.split(',')[0].trim() : null
  
  // Fallback headers
  const ip = clientIP ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-client-ip') ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown'
  
  return ip
}

const isIPWhitelisted = (ip) => {
  const whitelist = parseWhitelist()
  
  return whitelist.some(pattern => {
    if (pattern.includes('/')) {
      // CIDR notation
      try {
        return match(ip, pattern)
      } catch (e) {
        console.warn(`Invalid CIDR pattern: ${pattern}`)
        return false
      }
    } else {
      // Exact match
      return ip === pattern
    }
  })
}

const logFailedAttempt = async (ip, email, reason) => {
  if (process.env.LOG_FAILED_ATTEMPTS !== 'true') return
  
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    ip,
    email,
    reason,
    status: 'BLOCKED'
  }
  
  // Aquí puedes integrar con Supabase/logging service
  console.warn(`[SECURITY] Failed admin access attempt:`, logEntry)
  
  // TODO: Enviar alerta por email si es necesario
}

export {
  parseWhitelist,
  getClientIP,
  isIPWhitelisted,
  logFailedAttempt
}
