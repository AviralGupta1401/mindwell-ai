"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data } = await authClient.getSession();
    if (data?.session) {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#00ff88] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              <span className="text-xl font-bold text-black">M</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">welcome back</h1>
          <p className="text-[#666]">continue your wellness journey</p>
        </div>

        <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#666] text-sm font-medium mb-3">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#222] rounded-lg text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition duration-300"
              />
            </div>

            <div>
              <label className="block text-[#666] text-sm font-medium mb-3">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#222] rounded-lg text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00ff88] text-black rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  sign in <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#666] text-sm">
              don't have an account?{" "}
              <Link href="/sign-up" className="text-[#00ff88] hover:text-[#00cc6a] font-medium">
                sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#444] hover:text-white text-sm transition duration-300">
            ← back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
