import { createClient } from '@supabase/supabase-js';

const supabaseServiceUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Este arquivo *não* será importado no cliente, apenas em rotas API / server-actions
export const supabaseAdmin = createClient(supabaseServiceUrl, supabaseServiceKey);
