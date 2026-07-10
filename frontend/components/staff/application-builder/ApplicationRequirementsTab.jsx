"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const REQUIREMENT_TYPES = [
  {
    value: "allowlisted",
    label: "Allowlisted",
    description: "User must already be whitelisted.",
  },
  {
    value: "discordRole",
    label: "Discord Role",
    description: "User must have a specific Discord role.",
  },
  {
    value: "permission",
    label: "Permission",
    description: "User must have a specific internal permission.",
  },
  {
    value: "tebex",
    label: "Tebex",
    description: "User must satisfy a Tebex-related requirement.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Custom requirement handled by your backend.",
  },
];

function createEmptyRequirement() {
  return {
    type: "allowlisted",
    value: "",
    message: "",
  };
}

export default function ApplicationRequirementsTab({ application }) {
  const queryClient = useQueryClient();

  const [requirements, setRequirements] = useState(() =>
    Array.isArray(application.requirements)
      ? application.requirements.map((requirement) => ({
          type: requirement.type || "allowlisted",
          value: requirement.value || "",
          message: requirement.message || "",
        }))
      : [],
  );

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${application._id}`,
        payload,
      );

      return data;
    },

    onSuccess: async (data) => {
      toast.success(
        data.message || "Requirements updated successfully.",
      );

      await queryClient.invalidateQueries({
        queryKey: ["application-builder", application._id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["application-definitions"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update requirements.",
      );
    },
  });

  function addRequirement() {
    setRequirements((current) => [
      ...current,
      createEmptyRequirement(),
    ]);
  }

  function updateRequirement(index, field, value) {
    setRequirements((current) =>
      current.map((requirement, currentIndex) =>
        currentIndex === index
          ? {
              ...requirement,
              [field]: value,
            }
          : requirement,
      ),
    );
  }

  function removeRequirement(index) {
    setRequirements((current) =>
      current.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    );
  }

  function handleSave() {
    const normalizedRequirements = requirements.map(
      (requirement) => ({
        type: requirement.type,

        value:
          requirement.type === "allowlisted"
            ? null
            : requirement.value.trim() || null,

        message: requirement.message.trim(),
      }),
    );

    const invalidRequirement = normalizedRequirements.find(
      (requirement) =>
        requirement.type !== "allowlisted" &&
        !requirement.value,
    );

    if (invalidRequirement) {
      toast.error(
        `A value is required for ${invalidRequirement.type} requirements.`,
      );

      return;
    }

    updateMutation.mutate({
      requirements: normalizedRequirements,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111111] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#8c1218]" size={24} />

            <h2 className="text-2xl font-semibold">
              Access Requirements
            </h2>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Define the conditions a user must satisfy before they can
            access this application.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addRequirement}
          className="shrink-0 border-white/10 bg-black/20 hover:bg-white/5"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      {!requirements.length ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <ShieldCheck
              size={24}
              className="text-zinc-600"
            />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            No access requirements
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Anyone who satisfies the normal application access rules
            can access this form.
          </p>

          <Button
            type="button"
            onClick={addRequirement}
            className="mt-6 bg-[#8c1218] text-white hover:bg-[#a41717]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Requirement
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {requirements.map((requirement, index) => {
            const typeConfig = REQUIREMENT_TYPES.find(
              (item) => item.value === requirement.type,
            );

            return (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-[#111111] p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">
                      Requirement {index + 1}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-600">
                      {typeConfig?.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRequirement(index)}
                    className="shrink-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 size={17} />
                  </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Field label="Requirement Type">
                    <select
                      value={requirement.type}
                      onChange={(event) =>
                        updateRequirement(
                          index,
                          "type",
                          event.target.value,
                        )
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
                  </Field>

                  <Field label="Value">
                    <input
                      value={requirement.value}
                      onChange={(event) =>
                        updateRequirement(
                          index,
                          "value",
                          event.target.value,
                        )
                      }
                      disabled={
                        requirement.type === "allowlisted"
                      }
                      placeholder={getValuePlaceholder(
                        requirement.type,
                      )}
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-40`}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Failure Message">
                    <input
                      value={requirement.message}
                      onChange={(event) =>
                        updateRequirement(
                          index,
                          "message",
                          event.target.value,
                        )
                      }
                      placeholder="You do not meet the requirements for this application."
                      className={inputClass}
                    />

                    <p className="mt-2 text-xs text-zinc-600">
                      This message is shown when the user does not
                      satisfy this requirement.
                    </p>
                  </Field>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end border-t border-white/10 pt-6">
        <Button
          type="button"
          disabled={updateMutation.isPending}
          onClick={handleSave}
          className="h-11 bg-[#8c1218] px-6 text-white hover:bg-[#a41717]"
        >
          {updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          Save Requirements
        </Button>
      </div>
    </div>
  );
}

function getValuePlaceholder(type) {
  switch (type) {
    case "discordRole":
      return "Discord role ID";

    case "permission":
      return "Permission name";

    case "tebex":
      return "Tebex package or entitlement ID";

    case "custom":
      return "Custom requirement value";

    default:
      return "No value required";
  }
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]";