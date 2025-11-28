"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = headersList.get("origin") || `${protocol}://${host}`;

  console.log("Attempting signup for:", email);

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

