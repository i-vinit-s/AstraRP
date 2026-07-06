"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import ApplicationLayout from "@/components/whitelist/ApplicationLayout";
import StatusBanner from "@/components/whitelist/StatusBanner";

export default function WhitelistPage() {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [canReapply, setCanReapply] = useState(false);
  const [cooldownEnds, setCooldownEnds] = useState(null);

  const load = async () => {
    try {
      setLoading(true);

      const [appRes, questionRes] = await Promise.all([
        api.get("/applications/me"),
        api.get("/applications/questions"),
      ]);

      const application = appRes.data.application;

      if (Array.isArray(application?.answers)) {
        application.answers = Object.fromEntries(
          application.answers.map((item) => [item.questionId, item.answer]),
        );
      }

      setApplication(application || null);
      setCanReapply(appRes.data.canReapply);
      setCooldownEnds(appRes.data.cooldownEnds);

      setQuestions(questionRes.data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909]">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="absolute h-137.5 w-137.5 rounded-full bg-[#8c1218]/15 blur-[180px]" />

        <div className="relative text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-2 border-[#8c1218] border-t-transparent" />

          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Loading Application
          </p>
        </div>
      </main>
    );
  }

  if (application?.status === "accepted") {
    return <StatusBanner type="accepted" application={application} />;
  }

  if (application?.status === "pending") {
    return <StatusBanner type="pending" application={application} />;
  }

  if (application?.status === "rejected") {
    return (
      <StatusBanner
        type="rejected"
        application={application}
        canReapply={canReapply}
        cooldownEnds={cooldownEnds}
        reloadApplication={load}
      />
    );
  }

  return (
    <ApplicationLayout
      application={application}
      questions={questions}
      reloadApplication={load}
    />
  );
}
