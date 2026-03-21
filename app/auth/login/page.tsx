"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured()) {
      toast.error("Add Supabase environment variables to enable login.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Welcome back");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md rounded-2xl p-6 shadow-soft sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Welcome to MediHelp</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to view documents, hospitals, labs, and reminders.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" onChange={(event) => setEmail(event.target.value)} required type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" onChange={(event) => setPassword(event.target.value)} required type="password" />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link className="font-semibold text-primary" href="/auth/register">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
