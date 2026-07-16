"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  Hash,
  Loader2,
  User,
} from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReviewActions from "@/components/staff/ReviewActions";

export default function StaffApplicationPage() {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const canReview = currentUser?.canReviewApplications;

  useEffect(() => {
    if (!currentUser) return;

    if (!canReview) {
      router.replace("/");
    }
  }, [currentUser, canReview, router]);

  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff-application", id],
    queryFn: async () => {
      const { data } = await api.get(`/staff/applications/${id}`);

      return data.application;
    },

    enabled: Boolean(id) && !!canReview,
  });

  if (currentUser && !canReview) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#8c1218]" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        {error?.response?.data?.message ||
          "Failed to load application."}
      </div>
    );
  }

  const user = application.user;
  const applicationDefinition = application.application;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Back */}

      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </button>

      {/* Header */}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
        <div className="border-b border-white/10 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={application.status} />

                {applicationDefinition?.title && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400">
                    {applicationDefinition.title}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                {user?.globalName ||
                  user?.username ||
                  "Unknown Applicant"}
              </h1>

              <p className="mt-2 text-zinc-500">
                @{user?.username || "unknown"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
              <InfoCard
                icon={Hash}
                label="Attempt"
                value={`#${application.attempt || 1}`}
              />

              <InfoCard
                icon={User}
                label="Discord ID"
                value={user?.discordId || "Unknown"}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          <MetadataItem
            icon={FileText}
            label="Application"
            value={applicationDefinition?.title || "Unknown"}
          />

          <MetadataItem
            icon={CalendarDays}
            label="Submitted"
            value={formatDate(application.submittedAt)}
          />

          <MetadataItem
            icon={Clock3}
            label="Created"
            value={formatDate(application.createdAt)}
          />

          <MetadataItem
            icon={FileText}
            label="Category"
            value={applicationDefinition?.category || "Uncategorized"}
          />
        </div>
      </section>

      {/* Content */}

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Answers */}

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Application Answers
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {application.answers?.length || 0} submitted answers.
            </p>
          </div>

          {application.answers?.length > 0 ? (
            application.answers.map((answer, index) => (
              <AnswerCard
                key={`${answer.questionId}-${index}`}
                answer={answer}
                index={index}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-20 text-center">
              <FileText className="mx-auto h-8 w-8 text-zinc-700" />

              <h3 className="mt-5 text-lg font-semibold text-white">
                No answers found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                This submission does not contain any answers.
              </p>
            </div>
          )}
        </div>

        {/* Review */}

        <ReviewActions
          applicationId={application._id}
          status={application.status}
        />
      </div>
    </div>
  );
}

function AnswerCard({ answer, index }) {
  const question = answer.question;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#8c1218]/20 bg-[#8c1218]/10 text-sm font-bold text-[#d13a3f]">
            {index + 1}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold leading-7 text-white">
              {question?.title || answer.questionId}
            </h3>

            {question?.description && (
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                {question.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="max-h-96 overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-2xl border border-white/10 bg-[#090909] p-5 text-sm leading-7 text-zinc-300">
          {renderAnswer(answer.answer)}
        </div>
      </div>
    </article>
  );
}

function renderAnswer(answer) {
  if (
    answer === null ||
    answer === undefined ||
    answer === ""
  ) {
    return (
      <span className="italic text-zinc-600">
        No answer provided.
      </span>
    );
  }

  if (Array.isArray(answer)) {
    return answer.length > 0
      ? answer.join(", ")
      : (
          <span className="italic text-zinc-600">
            No answer provided.
          </span>
        );
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  if (typeof answer === "object") {
    return JSON.stringify(answer, null, 2);
  }

  return String(answer);
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#090909] p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="mt-2 truncate text-sm font-medium text-zinc-300">
        {value}
      </p>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#0d0d0d] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-300">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    draft: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    accepted:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    rejected: "border-red-500/20 bg-red-500/10 text-red-400",
    closed: "border-white/10 bg-white/5 text-zinc-400",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
        styles[status] || styles.closed
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}