"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { loginAdmin } from "@/lib/api/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError("");

    try {
      await loginAdmin({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#07111f] px-4">
      <div className="w-full max-w-[420px] rounded-[28px] border border-white/10 bg-white p-7 shadow-[0_30px_90px_rgba(0,0,0,.35)]">
        <div className="mb-7 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#10294c] font-display text-lg font-black text-[#8fe6d6]">
            A
          </span>

          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Admin login
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Sign in to Almajrah workspace
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-slate-600">
            Email
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-deep focus:ring-4 focus:ring-teal/10"
                placeholder="admin@almajrah.com"
              />
            </div>
          </label>

          <label className="mt-4 block text-xs font-bold text-slate-600">
            Password
            <div className="relative mt-2">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-deep focus:ring-4 focus:ring-teal/10"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#07111f] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#10294c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}