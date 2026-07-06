"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ReviewActions({ applicationId }) {
  const queryClient = useQueryClient();

  const [reason, setReason] = useState("");

  const router = useRouter();

const reviewMutation = useMutation({
  mutationFn: async ({ status }) => {
    const { data } = await api.patch(
      `/staff/applications/${applicationId}`,
      {
        status,
        reason,
      }
    );

    return data;
  },

  onSuccess: () => {
  toast.success("Application reviewed successfully.");

  queryClient.invalidateQueries({
    queryKey: ["staff-applications"],
  });

  router.replace("/staff/applications");
},

  onError: (err) => {
  toast.error(err.response?.data?.message || "Failed to review application.");
},
});

  function review(status) {
    reviewMutation.mutate({ status });
  }

  return (
    <div className="sticky top-8 rounded-2xl border border-white/10 bg-[#111111] p-6">
      <h2 className="text-xl font-semibold">Review Actions</h2>

      {/* <textarea
        rows={6}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional for approval, required for rejection)"
        className="mt-5 w-full rounded-xl border border-white/10 bg-[#0d0d0d] p-4 outline-none"
      /> */}

      <div className="mt-6 space-y-3">
        <button
          onClick={() => review("accepted")}
          disabled={reviewMutation.isPending}
          className="w-full rounded-xl bg-green-600 py-3 font-medium transition hover:bg-green-500"
        >
          Accept
        </button>

        {/* <button
          onClick={() => review("changes_requested")}
          disabled={reviewMutation.isPending}
          className="w-full rounded-xl bg-yellow-600 py-3 font-medium transition hover:bg-yellow-500"
        >
          Request Changes
        </button> */}

        <button
          onClick={() => review("rejected")}
          disabled={reviewMutation.isPending}
          className="w-full rounded-xl bg-red-600 py-3 font-medium transition hover:bg-red-500"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
