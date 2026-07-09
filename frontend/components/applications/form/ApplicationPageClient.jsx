"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import api from "@/lib/api";

import ApplicationForm from "./ApplicationForm";
import StatusBanner from "./StatusBanner";

export default function ApplicationPageClient({ slug }) {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [sections, setSections] = useState([]);

  const [canReapply, setCanReapply] = useState(false);
  const [cooldownEnds, setCooldownEnds] = useState(null);

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Application
  |--------------------------------------------------------------------------
  */

  const loadApplication = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(`/applications/${slug}/form`);

      const loadedApplication = data.application || null;
      const loadedSubmission = data.submission || null;

      /*
       * Normalize answers from:
       *
       * [
       *   {
       *     questionId: "character_name",
       *     answer: "John Smith"
       *   }
       * ]
       *
       * to:
       *
       * {
       *   character_name: "John Smith"
       * }
       */

      let normalizedSubmission = loadedSubmission;

      if (loadedSubmission && Array.isArray(loadedSubmission.answers)) {
        normalizedSubmission = {
          ...loadedSubmission,

          answers: Object.fromEntries(
            loadedSubmission.answers.map((item) => [
              item.questionId,
              item.answer,
            ]),
          ),
        };
      }

      setApplication(loadedApplication);
      setSubmission(normalizedSubmission);

      setSections(Array.isArray(data.sections) ? data.sections : []);

      setCanReapply(data.canReapply ?? data.access?.canReapply ?? false);

      setCooldownEnds(
        data.cooldownEnds ??
          data.access?.cooldownEnds ??
          normalizedSubmission?.cooldownEnds ??
          null,
      );
    } catch (error) {
      console.error("LOAD APPLICATION ERROR:", error);

      setError(
        error.response?.data?.message || "Failed to load this application.",
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) {
        void loadApplication();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadApplication]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-6">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c1218]/15 blur-[160px]" />

        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#8c1218]" />

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Loading Application
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !application) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 py-28">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/15 bg-[#111111] p-8 text-center sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
            Application Error
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Unable to load application
          </h1>

          <p className="mt-5 leading-7 text-zinc-400">
            {error || "The requested application could not be found."}
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submission Status
  |--------------------------------------------------------------------------
  */

  if (submission?.status === "accepted") {
    return (
      <StatusBanner
        type="accepted"
        application={submission}
        applicationDefinition={application}
      />
    );
  }

  if (submission?.status === "pending") {
    return (
      <StatusBanner
        type="pending"
        application={submission}
        applicationDefinition={application}
      />
    );
  }

  if (submission?.status === "rejected") {
    return (
      <StatusBanner
        type="rejected"
        application={submission}
        applicationDefinition={application}
        canReapply={canReapply}
        cooldownEnds={cooldownEnds}
        reloadApplication={loadApplication}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Application Form
  |--------------------------------------------------------------------------
  */

  return (
    <ApplicationForm
      key={submission?._id || submission?.id || `${slug}-new`}
      slug={slug}
      applicationDefinition={application}
      application={submission}
      sections={sections}
      reloadApplication={loadApplication}
    />
  );
}
