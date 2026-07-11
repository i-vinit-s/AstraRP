"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertTriangle } from "lucide-react";

export default function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
  loading = false,
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-white/10 bg-[#111111]">
        <AlertDialogHeader>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
            <AlertTriangle size={26} className="text-yellow-400" />
          </div>

          <AlertDialogTitle className="text-2xl">
            Unsaved Changes
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 leading-7 text-zinc-400">
            You have unsaved changes.
            <br />
            <br />
            If you leave this page now, all unsaved changes will be permanently
            lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            onClick={onStay}
            className="border-white/10 bg-[#1a1a1a] hover:bg-[#222]"
          >
            Stay
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onLeave}
            className="bg-red-600 hover:bg-red-500"
          >
            Leave Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
