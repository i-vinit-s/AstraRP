"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function SubmitModal({
  open,
  onClose,
  onSubmit,
  applicationTitle = "Application",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      await onSubmit();
    } catch (error) {
      console.error("SUBMIT MODAL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit your application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(nextOpen) {
    if (loading) return;

    if (!nextOpen) {
      setError("");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111]/95 p-0 text-white backdrop-blur-2xl">
        {/* Glow */}

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-87.5 w-87.5 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[140px]" />

        {/* Header */}

        <div className="border-b border-white/10 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 sm:h-20 sm:w-20">
              <AlertTriangle className="h-8 w-8 text-[#c92a2a] sm:h-10 sm:w-10" />
            </div>

            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c92a2a]">
                Final Confirmation
              </span>

              <DialogHeader className="mt-2">
                <DialogTitle className="text-3xl font-black uppercase leading-none sm:text-4xl">
                  Submit
                  <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                    Application
                  </span>
                </DialogTitle>

                <DialogDescription className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
                  You&apos;re about to submit your{" "}
                  <span className="font-medium text-zinc-200">
                    {applicationTitle}
                  </span>
                  . Once submitted, you won&apos;t be able to edit your answers
                  while the application is under staff review.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Warning */}

        <div className="px-5 py-5 sm:px-8 lg:px-10">
          <div className="rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/5 p-5">
            <p className="text-sm font-semibold text-white">
              Before submitting
            </p>

            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Make sure every answer is accurate and complete. Low-effort,
              misleading, or false responses may result in rejection.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4">
              <p className="text-sm leading-6 text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-black/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="h-12 w-full rounded-xl border-white/10 bg-white/3 text-white hover:border-white/20 hover:bg-white/5 sm:w-auto sm:px-6"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="h-12 w-full rounded-xl bg-[#8c1218] text-white shadow-lg shadow-[#8c1218]/20 transition-all hover:bg-[#a41717] sm:w-auto sm:px-7"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
