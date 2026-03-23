"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { UserProfile } from "@/types";

export function ProfileSettings({
  profile
}: {
  profile: UserProfile | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: profile?.name || "",
    gender: profile?.gender || "",
    dob: profile?.dob || "",
    email: profile?.email || "",
    password: ""
  });

  async function handleSaveProfile() {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Configure Supabase to update your profile.");
      }

      const supabase = createBrowserSupabaseClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You need to be logged in.");
      }

      const { error } = await supabase.from("users_profile").upsert({
        id: user.id,
        name: form.name,
        gender: form.gender,
        dob: form.dob,
        email: form.email
      });

      if (error) {
        throw error;
      }

      const { error: authError } = await supabase.auth.updateUser({
        email: form.email,
        data: {
          name: form.name,
          gender: form.gender,
          dob: form.dob
        }
      });

      if (authError) {
        throw authError;
      }

      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile");
    }
  }

  async function handleChangePassword() {
    try {
      if (!form.password) {
        throw new Error("Enter a new password first.");
      }

      if (!isSupabaseConfigured()) {
        throw new Error("Configure Supabase to change your password.");
      }

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: form.password
      });

      if (error) {
        throw error;
      }

      setForm((current) => ({ ...current, password: "" }));
      toast.success("Password updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password");
    }
  }

  async function handleDeleteAccount() {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete account");
      }

      toast.success("Account deleted");
      window.location.assign("/auth/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete account");
    }
  }

  async function handleSignOut() {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
      }

      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out");
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-semibold text-primary">
          {(form.name || "MH")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-slate-600">
            Keep your personal information current for appointments and care recommendations.
          </p>
        </div>
        <div className="sm:self-start">
          <Button className="w-full sm:w-auto" onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </section>
      <Card className="space-y-4 rounded-[28px] border border-slate-200 p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 sm:h-10"
              onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              value={form.gender}
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>DOB</Label>
            <Input onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))} type="date" value={form.dob} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={form.email} />
          </div>
        </div>
        <div className="flex justify-stretch sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={handleSaveProfile}>Save Profile</Button>
        </div>
      </Card>
      <Card className="space-y-4 rounded-[28px] border border-slate-200 p-5 shadow-sm sm:p-6" id="password-section">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Password change</h2>
          <p className="mt-1 text-sm text-slate-500">Choose a strong new password for your account.</p>
        </div>
        <div className="space-y-2">
          <Label>New password</Label>
          <Input
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            type="password"
            value={form.password}
          />
        </div>
        <div className="flex justify-stretch sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={handleChangePassword} variant="secondary">
            Update Password
          </Button>
        </div>
      </Card>
      <Card className="space-y-4 rounded-[28px] border border-rose-200 p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Delete account</h2>
          <p className="mt-1 text-sm text-slate-500">
            This permanently removes your profile and requires the service role key to be configured.
          </p>
        </div>
        <div className="flex justify-stretch sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={handleDeleteAccount} variant="outline">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
