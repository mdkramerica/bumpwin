
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local or use the ones we know are in Railway
// For this script, we'll hardcode the values or expect them in process.env if running in context, 
// but since we run locally, I'll grab them from the user's project or the previous output.
// I'll rely on the user to have .env.local or I will construct the client with the known values.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bjcegrfgnqtlvldcnzhn.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseServiceKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is required. Please export it or add to .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkClaim() {
    const email = "matt+win@kramertechllc.com";
    console.log(`Checking claims for ${email}...`);

    // 1. Get User ID
    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", email);

    if (userError) {
        console.error("Error fetching user:", userError);
        return;
    }

    if (!users || users.length === 0) {
        console.log("User not found in 'users' table.");
        // Try to find in auth.users? (Can't easily via client without admin auth API, which we have)
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
         if (authError) console.error("Auth List Error:", authError);
         const authUser = authUsers?.find(u => u.email === email);
         if (authUser) {
             console.log("Found in Auth Users:", authUser.id);
         } else {
             console.log("User really not found.");
         }
        return;
    }

    const user = users[0];
    console.log(`Found User: ${user.id}`);

    // 2. Get Claims
    const { data: claims, error: claimsError } = await supabase
        .from("claims")
        .select("*, trips(*)")
        .eq("user_id", user.id);

    if (claimsError) {
        console.error("Error fetching claims:", claimsError);
        return;
    }

    if (claims.length === 0) {
        console.log("No claims found for this user.");
    } else {
        console.table(claims.map(c => ({
            id: c.id,
            status: c.status,
            is_unlocked: c.is_unlocked,
            stripe_session_id: c.stripe_session_id,
            trip: c.trips.airline_code + c.trips.flight_number
        })));
    }
}

checkClaim();

