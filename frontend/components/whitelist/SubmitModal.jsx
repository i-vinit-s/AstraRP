"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function SubmitModal({ open, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      await onSubmit();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className=" max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto rounded-3xl border  border-white/10  bg-[#111111]/95 p-0  text-white backdrop-blur-2xl"
     >
        {/* Glow */}

        <div className="absolute left-1/2 top-0 -z-10 h-87.5 w-87.5 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[140px]" />

        {/* Header */}

        <div className="border-b border-white/10 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#8c1218]/20 bg-[#8c1218]/10 sm:h-20 sm:w-20">
              <AlertTriangle className="h-8 w-8 text-[#8c1218] sm:h-10 sm:w-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#8c1218]">
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
                  You&apos;re about to permanently submit your whitelist
                  application. After submission, editing will be disabled until
                  a staff member reviews it.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div
          className="flex flex-col-reverse gap-3 border-t border-white/10  bg-black/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10"
        >
          <Button
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="h-12 w-full rounded-xl border-white/10 bg-white/3 text-white hover:border-white/20 hover:bg-white/5 sm:w-auto sm:px-6"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="h-12 w-full rounded-xl bg-[#8c1218] shadow-lg shadow-[#8c1218]/20 transition-all hover:bg-[#a41717] sm:w-auto sm:px-7"
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
