import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabaseクライアント（API routeとブラウザ両方で使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
