/**
 * JWT utilities with IP binding
 */

import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long-very-secure'
)

/**
 * Create JWT token with IP binding
 * @param {Object} payload - Token payload
 * @param {string} ip - Client IP to bind to token
 * @returns {Promise<string>} JWT token
 */
export const createToken = async (payload, ip) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h'
  
  const token = await new SignJWT({
    ...payload,
    boundIP: ip, // Bind token to IP
    iat: Math.floor(Date.now() / 1000)
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secret)
  
  return token
}

/**
 * Verify JWT token and validate IP binding
 * @param {string} token - JWT token to verify
 * @param {string} currentIP - Current client IP
 * @returns {Promise<Object>} Verified payload
 */
export const verifyToken = async (token, currentIP) => {
  try {
    const verified = await jwtVerify(token, secret)
    const payload = verified.payload
    
    // Validate IP binding
    if (payload.boundIP !== currentIP) {
      throw new Error(`IP mismatch: token bound to ${payload.boundIP}, current IP is ${currentIP}`)
    }
    
    return payload
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`)
  }
}

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = async (token) => {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch {
    return null
  }
}
