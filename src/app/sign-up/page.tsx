"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignUpPage() {
  const [name, setName] = useState("");
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
    
    if (password.length < 8) {
      setError("password must be at least 8 characters");
      return;
    }
    
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
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
          <h1 className="text-3xl font-bold text-white mb-2">join the club</h1>
          <p className="text-[#666]">start your wellness journey today</p>
        </div>

        <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#666] text-sm font-medium mb-3">name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
                required
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#222] rounded-lg text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition duration-300"
              />
            </div>

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
                minLength={8}
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#222] rounded-lg text-white placeholder-[#444] focus:outline-none focus:border-[#00ff88] transition duration-300"
              />
              <p className="text-xs text-[#444] mt-1">at least 8 characters</p>
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
                  create account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#666] text-sm">
              already have an account?{" "}
              <Link href="/sign-in" className="text-[#00ff88] hover:text-[#00cc6a] font-medium">
                sign in
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
