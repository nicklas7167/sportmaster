import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Supabase URL and credentials
const supabaseUrl = 'https://xaxmbfgseznhfhdrqgvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheG1iZmdzZXpuaGZoZHJxZ3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDE2NzMsImV4cCI6MjA2MDY3NzY3M30.sxbctHIllFjC-YgJpzHg45vkzT3Q2H_eYAMMh3005Vo';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database password is hardcoded for now
// NOTE: In a production environment, this should be stored as an environment variable

// Create PostgreSQL connection for Drizzle ORM
// Direct connection string with proper format for Supabase
// Using direct connection format
const pgConnectionString = "postgresql://postgres.xaxmbfgseznhfhdrqgvv:Nuh42zqcnuh42zqc!@aws-0-us-west-1.pooler.supabase.com:5432/postgres";

// Create a PostgreSQL client
const queryClient = postgres(pgConnectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Maximum time a connection can be idle (in seconds)
  connect_timeout: 10, // Maximum time to wait for a connection (in seconds)
});

// Initialize Drizzle with the postgres client
export const db = drizzle(queryClient, { schema });
