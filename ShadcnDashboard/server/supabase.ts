import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key from environment variables
const supabaseUrl = 'https://xaxmbfgseznhfhdrqgvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheG1iZmdzZXpuaGZoZHJxZ3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDE2NzMsImV4cCI6MjA2MDY3NzY3M30.sxbctHIllFjC-YgJpzHg45vkzT3Q2H_eYAMMh3005Vo';

// Create a Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});