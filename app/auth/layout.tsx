import React from 'react';
import { Activity, Shield, FileText, Heart } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 selection:bg-indigo-500/30">
      {/* Left panel - Decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[20vw] h-[20vw] bg-emerald-400/20 rounded-full blur-[60px] animate-bounce-slow"></div>

        <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 text-2xl font-bold mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <Activity size={24} className="text-white" />
            </div>
            MediHelp
          </div>
          <p className="text-blue-100 text-lg font-medium opacity-90">&ldquo;Your Health, Organised.&rdquo;</p>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-700 delay-150 fill-mode-both">
          <div className="space-y-10 max-w-md">
            <div className="flex items-start gap-5 transform transition-all hover:translate-x-2 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-shrink-0 items-center justify-center shadow-xl">
                <Shield size={28} className="text-emerald-300" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">Secure Storage</h3>
                <p className="text-blue-100/80 leading-relaxed text-sm">Bank-level encryption keeping your personal medical records private and secure.</p>
              </div>
            </div>
            <div className="flex items-start gap-5 transform transition-all hover:translate-x-2 duration-300 delay-100">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-shrink-0 items-center justify-center shadow-xl">
                <FileText size={28} className="text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">AI Assistant</h3>
                <p className="text-blue-100/80 leading-relaxed text-sm">Get instant plain-language summaries of complex lab reports directly on your device.</p>
              </div>
            </div>
            <div className="flex items-start gap-5 transform transition-all hover:translate-x-2 duration-300 delay-200">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex flex-shrink-0 items-center justify-center shadow-xl">
                <Heart size={28} className="text-red-300" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">Better Care</h3>
                <p className="text-blue-100/80 leading-relaxed text-sm">Find the right doctors, compare labs, and find treatments exactly when you need them.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="relative flex w-full flex-col justify-center overflow-y-auto bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF4FF_100%)] px-8 py-12 sm:px-16 md:px-24 lg:w-1/2">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_60%)]" />
        <div className="mx-auto w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white/96 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.38)] backdrop-blur sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
