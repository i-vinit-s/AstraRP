"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  FileQuestion,
  Loader2,
  Settings,
  ShieldCheck,
  SquareStack,
} from "lucide-react";

import api from "@/lib/api";

import ApplicationSettingsTab from "@/components/staff/application-builder/ApplicationSettingsTab";
import ApplicationSectionsTab from "@/components/staff/application-builder/ApplicationSectionsTab";
import ApplicationQuestionsTab from "@/components/staff/application-builder/ApplicationQuestionsTab";
import ApplicationRequirementsTab from "@/components/staff/application-builder/ApplicationRequirementsTab";

const tabs = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
  {
    id: "sections",
    label: "Sections",
    icon: SquareStack,
  },
  {
    id: "questions",
    label: "Questions",
    icon: FileQuestion,
  },
  {
    id: "requirements",
    label: "Requirements",
    icon: ShieldCheck,
  },
];

export default function ApplicationBuilderPage() {
  const { user } = useAuth();

  const canManage = user?.canManageApplications;
  const { id } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    if (!user) return;

    if (!canManage) {
      router.replace("/");
    }
  }, [user, canManage, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["application-builder", id],

    enabled: Boolean(id) && !!canManage,

    queryFn: async () => {
      const { data } = await api.get(`/staff/application-definitions/${id}`);

      return data;
    },
  });

  if (user && !canManage) {
  return null;
}

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#8c1218]" />
      </div>
    );
  }

  if (error || !data?.application) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.push("/staff/application-management")}
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to application management
        </button>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          {error?.response?.data?.message ||
            "Failed to load application builder."}
        </div>
      </div>
    );
  }

  const application = data.application;

  const sections = Array.isArray(data.sections) ? data.sections : [];

  const questions = Array.isArray(data.questions) ? data.questions : [];

  const unsectionedQuestions = Array.isArray(data.unsectionedQuestions)
    ? data.unsectionedQuestions
    : [];

  const totalQuestions = questions.length;

  return (
    <div className="space-y-8">
      <div>
        <button
          type="button"
          onClick={() => router.push("/staff/application-management")}
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to application management
        </button>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-4xl font-bold sm:text-5xl">
              {application.title}
            </h1>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                application.enabled
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {application.enabled ? "Open" : "Closed"}
            </span>
          </div>

          <p className="mt-3 text-zinc-500">/applications/{application.slug}</p>

          {application.description && (
            <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
              {application.description}
            </p>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-3">
          <StatCard label="Sections" value={sections.length} />

          <StatCard label="Questions" value={totalQuestions} />

          <StatCard
            label="Requirements"
            value={application.requirements?.length || 0}
          />
        </div>
      </div>

      <div className="overflow-x-auto border-b border-white/10">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition ${
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon size={17} />

                {tab.label}

                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#8c1218]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTab === "settings" && (
          <ApplicationSettingsTab
            key={application._id}
            application={application}
          />
        )}

        {activeTab === "sections" && (
          <ApplicationSectionsTab
            applicationId={application._id}
            sections={sections}
          />
        )}

        {activeTab === "questions" && (
          <ApplicationQuestionsTab
            applicationId={application._id}
            sections={sections}
            unsectionedQuestions={unsectionedQuestions}
          />
        )}

        {activeTab === "requirements" && (
          <ApplicationRequirementsTab
            key={`${application._id}-${application.updatedAt}`}
            application={application}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="min-w-24 rounded-2xl border border-white/10 bg-[#111111] px-5 py-4 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>

      <p className="mt-1 text-xs text-zinc-600">{label}</p>
    </div>
  );
}
