import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno o credenciales oficiales de AutoLook
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yhaqhvabffziqavztjdp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RZfSIWf_V1eFCeuUCcDdMQ_3Jwum4j1';

export const supabase = createClient(supabaseUrl, supabaseKey);
