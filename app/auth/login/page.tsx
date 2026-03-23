'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

const DEMO_EMAIL = 'demo@medihelp.app';
const DEMO_PASSWORD = 'MediHelpDemo123!';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const forceLogin = searchParams.get('forceLogin') === '1';

  async function signIn(nextEmail: string, nextPassword: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured for this project.');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: nextEmail,
        password: nextPassword
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to sign in.');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await signIn(email, password);
      toast.success('Signed in successfully.');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'Failed to fetch'
          ? 'The app could not reach the sign-in service. Please check your network connection and try again.'
          : error instanceof Error
            ? error.message
            : 'Unable to sign in.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Enter your email first so we know where to send the reset link.');
      return;
    }

    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured for password reset.');
      return;
    }

    setResettingPassword(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send reset email.');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleUseDemo = async () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setLoading(true);
    setErrorMessage('');

    try {
      await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      toast.success('Signed in with the demo account.');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'Failed to fetch'
          ? 'The app could not reach the sign-in service. Please check your network connection and try again.'
          : error instanceof Error
            ? error.message
            : 'Unable to sign in with the demo account.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="mb-3 text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="text-slate-600">
          Sign in to continue managing your records, appointments, and care plans.
        </p>
      </div>

      {forceLogin ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          You can sign in with another account here, even if a session already exists.
        </div>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2 relative group">
          <Label className="text-slate-700 transition-colors group-focus-within:text-blue-600" htmlFor="email">
            Email address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Mail size={18} />
            </div>
            <Input
              className="h-12 border-slate-300 bg-white pl-10 text-slate-950 placeholder:text-slate-400 focus-visible:ring-blue-500"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </div>
        </div>

        <div className="space-y-2 relative group">
          <div className="flex items-center justify-between">
            <Label className="text-slate-700 transition-colors group-focus-within:text-blue-600" htmlFor="password">
              Password
            </Label>
            <button
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              disabled={resettingPassword}
              onClick={handleForgotPassword}
              type="button"
            >
              {resettingPassword ? 'Sending...' : 'Forgot password?'}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={18} />
            </div>
            <Input
              className="h-12 border-slate-300 bg-white pl-10 text-slate-950 placeholder:text-slate-400 focus-visible:ring-blue-500"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 text-base rounded-xl mt-2"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Demo account</p>
            <p className="mt-1 text-xs text-slate-600">Email: {DEMO_EMAIL}</p>
            <p className="text-xs text-slate-600">Password: {DEMO_PASSWORD}</p>
          </div>
          <Button
            className="h-11 rounded-xl bg-white text-blue-700 hover:bg-blue-100"
            disabled={loading}
            onClick={handleUseDemo}
            type="button"
            variant="outline"
          >
            Use Demo Account
          </Button>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold text-blue-600 transition-colors hover:text-blue-700" href="/auth/register">
          Create an account
        </Link>
      </div>
    </div>
  );
}
