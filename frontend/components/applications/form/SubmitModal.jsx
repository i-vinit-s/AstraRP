"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border  border-white/10  bg-[#0f0f10] p-0  text-white shadow-[0_0_80px_rgba(140,18,24,0.18)] sm:max-w-2xl">
        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#8c1218]/20 blur-[130px]" />

          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-red-600/5 blur-[90px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[26px_26px] opacity-30" />
        </div>

        {/* Hero */}

        <div className="relative border-b border-white/10 px-6 py-7 sm:px-10 sm:py-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-3xl border border-[#8c1218]/30 bg-linear-to-br from-[#8c1218]/20 to-[#8c1218]/5">
              <AlertTriangle className="h-9 w-9 text-[#d63b42]" />
            </div>

            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d13a3f]">
                <Sparkles className="h-3.5 w-3.5" />
                Final Confirmation
              </span>

              <DialogHeader className="mt-5 text-left">
                <DialogTitle className="text-3xl font-black tracking-tight sm:text-4xl">
                  Submit Your
                  <span className="block bg-linear-to-r from-white via-white to-zinc-500 bg-clip-text text-transparent">
                    Application
                  </span>
                </DialogTitle>

                <DialogDescription className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400">
                  You are about to submit your{" "}
                  <span className="font-semibold text-white">
                    {applicationTitle}
                  </span>
                  . Once submitted, your answers become read-only until a staff
                  member reviews your application.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="relative space-y-6 px-6 py-7 sm:px-10">

          {/* Warning */}

          <div className="rounded-2xl border border-[#8c1218]/25 bg-[#8c1218]/8 p-5">
            <div className="flex gap-4">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#d13a3f]" />

              <div>
                <p className="font-semibold text-white">
                  False information may result in rejection.
                </p>

                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  Applications containing misleading, copied, AI-generated,
                  low-effort, or intentionally false information may be rejected
                  without notice and could affect future applications.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
              <p className="text-sm leading-7 text-red-300">{error}</p>
            </div>
          )}

          {/* Footer */}

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Ready to submit?
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  By clicking{" "}
                  <span className="font-medium text-white">
                    Submit Application
                  </span>
                  , you confirm that all the information provided is accurate to
                  the best of your knowledge.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={onClose}
                  className="h-12 min-w-35 rounded-xl border-white/10 bg-white/3 px-6 text-white transition-all hover:border-white/20 hover:bg-white/6"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="group h-12 min-w-55 rounded-xl bg-linear-to-r from-[#8c1218] to-[#b91f27] px-7 text-white shadow-lg shadow-[#8c1218]/25 transition-all duration-200 hover:scale-[1.02] hover:from-[#a41717] hover:to-[#cf2d35] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle2 className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
