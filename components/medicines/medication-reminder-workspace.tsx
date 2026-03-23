"use client";

import { BellRing, Clock3, Package2, Pill, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PlanUpgradeNudge } from "@/components/PlanGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  createMedicationReminder,
  getMedicationReminders,
  markMedicationTaken,
  removeMedicationReminder,
  saveMedicationReminders,
  shouldNotify,
  subscribeToMedicationReminders,
  toggleMedicationReminder,
  type MedicationReminder
} from "@/lib/medication-reminders";
import { getMockPlan, PLAN_LIMITS } from "@/lib/mock-plan";
import { formatCompactDate } from "@/lib/utils";

const TIME_PRESETS = [
  { label: "Morning", value: "08:00" },
  { label: "Afternoon", value: "14:00" },
  { label: "Night", value: "21:00" }
] as const;

export function MedicationReminderWorkspace() {
  const [canUseReminders, setCanUseReminders] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    inventoryCount: "10",
    refillThreshold: "3",
    times: ["08:00"] as string[]
  });

  useEffect(() => {
    const plan = getMockPlan();
    setCanUseReminders(PLAN_LIMITS[plan].reminders);
  }, []);

  useEffect(() => {
    const current = getMedicationReminders();
    setReminders(current);
    return subscribeToMedicationReminders(setReminders);
  }, []);

  useEffect(() => {
    setNotificationsEnabled(
      typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted"
    );
  }, []);

  useEffect(() => {
    if (!canUseReminders) {
      return;
    }

    const interval = window.setInterval(() => {
      const currentReminders = getMedicationReminders();
      const now = new Date();
      let updated = currentReminders;
      let changed = false;

      currentReminders.forEach((reminder) => {
        if (!shouldNotify(reminder, now)) {
          return;
        }

        changed = true;
        updated = updated.map((item) =>
          item.id === reminder.id
            ? {
                ...item,
                lastNotifiedAt: now.toISOString()
              }
            : item
        );

        toast.message(`Time to take ${reminder.name}`, {
          description: `${reminder.dosage} scheduled now. ${reminder.inventoryCount} doses left.`
        });

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("MediHelp medication reminder", {
            body: `${reminder.name} • ${reminder.dosage}. ${reminder.inventoryCount} doses left.`
          });
        }
      });

      if (changed) {
        saveMedicationReminders(updated);
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, [canUseReminders]);

  const lowStockCount = useMemo(
    () => reminders.filter((reminder) => reminder.inventoryCount <= reminder.refillThreshold).length,
    [reminders]
  );

  async function handleEnableNotifications() {
    if (!("Notification" in window)) {
      toast.error("Browser notifications are not supported here.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setNotificationsEnabled(true);
      toast.success("Medication reminders can now send browser notifications.");
      return;
    }

    toast.error("Notification permission was not granted.");
  }

  function handleToggleTime(value: string) {
    setForm((current) => {
      const nextTimes = current.times.includes(value)
        ? current.times.filter((time) => time !== value)
        : [...current.times, value];

      return {
        ...current,
        times: nextTimes.length ? nextTimes : [value]
      };
    });
  }

  function handleCreateReminder() {
    if (!form.name.trim() || !form.dosage.trim()) {
      toast.error("Add a medicine name and dosage to create a reminder.");
      return;
    }

    const nextReminder = createMedicationReminder({
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      times: form.times,
      inventoryCount: Number(form.inventoryCount || 0),
      refillThreshold: Number(form.refillThreshold || 0),
      enabled: true
    });

    const updated = [nextReminder, ...reminders];
    setReminders(updated);
    saveMedicationReminders(updated);
    setForm({
      name: "",
      dosage: "",
      inventoryCount: "10",
      refillThreshold: "3",
      times: ["08:00"]
    });
    toast.success(`${nextReminder.name} added to your medication reminders.`);
  }

  function handleTaken(reminderId: string) {
    const updated = markMedicationTaken(reminders, reminderId);
    setReminders(updated);
    saveMedicationReminders(updated);
    const reminder = updated.find((item) => item.id === reminderId);

    toast.success(
      reminder
        ? `${reminder.name} marked as taken. ${reminder.inventoryCount} doses left.`
        : "Medication marked as taken."
    );
  }

  if (!canUseReminders) {
    return <PlanUpgradeNudge compact feature="Medication reminders & refill alerts" requiredPlan="premium" />;
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">Medication reminders</p>
              <p className="text-sm text-slate-500">
                Log doses, get browser reminders, and auto-track the stock left after each dose.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-50 text-blue-700">{reminders.length} medicines tracked</Badge>
            <Badge className="bg-amber-50 text-amber-700">{lowStockCount} low stock</Badge>
            <Button onClick={handleEnableNotifications} variant={notificationsEnabled ? "secondary" : "outline"}>
              {notificationsEnabled ? "Notifications enabled" : "Enable browser notifications"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Add medicine reminder</p>
          <div className="mt-5 grid gap-4">
            <Input
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Medicine name"
              value={form.name}
            />
            <Input
              onChange={(event) => setForm((current) => ({ ...current, dosage: event.target.value }))}
              placeholder="Dosage e.g. 1 tablet after food"
              value={form.dosage}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                min="1"
                onChange={(event) => setForm((current) => ({ ...current, inventoryCount: event.target.value }))}
                placeholder="Doses left"
                type="number"
                value={form.inventoryCount}
              />
              <Input
                min="1"
                onChange={(event) => setForm((current) => ({ ...current, refillThreshold: event.target.value }))}
                placeholder="Refill threshold"
                type="number"
                value={form.refillThreshold}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Reminder times</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TIME_PRESETS.map((preset) => (
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium active:scale-95 ${
                      form.times.includes(preset.value)
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600"
                    }`}
                    key={preset.value}
                    onClick={() => handleToggleTime(preset.value)}
                    type="button"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleCreateReminder}>Save reminder</Button>
          </div>
        </Card>

        <Card className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-semibold text-slate-950">Active medications</p>
          <div className="mt-5 space-y-4">
            {reminders.length ? (
              reminders.map((reminder) => (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4" key={reminder.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <p className="text-base font-semibold text-slate-950">{reminder.name}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{reminder.dosage}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={(checked) => {
                          const updated = toggleMedicationReminder(reminders, reminder.id, checked);
                          setReminders(updated);
                          saveMedicationReminders(updated);
                          toast.success(
                            checked
                              ? `${reminder.name} reminder enabled.`
                              : `${reminder.name} reminder paused.`
                          );
                        }}
                      />
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 active:scale-95"
                        onClick={() => {
                          const updated = removeMedicationReminder(reminders, reminder.id);
                          setReminders(updated);
                          saveMedicationReminders(updated);
                          toast.success(`${reminder.name} removed from reminders.`);
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-[0.14em]">Times</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{reminder.times.join(", ")}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Package2 className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-[0.14em]">Stock left</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{reminder.inventoryCount} doses</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Next reminder</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">
                        {reminder.nextReminderAt ? formatCompactDate(reminder.nextReminderAt) : "Paused"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">
                      {reminder.inventoryCount <= reminder.refillThreshold ? (
                        <span className="font-medium text-amber-700">Refill soon: stock is running low.</span>
                      ) : reminder.lastTakenAt ? (
                        <span>Last taken on {formatCompactDate(reminder.lastTakenAt)}</span>
                      ) : (
                        <span>No dose marked as taken yet.</span>
                      )}
                    </div>
                    <Button onClick={() => handleTaken(reminder.id)}>Medication taken</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                Add your first medicine to start reminders and dose tracking.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
