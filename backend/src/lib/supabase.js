/**
 * Supabase client for backend
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Verify admin user exists in public.admins table
 */
export const isAdminUser = async (uid) => {
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', uid)
    .single()
  
  return !error && !!data
}

/**
 * Log admin access attempt
 */
export const logAdminAccess = async (uid, ip, success, reason = null) => {
  try {
    // Aquí puedes crear una tabla admin_access_logs si lo deseas
    const { error } = await supabase
      .from('admin_access_logs')
      .insert({
        user_id: uid,
        ip_address: ip,
        success,
        reason,
        created_at: new Date().toISOString()
      })
    
    if (error) console.error('Failed to log access:', error)
  } catch (e) {
    console.error('Error logging access:', e)
  }
}
