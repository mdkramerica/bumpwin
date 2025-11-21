import { login, signup } from "@/app/auth/actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }: { searchParams: { message?: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-4xl font-black font-display text-lime-400 tracking-tighter hover:opacity-80 transition-opacity">
            BUMPWIN
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Or <span className="text-lime-400">create a new one</span> to start your claim.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lime-400 sm:text-sm sm:leading-6 outline-none"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lime-400 sm:text-sm sm:leading-6 outline-none"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-lg bg-lime-400 px-3 py-3 text-sm font-bold text-slate-900 hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 transition-colors"
            >
              Sign in
            </button>
            <button
              formAction={signup}
              className="group relative flex w-full justify-center rounded-lg border border-slate-700 bg-transparent px-3 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Sign up
            </button>
          </div>
          
          {searchParams?.message && (
            <div className="text-center text-sm text-red-400 bg-red-400/10 p-2 rounded">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

