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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    email: "",
    password: ""
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured()) {
      toast.error("Add Supabase environment variables to enable registration.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            gender: form.gender,
            dob: form.dob
          }
        }
      });

      if (error) {
        throw error;
      }

      const userId = data.user?.id;

      if (userId) {
        const { error: profileError } = await supabase.from("users_profile").upsert({
          id: userId,
          name: form.name,
          gender: form.gender,
          dob: form.dob,
          email: form.email
        });

        if (profileError) {
          throw profileError;
        }
      }

      if (!data.session) {
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        });
      }

      toast.success("Account created");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md rounded-2xl p-6 shadow-soft sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Create your MediHelp account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Save your medical records and organize your care journey.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:h-10"
                id="gender"
                onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
                required
              >
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">DOB</Label>
              <Input id="dob" onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))} required type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required type="password" />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-primary" href="/auth/login">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
