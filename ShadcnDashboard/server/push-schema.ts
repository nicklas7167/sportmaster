import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Database password is hardcoded for now
// NOTE: In a production environment, this should be stored as an environment variable

// Set up the Postgres connection for Supabase
// Using direct connection format
const connectionString = "postgresql://postgres.xaxmbfgseznhfhdrqgvv:Nuh42zqcnuh42zqc!@aws-0-us-west-1.pooler.supabase.com:5432/postgres";

// Create a PostgreSQL client with more generous timeout for migration
const migrationClient = postgres(connectionString, { 
  max: 1,
  idle_timeout: 60,
  connect_timeout: 30
});

// Initialize the database connection
const db = drizzle(migrationClient, { schema });

// Main function to create schema
async function pushSchema() {
  console.log('Starting database schema push...');
  
  try {
    // Create schema in the database based on the TypeScript schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        "subscriptionEnd" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    await db.execute(`
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
    
    console.log('Database schema push completed successfully.');
  } catch (error) {
    console.error('Error pushing database schema:', error);
  } finally {
    await migrationClient.end();
  }
}

// Run the migration
pushSchema().catch(console.error);