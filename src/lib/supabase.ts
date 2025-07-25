import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wjikhjszsdvutpwqgxzv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaWtoanN6c2R2dXRwd3FneHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk5ODAsImV4cCI6MjA2OTAxNTk4MH0.0oGJ9MTdBMHyl5zeGLj6dpslk_9sLpkdvumJHDdm38I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)