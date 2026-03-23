"use client";

export type MedicationReminder = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  inventoryCount: number;
  refillThreshold: number;
  enabled: boolean;
  lastTakenAt?: string | null;
  nextReminderAt?: string | null;
  lastNotifiedAt?: string | null;
};

export const MEDICATION_REMINDERS_KEY = "medihelp_medication_reminders";
export const MEDICATION_REMINDERS_EVENT = "medihelp-medication-reminders-change";

function dispatchMedicationEvent(reminders: MedicationReminder[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(MEDICATION_REMINDERS_EVENT, { detail: reminders }));
}

export function getMedicationReminders() {
  if (typeof window === "undefined") {
    return [] as MedicationReminder[];
  }

  try {
    const raw = localStorage.getItem(MEDICATION_REMINDERS_KEY);
    return raw ? (JSON.parse(raw) as MedicationReminder[]) : [];
  } catch {
    return [];
  }
}

export function saveMedicationReminders(reminders: MedicationReminder[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(MEDICATION_REMINDERS_KEY, JSON.stringify(reminders));
  dispatchMedicationEvent(reminders);
}

export function subscribeToMedicationReminders(
  listener: (reminders: MedicationReminder[]) => void
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<MedicationReminder[]>;
    listener(customEvent.detail || getMedicationReminders());
  };

  window.addEventListener(MEDICATION_REMINDERS_EVENT, handler);
  return () => window.removeEventListener(MEDICATION_REMINDERS_EVENT, handler);
}

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function computeNextReminderAt(times: string[], now = new Date()) {
  if (!times.length) {
    return null;
  }

  const sortedTimes = [...times].sort((a, b) => minutesFromTime(a) - minutesFromTime(b));
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const time of sortedTimes) {
    if (minutesFromTime(time) > currentMinutes) {
      const next = new Date(now);
      const [hours, minutes] = time.split(":").map(Number);
      next.setHours(hours, minutes, 0, 0);
      return next.toISOString();
    }
  }

  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  const [hours, minutes] = sortedTimes[0].split(":").map(Number);
  nextDay.setHours(hours, minutes, 0, 0);
  return nextDay.toISOString();
}

export function createMedicationReminder(
  values: Omit<MedicationReminder, "id" | "nextReminderAt" | "lastTakenAt" | "lastNotifiedAt">
) {
  return {
    ...values,
    id: crypto.randomUUID(),
    lastTakenAt: null,
    lastNotifiedAt: null,
    nextReminderAt: computeNextReminderAt(values.times)
  } satisfies MedicationReminder;
}

export function markMedicationTaken(reminders: MedicationReminder[], id: string) {
  const now = new Date();

  return reminders.map((reminder) => {
    if (reminder.id !== id) {
      return reminder;
    }

    return {
      ...reminder,
      inventoryCount: Math.max(0, reminder.inventoryCount - 1),
      lastTakenAt: now.toISOString(),
      lastNotifiedAt: null,
      nextReminderAt: computeNextReminderAt(reminder.times, now)
    };
  });
}

export function toggleMedicationReminder(reminders: MedicationReminder[], id: string, enabled: boolean) {
  return reminders.map((reminder) => {
    if (reminder.id !== id) {
      return reminder;
    }

    return {
      ...reminder,
      enabled,
      nextReminderAt: enabled ? computeNextReminderAt(reminder.times) : null
    };
  });
}

export function removeMedicationReminder(reminders: MedicationReminder[], id: string) {
  return reminders.filter((reminder) => reminder.id !== id);
}

export function shouldNotify(reminder: MedicationReminder, now = new Date()) {
  if (!reminder.enabled || !reminder.nextReminderAt) {
    return false;
  }

  const nextReminder = new Date(reminder.nextReminderAt);
  const lastNotified = reminder.lastNotifiedAt ? new Date(reminder.lastNotifiedAt) : null;
  const due = nextReminder.getTime() <= now.getTime();

  if (!due) {
    return false;
  }

  if (!lastNotified) {
    return true;
  }

  return lastNotified.getTime() < nextReminder.getTime();
}
