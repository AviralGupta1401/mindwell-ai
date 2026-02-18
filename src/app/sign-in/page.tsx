"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MindWell</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your wellness journey</p>
        </div>

        <div className="bg-[#16213e] p-8 rounded-2xl shadow-[8px_8px_16px_#0f1425,-8px_-8px_16px_#1e2a4a]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#e94560]/10 border border-[#e94560]/30 text-[#ff6b6b] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#e94560] focus:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#e94560] focus:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition duration-300"
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
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-[#e94560] hover:text-[#ff6b6b] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition duration-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
