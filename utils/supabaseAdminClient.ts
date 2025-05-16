import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
}

// Create a single supabase client for interacting with your database
// Use the service role key for elevated privileges (server-side only)
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      // Explicitly specify how to handle client-side auth if needed,
      // but for server actions, service role key bypasses RLS.
      // Example: persistSession: false if you don't want client sessions
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

console.log("Supabase Admin Client Initialized (Server-Side)");
