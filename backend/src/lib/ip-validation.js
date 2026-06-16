/**
 * IP Whitelist and validation utilities
 * Supports both IPv4 and IPv6 (exact match) and CIDR notation for IPv4
 */

const ipToInt = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
}

const matchCIDR = (ip, cidr) => {
  try {
    const [range, bits] = cidr.split('/')
    const mask = ~(2 ** (32 - parseInt(bits)) - 1) >>> 0
    return (ipToInt(ip) & mask) === (ipToInt(range) & mask)
  } catch (e) {
    console.warn(`Invalid CIDR pattern: ${cidr}`)
    return false
  }
}

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
      return matchCIDR(ip, pattern)
    } else {
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
