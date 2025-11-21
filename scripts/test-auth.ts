import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testAuth() {
  console.log("Testing Supabase Auth Connection...");
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const email = `testuser${Math.floor(Math.random() * 1000)}@bumpwin.com`;
  const password = "password123";

  // Try Sign Up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("❌ Sign Up Failed:", error.message);
  } else {
    console.log("✅ Sign Up Successful:", data.user?.id);
    console.log("   Email Confirmed:", data.user?.email_confirmed_at ? "YES" : "NO");
    
    if (!data.user?.email_confirmed_at) {
        console.log("⚠️  WARNING: Email confirmation is ENABLED. You cannot login immediately.");
    }
  }
}

testAuth();

