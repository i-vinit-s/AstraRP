"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ReviewActions from "@/components/staff/ReviewActions";
import { questionMap } from "@/lib/questionMap";

export default function StaffApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

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
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
        Failed to load application.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-zinc-400 hover:text-white"
      >
        ← Back
      </button>

      <div className="rounded-2xl border border-white/10 bg-[#111111] p-8">
        <h1 className="text-3xl font-bold">
          {application.user.globalName || application.user.username}
        </h1>

        <p className="mt-2 text-zinc-400">@{application.user.username}</p>

        <div className="mt-6 flex gap-6 text-sm text-zinc-500">
          <span>
            Submitted: {new Date(application.submittedAt).toLocaleString()}
          </span>

          <span>Status: {application.status}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {application.answers.map((answer) => (
            <div
              key={answer.questionId}
              className="rounded-2xl border border-white/10 bg-[#111111] p-6"
            >
              <h3 className="text-lg font-semibold">
                {questionMap[answer.questionId] || answer.questionId}
              </h3>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                <div
                  className="h-44 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all pr-2 leading-7 text-zinc-300"
                >
                  {answer.answer || (
                    <span className="italic text-zinc-600">
                      No answer provided.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReviewActions applicationId={application._id} />
      </div>
    </div>
  );
}
