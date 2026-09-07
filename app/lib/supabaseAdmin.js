import { createClient } from '@supabase/supabase-js';

// DİKKAT: Bu dosya SADECE sunucu tarafında (API route'larda) kullanılmalı.
// SUPABASE_SECRET_KEY tarayıcıya asla gönderilmemeli.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
