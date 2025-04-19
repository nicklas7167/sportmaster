import { supabase } from './supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Get the current database tables
    const { data: tableData, error: tableError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public');
    
    if (tableError) {
      console.error('Error fetching tables:', tableError);
    } else {
      console.log('Existing public tables:', tableData?.map(t => t.tablename));
    }
    
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.from('users').insert([]).select();
    
    if (usersError && usersError.code === '42P01') {
      console.log('Users table does not exist, creating it...');
      const { error: createUsersError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          "subscriptionEnd" TIMESTAMP,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      
      if (createUsersError) {
        console.error('Failed to create users table:', createUsersError);
      } else {
        console.log('Users table created successfully');
      }
    }
    
    // Create predictions table
    console.log('Creating predictions table...');
    const { error: predictionsError } = await supabase.from('predictions').insert([]).select();
    
    if (predictionsError && predictionsError.code === '42P01') {
      console.log('Predictions table does not exist, creating it...');
      const { error: createPredictionsError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS predictions (
          id SERIAL PRIMARY KEY,
          "matchTitle" TEXT NOT NULL,
          league TEXT NOT NULL,
          "sportType" TEXT NOT NULL,
          "startTime" TIMESTAMP NOT NULL,
          prediction TEXT NOT NULL,
          odds TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          notes TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      
      if (createPredictionsError) {
        console.error('Failed to create predictions table:', createPredictionsError);
      } else {
        console.log('Predictions table created successfully');
      }
    }
    
    // Test if the tables exist
    const { data: usersData, error: usersFetchError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersFetchError) {
      console.error('Error fetching from users table:', usersFetchError);
    } else {
      console.log('Users table exists and is accessible');
    }
    
    const { data: predictionsData, error: predictionsFetchError } = await supabase
      .from('predictions')
      .select('*')
      .limit(1);
    
    if (predictionsFetchError) {
      console.error('Error fetching from predictions table:', predictionsFetchError);
    } else {
      console.log('Predictions table exists and is accessible');
    }
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
  }
}

testSupabaseConnection();