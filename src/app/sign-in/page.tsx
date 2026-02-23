"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">MindWell</span>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Welcome Back</h1>
          <p className="text-[var(--muted)]">Sign in to continue your wellness journey</p>
        </div>

        <div className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-[8px_8px_16px_var(--card-shadow),-8px_-8px_16px_var(--card-shadow-light)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#e94560]/10 border border-[#e94560]/30 text-[#ff6b6b] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[var(--muted)] text-sm font-medium mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-dark)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-dark)] focus:outline-none focus:border-[#e94560] focus:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--muted)] text-sm font-medium mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-dark)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-dark)] focus:outline-none focus:border-[#e94560] focus:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#e94560] to-[#0f3460] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#e94560]/30 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--muted)] text-sm">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-[#e94560] hover:text-[#ff6b6b] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[var(--muted-dark)] hover:text-[var(--foreground)] text-sm transition duration-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
