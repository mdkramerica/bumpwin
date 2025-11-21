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
  const origin = headersList.get("origin");

  const { error } = await supabase.auth.signUp({
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

  // Attempt to sign in immediately in case auto-confirm is on
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
      // Likely "Email not confirmed"
      if (signInError.message.includes("Email not confirmed")) {
          redirect(`/login?message=Please check your email to confirm your account.`);
      }
      redirect(`/login?message=${encodeURIComponent(signInError.message)}`);
  }

  redirect("/dashboard");
}

