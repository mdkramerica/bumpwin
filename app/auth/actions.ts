"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Robust URL determination
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  
  // 1. Prefer NEXT_PUBLIC_SITE_URL (Explicit Production URL)
  // 2. Prefer VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL (Vercel Auto-Env)
  // 3. Fallback to Request Headers
  let origin = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!origin && process.env.VERCEL_URL) {
    origin = `https://${process.env.VERCEL_URL}`;
  }
  
  if (!origin) {
     origin = headersList.get("origin") || `${protocol}://${host}`;
  }

  console.log("Attempting signup for:", email);
  console.log("Redirect Origin:", origin);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  // If auto-confirm is ON, we might get a session immediately.
  if (data.session) {
      console.log("Signup successful, session created immediately.");
      redirect("/dashboard");
  }

  // If no session, it might require email confirmation OR we can try to sign in.
  // Attempt to sign in immediately to check status
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
      console.log("Immediate sign-in failed:", signInError.message);
      // Likely "Email not confirmed"
      if (signInError.message.includes("Email not confirmed")) {
          redirect(`/login?message=Please check your email to confirm your account.`);
      }
      redirect(`/login?message=${encodeURIComponent(signInError.message)}`);
  }

  redirect("/dashboard");
}

