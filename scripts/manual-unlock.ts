
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bjcegrfgnqtlvldcnzhn.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseServiceKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is required.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function unlockClaim() {
    const claimId = "3d0d0899-2a96-4238-99a7-b7859f9d3c0a";
    console.log(`Unlocking claim ${claimId}...`);

    const { error } = await supabase
        .from("claims")
        .update({ 
            is_unlocked: true, 
            status: "PAID_UNLOCK",
            stripe_session_id: "manual_fix_" + Date.now()
        })
        .eq("id", claimId);

    if (error) {
        console.error("Error unlocking:", error);
    } else {
        console.log("✅ Claim unlocked successfully.");
    }
}

unlockClaim();

