// Initialise Supabase

const SUPABASE_URL = 'https://ftjeyqnvjbofuwmgkfez.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0amV5cW52amJvZnV3bWdrZmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODA1MDcsImV4cCI6MjA3NTA1NjUwN30.dsyzj-1islNEw_GUMPmL5qrTSkqD92Vgazaw6InbC6E'


const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
