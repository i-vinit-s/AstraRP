"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const REQUIREMENT_TYPES = [
  { value: "allowlisted", label: "Allowlisted" },
  { value: "discordRole", label: "Discord Role" },
  { value: "permission", label: "Permission" },
  { value: "tebex", label: "Tebex" },
  { value: "custom", label: "Custom" },
];

const BADGE_COLORS = ["gray", "green", "red", "yellow", "blue", "purple"];

function getInitialForm(application) {
  return {
    title: application.title || "",
    slug: application.slug || "",
    description: application.description || "",
    category: application.category || "Community",

    categoryExclusive: application.categoryExclusive ?? true,

    reapplyCooldownDays: application.reapplyCooldownDays ?? 7,
    maxAttempts: application.maxAttempts ?? 0,
    order: application.order ?? 0,

    badge: {
      text: application.badge?.text || "",
      color: application.badge?.color || "gray",
    },

    requirements: Array.isArray(application.requirements)
      ? application.requirements.map((requirement) => ({
          type: requirement.type || "allowlisted",
          value: requirement.value || "",
          message: requirement.message || "",
        }))
      : [],
  };
}

function generateSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ApplicationSettingsTab({ application }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(() => getInitialForm(application));

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${application._id}`,
        payload,
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Application settings updated.");

      queryClient.invalidateQueries({
        queryKey: ["application-builder", application._id],
      });

      queryClient.invalidateQueries({
        queryKey: ["application-definitions"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update application settings.",
      );
    },
  });

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateBadge(field, value) {
    setForm((current) => ({
      ...current,

      badge: {
        ...current.badge,
        [field]: value,
      },
    }));
  }

  function addRequirement() {
    setForm((current) => ({
      ...current,

      requirements: [
        ...current.requirements,
        {
          type: "allowlisted",
          value: "",
          message: "",
        },
      ],
    }));
  }

  function updateRequirement(index, field, value) {
    setForm((current) => ({
      ...current,

      requirements: current.requirements.map((requirement, currentIndex) =>
        currentIndex === index
          ? {
              ...requirement,
              [field]: value,
            }
          : requirement,
      ),
    }));
  }

  function removeRequirement(index) {
    setForm((current) => ({
      ...current,

      requirements: current.requirements.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Application title is required.");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Application slug is required.");
      return;
    }

    if (!form.category.trim()) {
      toast.error("Application category is required.");
      return;
    }

    updateMutation.mutate({
      title: form.title.trim(),
      slug: generateSlug(form.slug),
      description: form.description.trim(),
      category: form.category.trim(),

      categoryExclusive: Boolean(form.categoryExclusive),

      reapplyCooldownDays: Number(form.reapplyCooldownDays),
      maxAttempts: Number(form.maxAttempts),
      order: Number(form.order),

      badge: form.badge.text.trim()
        ? {
            text: form.badge.text.trim(),
            color: form.badge.color,
          }
        : {
            text: "",
            color: "gray",
          },

      requirements: form.requirements.map((requirement) => ({
        type: requirement.type,
        value: requirement.value?.trim() || null,
        message: requirement.message?.trim() || "",
      })),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <FormSection
            title="Basic Information"
            description="Configure the public identity and categorization of this application."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Application Title" required>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Emergency Medical Services"
                  className={inputClass}
                />
              </Field>

              <Field label="Slug" required>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", generateSlug(event.target.value))
                  }
                  placeholder="emergency-medical-services"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Route: /applications/{form.slug || "your-slug"}
                </p>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe this application..."
                className={`${inputClass} h-auto resize-y py-4`}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Category" required>
                <input
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Jobs"
                  className={inputClass}
                />
              </Field>

              <Field label="Display Order">
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(event) => updateField("order", event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Application Rules"
            description="Configure category conflicts, reapplication cooldown and attempt limits."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Reapply Cooldown">
                <input
                  type="number"
                  min="0"
                  value={form.reapplyCooldownDays}
                  onChange={(event) =>
                    updateField("reapplyCooldownDays", event.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Days a rejected applicant must wait before applying again.
                </p>
              </Field>

              <Field label="Maximum Attempts">
                <input
                  type="number"
                  min="0"
                  value={form.maxAttempts}
                  onChange={(event) =>
                    updateField("maxAttempts", event.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Set to 0 for unlimited attempts.
                </p>
              </Field>
            </div>

            <ToggleCard
              title="Category Exclusive"
              description="Prevent users from having conflicting active applications within this category."
              checked={form.categoryExclusive}
              onChange={(checked) => updateField("categoryExclusive", checked)}
            />
          </FormSection>

          {/* <FormSection
            title="Access Requirements"
            description="Define the conditions a user must satisfy before accessing this application."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Requirement
              </Button>
            }
          >
            {!form.requirements.length ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
                <p className="text-sm text-zinc-500">
                  No access requirements configured.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-[180px_1fr_auto]">
                      <select
                        value={requirement.type}
                        onChange={(event) =>
                          updateRequirement(index, "type", event.target.value)
                        }
                        className={inputClass}
                      >
                        {REQUIREMENT_TYPES.map((type) => (
                          <option
                            key={type.value}
                            value={type.value}
                            className="bg-[#111111]"
                          >
                            {type.label}
                          </option>
                        ))}
                      </select>

                      <input
                        value={requirement.value || ""}
                        onChange={(event) =>
                          updateRequirement(index, "value", event.target.value)
                        }
                        disabled={requirement.type === "allowlisted"}
                        placeholder={getRequirementPlaceholder(
                          requirement.type,
                        )}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-40`}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                        className="h-12 w-12 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <input
                      value={requirement.message}
                      onChange={(event) =>
                        updateRequirement(index, "message", event.target.value)
                      }
                      placeholder="Message shown when the requirement is not met..."
                      className={`${inputClass} mt-4`}
                    />
                  </div>
                ))}
              </div>
            )}
          </FormSection> */}
        </div>

        <div className="space-y-8">
          {/* <FormSection
            title="Badge"
            description="Configure the public badge shown for this application."
          >
            <Field label="Badge Text">
              <input
                value={form.badge.text}
                onChange={(event) => updateBadge("text", event.target.value)}
                placeholder="OPEN"
                className={inputClass}
              />
            </Field>

            <Field label="Badge Color">
              <select
                value={form.badge.color}
                onChange={(event) => updateBadge("color", event.target.value)}
                className={inputClass}
              >
                {BADGE_COLORS.map((color) => (
                  <option key={color} value={color} className="bg-[#111111]">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            {form.badge.text && (
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Preview
                </p>

                <BadgePreview text={form.badge.text} color={form.badge.color} />
              </div>
            )}
          </FormSection> */}

          <div className="sticky top-8 rounded-3xl border border-white/10 bg-[#111111] p-6">
            <h3 className="text-lg font-semibold">Save Changes</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Changes to the slug will also update the public application route.
            </p>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="mt-6 h-12 w-full rounded-xl bg-[#8c1218] text-white hover:bg-[#a41717]"
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function FormSection({ title, description, action, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>

          {description && (
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="space-y-6 p-6 sm:p-8">{children}</div>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      {children}
    </label>
  );
}

function ToggleCard({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div>
        <p className="font-medium text-white">{title}</p>

        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-[#8c1218]" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function BadgePreview({ text, color }) {
  const colors = {
    gray: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    red: "border-red-500/20 bg-red-500/10 text-red-400",
    yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${
        colors[color] || colors.gray
      }`}
    >
      {text}
    </span>
  );
}

function getRequirementPlaceholder(type) {
  switch (type) {
    case "discordRole":
      return "Discord role ID";

    case "permission":
      return "Permission name";

    case "tebex":
      return "Tebex package ID";

    case "custom":
      return "Custom requirement value";

    default:
      return "No value required";
  }
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]";
