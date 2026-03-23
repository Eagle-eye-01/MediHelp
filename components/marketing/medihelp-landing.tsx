"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  FileHeart,
  FlaskConical,
  HeartPulse,
  Hospital,
  Instagram,
  Linkedin,
  MapPin,
  Pill,
  ScanText,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  TestTube2,
  Twitter,
  UploadCloud,
  UserRoundPlus,
  WandSparkles
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useIntersection } from "@/lib/hooks/useIntersection";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTypewriter } from "@/lib/hooks/useTypewriter";
import { calculateDistanceKm, cn, formatCoordinates, formatDistanceKm } from "@/lib/utils";

import { Reveal } from "./reveal";
import { RippleButton } from "./ripple-button";

type MediHelpLandingProps = {
  authenticated?: boolean;
};

const featureCards = [
  {
    icon: ScanText,
    title: "AI Document Analysis",
    description: "Upload records and let MediHelp extract diagnoses, patient details, and next steps in seconds."
  },
  {
    icon: FileHeart,
    title: "Smart Document Storage",
    description: "Medical files stay organised, searchable, and automatically renamed with meaningful labels."
  },
  {
    icon: Hospital,
    title: "Find Hospitals & Doctors",
    description: "Locate specialists nearby with ratings, specializations, and availability in one workflow."
  },
  {
    icon: TestTube2,
    title: "Lab Test Finder",
    description: "Compare tests, turnaround times, and pricing before you book the right lab."
  },
  {
    icon: Pill,
    title: "Medicine Search",
    description: "Read prescriptions with AI and compare pharmacy pricing without manual searching."
  },
  {
    icon: FlaskConical,
    title: "Clinical Trial Finder",
    description: "Discover active studies matched to your condition, age, location, and language preferences."
  }
];

const steps = [
  {
    icon: UserRoundPlus,
    title: "Register & create your profile",
    description: "Set up your health identity once so every document and recommendation stays personalised."
  },
  {
    icon: UploadCloud,
    title: "Upload your medical documents",
    description: "Drag in reports, scans, prescriptions, or snap a quick photo from your phone."
  },
  {
    icon: WandSparkles,
    title: "Get AI insights and find care near you",
    description: "Receive plain-language summaries, care suggestions, and nearby providers in one calm dashboard."
  }
];

const hospitalCards = [
  {
    id: "landing-1",
    name: "Apollo Specialty Care",
    rating: 4.8,
    location: "Teynampet, Chennai",
    subtitle: "Cardiology, endocrinology, diagnostics",
    coordinates: { lat: 13.0418, lng: 80.2341 }
  },
  {
    id: "landing-2",
    name: "SRM Medical College Hospital",
    rating: 4.7,
    location: "Kattankulathur, Chengalpattu",
    subtitle: "Emergency care, multispeciality consults, student medical access",
    coordinates: { lat: 12.8232, lng: 80.0444 }
  },
  {
    id: "landing-3",
    name: "Chengalpattu Medical Centre",
    rating: 4.9,
    location: "Chengalpattu",
    subtitle: "Trauma, diagnostics, same-day specialist referrals",
    coordinates: { lat: 12.6916, lng: 79.9766 }
  }
];

const districtHints = [
  { label: "Kattankulathur, Chengalpattu district", lat: 12.8232, lng: 80.0444 },
  { label: "Tambaram, Chennai district", lat: 12.9249, lng: 80.1000 },
  { label: "Guindy, Chennai district", lat: 13.0104, lng: 80.2205 },
  { label: "Chengalpattu district", lat: 12.6819, lng: 79.9836 },
  { label: "OMR corridor, Chennai district", lat: 12.8408, lng: 80.1532 }
];

const testimonials = [
  {
    name: "Priya R.",
    initials: "PR",
    condition: "Diabetes management",
    quote:
      "MediHelp turned a folder of confusing PDFs into clear updates I can actually act on. It feels like having a calm health coordinator."
  },
  {
    name: "Arjun S.",
    initials: "AS",
    condition: "Post-surgery recovery",
    quote:
      "The hospital finder saved hours. I uploaded my discharge summary and found the right follow-up specialist near me in one evening."
  },
  {
    name: "Nisha K.",
    initials: "NK",
    condition: "Thyroid care",
    quote:
      "Daily AI health tips and organized reports make every appointment smoother. I finally feel prepared instead of overwhelmed."
  }
];

const aiSummarySamples = [
  "Hemoglobin is slightly below the optimal range. MediHelp suggests reviewing iron intake and scheduling a repeat CBC in 4 weeks.",
  "Prescription indicates Type 2 diabetes follow-up. We found your medicines, the average monthly price range, and three nearby labs.",
  "Your latest lipid panel improved since January. Today's focus: hydration, a 20-minute walk, and consistent medication timing."
];

export function MediHelpLanding({ authenticated: _authenticated = false }: MediHelpLandingProps) {
  const isMobile = useIsMobile();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { ref: stepsRef, isIntersecting: stepsVisible } = useIntersection<HTMLDivElement>({
    threshold: 0.35
  });

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isMobile]);

  return (
    <main className="animate-page-in overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-8%] top-[8%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-mesh-float" />
          <div className="absolute right-[-6%] top-[18%] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-mesh-float-delayed" />
          <div className="absolute bottom-[16%] left-[18%] h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl animate-mesh-float-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(37,99,235,0.08)_1px,transparent_0)] [background-size:36px_36px]" />
        </div>

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <LogoMark />
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950">MediHelp</p>
              <p className="text-sm text-slate-500">Your Health, Organised.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link className="transition-colors hover:text-blue-600" href="#features">
              Features
            </Link>
            <Link className="transition-colors hover:text-blue-600" href="#how-it-works">
              How It Works
            </Link>
            <Link className="transition-colors hover:text-blue-600" href="#testimonials">
              Stories
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <RippleButton
              className="bg-white/80 text-slate-700 shadow-sm hover:bg-white"
              href="/auth/login?forceLogin=1"
              variant="outline"
            >
              Sign In
            </RippleButton>
            <RippleButton href="/auth/register">
              Create Account
            </RippleButton>
          </div>
        </header>

        <section className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="min-w-0 max-w-2xl">
              <Reveal delay={0}>
                <Badge className="border border-blue-200 bg-white/80 px-4 py-1.5 text-sm text-blue-700 shadow-sm backdrop-blur">
                  Premium AI health workspace
                </Badge>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  <span className="text-gradient-animated bg-[linear-gradient(120deg,#2563EB_0%,#6366F1_35%,#2563EB_70%,#10B981_100%)] bg-[length:220%_220%] bg-clip-text text-transparent">
                    Your Health, Organised.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Upload medical records, get AI insights, find hospitals and labs near you, and stay one step ahead of your care journey.
                </p>
              </Reveal>

              <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row" delay={300}>
                <RippleButton
                  className="justify-center shadow-[0_22px_50px_-24px_rgba(37,99,235,0.95)]"
                  href="/auth/register"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </RippleButton>
                <RippleButton
                  className="justify-center bg-white/85 text-slate-700 shadow-sm hover:bg-white"
                  href="#how-it-works"
                  variant="outline"
                >
                  See How It Works
                </RippleButton>
              </Reveal>

              <Reveal className="mt-10" delay={400}>
                <div className="max-w-xl rounded-[28px] border border-blue-100 bg-white/88 p-5 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.32)] backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                    Clear from the first click
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    Start with a real account flow, upload records when you are ready, and move through hospitals, labs, and medicines without being dropped into a demo session.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal className="relative" delay={250}>
              <HeroDashboardMockup />
            </Reveal>
          </div>

          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center text-slate-400 lg:flex">
            <span className="text-xs font-medium uppercase tracking-[0.24em]">Scroll</span>
            <ChevronDown className="mt-2 h-5 w-5 animate-bounce-soft" />
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="features">
        <Reveal>
          <SectionHeading
            eyebrow="Everything you need to manage your health"
            title="Calm, intelligent tools built for every step of care"
            description="MediHelp brings documents, hospitals, labs, medicines, and clinical research into one thoughtful product experience."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 100}>
              <Card className="group h-full rounded-[28px] border border-slate-200/80 bg-white/85 p-7 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.28)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-[0_24px_70px_-30px_rgba(37,99,235,0.38)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-50 to-white text-blue-700 shadow-inner transition-transform duration-300 group-hover:scale-105">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="how-it-works">
        <Reveal>
          <SectionHeading
            eyebrow="Get started in 3 simple steps"
            title="A guided flow that keeps the hard parts feeling easy"
            description="From sign-up to care discovery, each step is designed to reduce friction and help you move confidently."
          />
        </Reveal>

        <div className="relative mt-14" ref={stepsRef}>
          <div className="absolute left-8 right-8 top-14 hidden h-[2px] origin-left bg-slate-200 lg:block">
            <div
              className={cn(
                "h-full origin-left rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-transform duration-[1400ms] ease-out",
                stepsVisible ? "scale-x-100" : "scale-x-0"
              )}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 140}>
                <Card className="relative h-full rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_24px_70px_-30px_rgba(37,99,235,0.24)]">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-slate-200">0{index + 1}</span>
                    <h3 className="max-w-xs text-xl font-semibold text-slate-950">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-600">{step.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <Badge className="border border-white/10 bg-white/10 px-4 py-1.5 text-sm text-blue-100">
              AI Insights Preview
            </Badge>
            <h2 className="mt-6 max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Understand every medical document without the clinical jargon.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              MediHelp transforms scattered records into readable, actionable insight cards your whole family can understand.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Extracts patient name and disease from documents",
                "Generates plain-language health summaries",
                "Provides 3 personalised health tips daily",
                "Reads prescriptions and finds medicines"
              ].map((item, index) => (
                <Reveal key={item} delay={index * 120}>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                    <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-base text-slate-200">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:pl-6" delay={200}>
            <AIInsightsPreview />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Hospital & Labs Preview"
              title="Find the right care nearby, faster"
              description="Map-first discovery helps you compare hospitals, doctors, and labs while keeping clinical context within reach."
            />
            <MapPreview />
          </Reveal>

          <div className="space-y-4 pt-4">
            {hospitalCards.map((hospitalCard, index) => (
              <Reveal key={hospitalCard.name} delay={index * 140}>
                <Card className="group rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-[0_24px_70px_-30px_rgba(37,99,235,0.32)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{hospitalCard.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{hospitalCard.subtitle}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700">{hospitalCard.rating} rating</Badge>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{hospitalCard.location}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={`${hospitalCard.name}-${starIndex}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="testimonials">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Families rely on MediHelp to feel prepared, not overwhelmed"
            description="A calmer care experience shows up in every appointment, prescription refill, and follow-up call."
          />
        </Reveal>

        <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 120}>
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 lg:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="w-full shrink-0 pr-1">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                aria-label={`Show testimonial ${index + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 active:scale-95",
                  activeTestimonial === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300"
                )}
                key={testimonial.name}
                onClick={() => setActiveTestimonial(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_55%,#10B981_100%)] p-10 text-white shadow-[0_28px_90px_-30px_rgba(37,99,235,0.62)] sm:p-14">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)] animate-gradient-shift" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-100">Take control of your health today.</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    One place for records, insights, hospitals, labs, and next steps.
                  </h2>
                </div>
                <RippleButton
                  className="bg-white text-blue-700 shadow-lg hover:bg-blue-50"
                  href="/auth/register"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </RippleButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-10 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="text-lg font-semibold text-slate-950">MediHelp</p>
                <p className="text-sm text-slate-500">Your Health, Organised.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A premium personal health management experience that keeps your records, recommendations, and care network aligned.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn
              links={[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" }
              ]}
              title="Product"
            />
            <FooterColumn
              links={[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms" }
              ]}
              showIcon
              title="Company"
            />
            <div>
              <p className="text-sm font-semibold text-slate-950">Social</p>
              <div className="mt-4 flex gap-3">
                {[Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <Reveal delay={index * 80} key={`${index}-${Icon.name}`}>
                    <Link
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-blue-300 hover:text-blue-600 active:scale-95"
                      href="/"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Built with AI for better healthcare.</p>
          <p>Designed for calm, clarity, and faster decisions.</p>
        </div>
      </footer>
    </main>
  );
}

function LogoMark() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 shadow-[0_12px_30px_-12px_rgba(37,99,235,0.8)]">
      <ShieldCheck className="h-6 w-6 text-white/90" />
      <Activity className="absolute h-3.5 w-3.5 text-emerald-100" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}

function HeroDashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] min-w-0">
      <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-2 shadow-[0_32px_90px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:rounded-[32px] sm:p-3">
        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-2 shadow-inner sm:rounded-[28px] sm:p-3">
          <div className="flex items-center gap-2 rounded-[18px] bg-slate-900 px-3 py-3 sm:rounded-[22px] sm:px-4">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="ml-2 h-9 flex-1 truncate rounded-full bg-white/5 px-3 py-2 text-xs text-slate-400 sm:ml-3 sm:px-4 sm:text-sm">
              medihelp.app/dashboard
            </div>
          </div>

          <div className="mt-3 rounded-[20px] bg-white p-4 text-slate-900 sm:rounded-[24px] sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">Good morning, Priya</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Your health overview</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700">Synced just now</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Documents", value: "28" },
                  { label: "Nearby hospitals", value: "12" },
                  { label: "Conditions tracked", value: "04" }
                ].map((item) => (
                  <div
                    className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 transition-transform duration-300 hover:scale-[1.02]"
                    key={item.label}
                  >
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Upload trend</p>
                      <p className="text-lg font-semibold text-slate-950">Last 30 days</p>
                    </div>
                    <HeartPulse className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="mt-5 flex h-32 items-end gap-3">
                    {[32, 64, 48, 82, 70, 92, 84].map((height, index) => (
                      <div
                        className="flex-1 rounded-t-full bg-gradient-to-t from-blue-600 via-indigo-500 to-blue-300 shadow-inner"
                        key={height}
                        style={{
                          height: `${height}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">AI tip of the day</p>
                      <p className="font-semibold">Stay hydrated before tests</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      "CBC follow-up recommended",
                      "Medication reminder set",
                      "Nearest lab opens at 7:30 AM"
                    ].map((item) => (
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">Nearby specialists</p>
                    <p className="text-lg font-semibold text-slate-950">Cardiology</p>
                  </div>
                  <Stethoscope className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">Dr. Kavya Raman</p>
                    <p className="text-sm text-slate-500">Apollo Specialty Care</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700">Available today</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInsightsPreview() {
  const typedText = useTypewriter(aiSummarySamples, {
    typeSpeed: 24,
    deleteSpeed: 16,
    pauseMs: 1700
  });

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_28px_90px_-40px_rgba(2,6,23,0.85)] backdrop-blur sm:rounded-[32px]">
      <div className="rounded-[24px] border border-white/10 bg-slate-900 p-4 sm:rounded-[28px] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-slate-400">Gemini-powered AI insight</p>
            <p className="text-xl font-semibold text-white sm:text-2xl">Today&apos;s care summary</p>
          </div>
          <Badge className="bg-blue-500/15 text-blue-100">Live analysis</Badge>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Plain-language summary</p>
              <p className="text-base font-semibold text-white">Based on latest uploads</p>
            </div>
          </div>
          <p className="mt-5 min-h-[104px] text-base leading-8 text-slate-200 sm:text-lg">
            {typedText}
            <span className="ml-1 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-blue-300" />
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Extracted patient", value: "Priya Raman" },
            { label: "Flagged condition", value: "Iron deficiency" },
            { label: "Suggested next step", value: "Repeat CBC in 4 weeks" }
          ].map((item) => (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4" key={item.label}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapPreview() {
  const { coords, loading, error } = useGeolocation({ immediate: true, maximumAge: 60000 });
  const rankedLocations = hospitalCards
    .map((item) => ({
      ...item,
      distanceKm: coords
        ? calculateDistanceKm(coords.latitude, coords.longitude, item.coordinates.lat, item.coordinates.lng)
        : null
    }))
    .sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) {
        return a.distanceKm - b.distanceKm;
      }

      return b.rating - a.rating;
    });
  const closestMatch = rankedLocations[0];
  const nearestDistrict = coords
    ? districtHints
        .map((item) => ({
          ...item,
          distanceKm: calculateDistanceKm(coords.latitude, coords.longitude, item.lat, item.lng)
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)[0]
    : null;
  const liveLocationLabel = coords
    ? nearestDistrict?.label || "Nearby Chennai region"
    : loading
      ? "Locating your device..."
      : error || "Enable location to personalize nearby care";

  return (
    <div className="relative mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] p-3 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.3)] sm:rounded-[32px] sm:p-4">
      <div className="relative h-[440px] overflow-hidden rounded-[24px] border border-blue-100 bg-white sm:h-[360px] sm:rounded-[28px]">
        <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/12/2105/1330.png')] bg-cover bg-center opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.24))]" />

        <div className="absolute left-[28%] top-[34%]">
          <PinPulse pulseClassName="bg-blue-600" />
        </div>
        <div className="absolute left-[60%] top-[50%]">
          <PinPulse pulseClassName="bg-red-500" />
        </div>
        <div className="absolute left-[74%] top-[22%]">
          <PinPulse pulseClassName="bg-indigo-500" />
        </div>

        <div className="absolute left-4 top-4 rounded-2xl border border-white/85 bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live map</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Nearby hospitals and labs</p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 grid min-w-0 gap-3 sm:bottom-5 sm:left-5 sm:right-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)]">
          <div className="group rounded-[24px] border border-white/80 bg-white/92 p-4 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Closest match</p>
                <p className="break-words text-lg font-semibold text-slate-950">{closestMatch.name}</p>
              </div>
              <Badge className="bg-blue-50 text-blue-700">
                {closestMatch.distanceKm != null ? formatDistanceKm(closestMatch.distanceKm) : "Nearby care"}
              </Badge>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-slate-700 transition-all duration-300 group-hover:line-clamp-none">
              {closestMatch.subtitle}
            </p>
          </div>
          <div className="group rounded-[24px] border border-white/80 bg-slate-950/90 px-4 py-4 text-white shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">You are here</p>
            <p className="mt-2 break-words text-sm font-semibold">{liveLocationLabel}</p>
            <p className="mt-2 break-words line-clamp-2 text-xs text-slate-400 transition-all duration-300 group-hover:line-clamp-none">
              {coords
                ? `${formatCoordinates(coords.latitude, coords.longitude)} · Live device location is powering nearby recommendations.`
                : "Location remains optional."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PinPulse({ pulseClassName }: { pulseClassName: string }) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      <span className={cn("absolute h-8 w-8 rounded-full opacity-50 animate-pulse-ring", pulseClassName)} />
      <span className={cn("absolute h-5 w-5 rounded-full border-4 border-white shadow-lg", pulseClassName)} />
    </div>
  );
}

function TestimonialCard({
  name,
  initials,
  condition,
  quote
}: {
  name: string;
  initials: string;
  condition: string;
  quote: string;
}) {
  return (
    <Card className="h-full rounded-[28px] border border-slate-200 bg-white/95 p-7 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.26)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-[0_24px_70px_-30px_rgba(37,99,235,0.26)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-lg font-semibold text-white shadow-soft">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-950">{name}</p>
            <p className="text-sm text-slate-500">{condition}</p>
          </div>
        </div>
        <QuoteMark />
      </div>
      <p className="mt-6 text-base leading-8 text-slate-600">{quote}</p>
    </Card>
  );
}

function QuoteMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <span className="text-2xl font-semibold leading-none">&ldquo;</span>
    </div>
  );
}

function FooterColumn({
  title,
  links,
  showIcon = false
}: {
  title: string;
  links: { href: string; label: string }[];
  showIcon?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600"
            href={link.href}
            key={link.label}
          >
            {showIcon ? <ShieldCheck className="h-4 w-4 text-blue-500" /> : null}
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
