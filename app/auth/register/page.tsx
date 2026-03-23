'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CalendarDays, Loader2, Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Prefer not to say',
    dob: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    let strength = 0;
    const nextPassword = formData.password;

    if (nextPassword.length > 5) strength += 25;
    if (nextPassword.length > 8) strength += 25;
    if (/[A-Z]/.test(nextPassword)) strength += 25;
    if (/[0-9]/.test(nextPassword) && /[^A-Za-z0-9]/.test(nextPassword)) strength += 25;

    setPasswordStrength(strength);
  }, [formData.password]);

  useEffect(() => {
    let completed = 0;
    const totalFields = 5;

    if (formData.name) completed++;
    if (formData.email) completed++;
    if (formData.dob) completed++;
    if (formData.password) completed++;
    if (formData.confirmPassword && formData.confirmPassword === formData.password) completed++;

    setCompletionPercentage((completed / totalFields) * 100);
  }, [formData]);

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured for registration.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dob: formData.dob
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create your account.');
      }

      if (data.hasSession) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#6366F1']
        });

        toast.success(data.message || 'Account created successfully.');

        setTimeout(() => {
          router.push(data.redirectTo || '/dashboard');
          router.refresh();
        }, 1200);

        return;
      }

      toast.success(data.message || 'Account created. Check your email to confirm before signing in.');
      router.push(data.redirectTo || '/auth/login');
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'Failed to fetch'
          ? 'The app could not reach the registration service. Please check your Supabase URL or network connection.'
          : error instanceof Error
            ? error.message
            : 'Unable to create your account.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="mb-2 text-3xl font-bold text-slate-950">Create Account</h1>
        <p className="text-slate-600">Join MediHelp to take control of your health data.</p>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Profile Completion</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <Progress className="h-1.5" value={completionPercentage} />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 relative group">
            <Label className="text-slate-700" htmlFor="name">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                <User size={16} />
              </div>
              <Input
                className="border-slate-300 bg-white pl-9 text-slate-950 placeholder:text-slate-400"
                id="name"
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                value={formData.name}
              />
            </div>
          </div>

          <div className="space-y-2 relative group">
            <Label className="text-slate-700" htmlFor="dob">
              Date of Birth
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                <CalendarDays size={16} />
              </div>
              <Input
                className="border-slate-300 bg-white pl-9 text-slate-950"
                id="dob"
                onChange={handleInputChange}
                required
                type="date"
                value={formData.dob}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700" htmlFor="gender">
            Gender
          </Label>
          <select
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 sm:h-10"
            id="gender"
            onChange={handleInputChange}
            value={formData.gender}
          >
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
          </select>
        </div>

        <div className="space-y-2 relative group">
          <Label className="text-slate-700" htmlFor="email">
            Email address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
              <Mail size={16} />
            </div>
            <Input
              className="border-slate-300 bg-white pl-9 text-slate-950 placeholder:text-slate-400"
              id="email"
              onChange={handleInputChange}
              placeholder="name@example.com"
              required
              type="email"
              value={formData.email}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 relative group">
            <Label className="text-slate-700" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                <Lock size={16} />
              </div>
              <Input
                className="border-slate-300 bg-white pl-9 text-slate-950 placeholder:text-slate-400"
                id="password"
                onChange={handleInputChange}
                placeholder="Create a strong password"
                required
                type="password"
                value={formData.password}
              />
            </div>
          </div>

          <div className="space-y-2 relative group">
            <Label className="text-slate-700" htmlFor="confirmPassword">
              Confirm
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                <Lock size={16} />
              </div>
              <Input
                className="border-slate-300 bg-white pl-9 text-slate-950 placeholder:text-slate-400"
                id="confirmPassword"
                onChange={handleInputChange}
                placeholder="Repeat your password"
                required
                type="password"
                value={formData.confirmPassword}
              />
            </div>
          </div>
        </div>

        {formData.password.length > 0 ? (
          <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-1">
            <div className="flex h-1.5 w-full gap-1">
              <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= 25 ? getStrengthColor() : 'bg-slate-200'}`} />
              <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= 50 ? getStrengthColor() : 'bg-slate-200'}`} />
              <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= 75 ? getStrengthColor() : 'bg-slate-200'}`} />
              <div className={`h-full flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= 100 ? getStrengthColor() : 'bg-slate-200'}`} />
            </div>
            <p className="text-right text-xs text-slate-500">
              {passwordStrength < 50 ? 'Weak' : passwordStrength < 100 ? 'Good' : 'Strong'}
            </p>
          </div>
        ) : null}

        <Button
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 text-base rounded-xl mt-4"
          disabled={loading || completionPercentage < 100}
          type="submit"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-blue-600 transition-colors hover:text-blue-700" href="/auth/login">
          Sign In instead
        </Link>
      </div>
    </div>
  );
}
