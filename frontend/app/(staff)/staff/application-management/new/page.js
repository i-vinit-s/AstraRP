"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  category: "Jobs",
  categoryExclusive: true,
  reapplyCooldownDays: 7,
  maxAttempts: 0,
  route: "",
  order: 0,
  enabled: false,

  badge: {
    text: "CLOSED",
    color: "gray",
  },

  requirements: [],
};

function generateSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateApplicationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        "/staff/application-definitions",
        payload,
      );

      return data;
    },

    onSuccess: async (data) => {
      const application = data.application;

      if (!application?._id) {
        toast.error(
          "Application was created, but the API did not return its ID.",
        );

        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["application-definitions"],
      });

      toast.success("Application Created", { description: "New Application Created Successfully."});

      router.replace(`/staff/application-management/${application._id}`);
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create application.",
      );
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const slug = generateSlug(form.slug || title);

    if (!title) {
      toast.error("Application title is required.");
      return;
    }

    if (!slug) {
      toast.error("A valid application slug is required.");
      return;
    }

    createMutation.mutate({
      title,
      slug,

      description: form.description.trim(),

      category: form.category.trim() || "Jobs",

      categoryExclusive: Boolean(form.categoryExclusive),

      reapplyCooldownDays: Number(form.reapplyCooldownDays),

      maxAttempts: Number(form.maxAttempts),

      route: `/applications/${slug}`,

      order: Number(form.order),

      enabled: Boolean(form.enabled),

      badge: {
        text: form.enabled ? "OPEN" : "CLOSED",
        color: form.enabled ? "green" : "gray",
      },

      requirements: [],
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to applications
      </button>

      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[#8c1218]">
          Astra Staff
        </p>

        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
          Create Application
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Create the base application first. You can configure sections,
          questions, requirements and other settings in the builder afterward.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Application Title" required>
            <input
              value={form.title}
              onChange={(event) => {
                const value = event.target.value;

                setForm((current) => {
                  const previousGeneratedSlug = generateSlug(current.title);

                  const shouldUpdateSlug =
                    !current.slug || current.slug === previousGeneratedSlug;

                  return {
                    ...current,
                    title: value,
                    slug: shouldUpdateSlug ? generateSlug(value) : current.slug,
                  };
                });
              }}
              placeholder="Police Department Application"
              className={inputClass}
              autoFocus
            />
          </Field>

          <Field label="Slug" required>
            <input
              value={form.slug}
              onChange={(event) =>
                updateField("slug", generateSlug(event.target.value))
              }
              placeholder="police-department"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-zinc-600">
              Public route: /applications/
              {form.slug || "your-application"}
            </p>
          </Field>

          <Field label="Category" required>
            <input
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
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

          <Field label="Reapply Cooldown Days">
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
              Use 0 to allow immediate reapplication after rejection.
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
              Use 0 for unlimited attempts.
            </p>
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Description">
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe this application and what applicants should know before applying..."
              className={`${inputClass} h-auto resize-y py-4`}
            />
          </Field>
        </div>

        <div className="mt-8 space-y-4">
          <ToggleCard
            title="Category Exclusive"
            description="Prevent users from having conflicting active applications within this category."
            checked={form.categoryExclusive}
            onChange={(checked) => updateField("categoryExclusive", checked)}
          />

          <ToggleCard
            title="Open Immediately"
            description="If disabled, the application is created as closed so you can finish configuring it before applicants can access it."
            checked={form.enabled}
            onChange={(checked) => updateField("enabled", checked)}
          />
        </div>

        <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="h-11 bg-[#8c1218] px-6 text-white hover:bg-[#a41717]"
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create & Open Builder
          </Button>
        </div>
      </form>
    </div>
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

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]";
