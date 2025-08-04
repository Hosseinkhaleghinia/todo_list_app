import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function برای گرفتن کاربر فعلی
export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

// Helper function برای check کردن authentication
export const getSession = () => {
  return supabase.auth.getSession()
}