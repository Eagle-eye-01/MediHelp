// Simulates billing state - replace with Razorpay/Stripe in production
// TODO: Replace with real billing table in Supabase
export type Plan = "free" | "premium" | "enterprise";

export const MOCK_PLAN_KEY = "medihelp_mock_plan";
export const MOCK_PLAN_EVENT = "medihelp-plan-change";

export function getMockPlan(): Plan {
  if (typeof window === "undefined") return "free";
  return (localStorage.getItem(MOCK_PLAN_KEY) as Plan) || "free";
}

export function setMockPlan(plan: Plan) {
  localStorage.setItem(MOCK_PLAN_KEY, plan);
  window.dispatchEvent(new CustomEvent(MOCK_PLAN_EVENT, { detail: plan }));
}

export const PLAN_LIMITS = {
  free: { documents: 5, aiTrialMatching: false, reminders: false },
  premium: { documents: Infinity, aiTrialMatching: true, reminders: true },
  enterprise: { documents: Infinity, aiTrialMatching: true, reminders: true }
};

const PLAN_RANK: Record<Plan, number> = {
  free: 0,
  premium: 1,
  enterprise: 2
};

export function planMeetsRequirement(plan: Plan, requiredPlan: Plan) {
  return PLAN_RANK[plan] >= PLAN_RANK[requiredPlan];
}

export function subscribeToMockPlan(listener: (plan: Plan) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<Plan>;
    listener(customEvent.detail || getMockPlan());
  };

  window.addEventListener(MOCK_PLAN_EVENT, handler);
  return () => window.removeEventListener(MOCK_PLAN_EVENT, handler);
}
