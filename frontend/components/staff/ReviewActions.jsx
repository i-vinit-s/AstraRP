"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ReviewActions({ applicationId, status }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");

  const isPending = status === "pending";

  const reviewMutation = useMutation({
    mutationFn: async ({ reviewStatus }) => {
      const { data } = await api.patch(`/staff/applications/${applicationId}`, {
        status: reviewStatus,
        reason: reason.trim(),
      });

      return data;
    },

    onSuccess: async (data) => {
      toast.success(data.message || "Application Reviewed", {description: "Application Reviewed Successfully."});

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff-applications"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-application", applicationId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["staff-dashboard"],
        }),
      ]);

      router.replace("/staff/applications");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to review application.",
      );
    },
  });

  function review(reviewStatus) {
    if (reviewMutation.isPending) {
      return;
    }

    if (reviewStatus === "rejected" && !reason.trim()) {
      toast.error("Please provide a reason before rejecting.");
      return;
    }

    reviewMutation.mutate({
      reviewStatus,
    });
  }

  if (!isPending) {
    return (
      <aside className="sticky top-8 rounded-3xl border border-white/10 bg-[#111111] p-6">
        <h2 className="text-xl font-semibold text-white">Review Complete</h2>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          This application has already been reviewed and cannot be reviewed
          again.
        </p>

        <div className="mt-6">
          <StatusBadge status={status} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">
      <div className="border-b border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white">Review Application</h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Accept or reject this application. A reason is required when
          rejecting.
        </p>
      </div>

      <div className="p-6">
        <label
          htmlFor="review-reason"
          className="text-sm font-medium text-zinc-300"
        >
          Review reason
        </label>

        <textarea
          id="review-reason"
          rows={6}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={reviewMutation.isPending}
          placeholder="Required for rejection. Optional for acceptance."
          className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-[#090909] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]/60 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <p className="mt-2 text-xs text-zinc-600">
          {reason.trim().length} characters
        </p>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            onClick={() => review("accepted")}
            disabled={reviewMutation.isPending}
            className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            {reviewMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Accept Application
          </Button>

          <Button
            type="button"
            onClick={() => review("rejected")}
            disabled={reviewMutation.isPending || !reason.trim()}
            className="h-12 w-full rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600/30 disabled:text-red-300/50"
          >
            {reviewMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Reject Application
          </Button>
        </div>
      </div>
    </aside>
  );
}

function StatusBadge({ status }) {
  const styles = {
    accepted: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    rejected: "border-red-500/20 bg-red-500/10 text-red-400",

    pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",

    draft: "border-blue-500/20 bg-blue-500/10 text-blue-400",

    closed: "border-white/10 bg-white/5 text-zinc-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
        styles[status] || styles.closed
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}
