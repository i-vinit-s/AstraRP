"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";

import api from "@/lib/api";

import QuestionInput from "./QuestionInput";
import SaveIndicator from "./SaveIndicator";
import SubmitModal from "./SubmitModal";

import { Button } from "@/components/ui/button";

export default function ApplicationForm({
  slug,
  applicationDefinition,
  application,
  sections = [],
  reloadApplication,
}) {
  const [answers, setAnswers] = useState(application?.answers || {});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Questions
  |--------------------------------------------------------------------------
  */

  const allQuestions = useMemo(() => {
    return sections.flatMap((section) =>
      Array.isArray(section.questions) ? section.questions : [],
    );
  }, [sections]);

  /*
  |--------------------------------------------------------------------------
  | Update Answer
  |--------------------------------------------------------------------------
  */

  function updateAnswer(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));

    setErrors((previous) => {
      if (!previous[questionId]) {
        return previous;
      }

      const next = { ...previous };
      delete next[questionId];

      return next;
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Save Draft
  |--------------------------------------------------------------------------
  */

  const saveDraft = useCallback(async () => {
    if (!slug || allQuestions.length === 0) {
      return null;
    }

    try {
      setSaving(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        }),
      );

      const { data } = await api.post(`/applications/${slug}/draft`, {
        answers: formattedAnswers,
      });

      return data.submission || null;
    } catch (error) {
      console.error("SAVE APPLICATION DRAFT ERROR:", error);

      return null;
    } finally {
      setSaving(false);
    }
  }, [slug, allQuestions.length, answers]);

  /*
  |--------------------------------------------------------------------------
  | Autosave
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (allQuestions.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveDraft();
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [allQuestions.length, saveDraft]);

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function validateApplication() {
    const newErrors = {};

    for (const question of allQuestions) {
      const questionId = String(question.id || question._id);
      const value = answers[questionId];
      const validation = question.validation || {};

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (validation.required && isEmpty) {
        newErrors[questionId] = "This field is required.";
        continue;
      }

      if (
        validation.minLength &&
        typeof value === "string" &&
        value.trim().length < validation.minLength
      ) {
        newErrors[questionId] =
          `Minimum ${validation.minLength} characters required.`;
        continue;
      }

      if (
        validation.maxLength &&
        typeof value === "string" &&
        value.length > validation.maxLength
      ) {
        newErrors[questionId] =
          `Maximum ${validation.maxLength} characters allowed.`;
        continue;
      }

      if (
        validation.min !== undefined &&
        validation.min !== null &&
        value !== "" &&
        Number(value) < validation.min
      ) {
        newErrors[questionId] = `Minimum allowed value is ${validation.min}.`;
        continue;
      }

      if (
        validation.max !== undefined &&
        validation.max !== null &&
        value !== "" &&
        Number(value) > validation.max
      ) {
        newErrors[questionId] = `Maximum allowed value is ${validation.max}.`;
      }
    }

    setErrors(newErrors);

    const firstErrorId = Object.keys(newErrors)[0];

    if (firstErrorId) {
      window.requestAnimationFrame(() => {
        const element = document.getElementById(firstErrorId);

        element?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        element?.focus();
      });

      return false;
    }

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Open Submit Confirmation
  |--------------------------------------------------------------------------
  */

  async function handleSubmitRequest() {
    setSubmitError("");

    if (!validateApplication()) {
      return;
    }

    await saveDraft();

    setSubmitOpen(true);
  }

  /*
  |--------------------------------------------------------------------------
  | Final Submit
  |--------------------------------------------------------------------------
  */

  async function submitApplication() {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      await api.post(`/applications/${slug}/submit`);

      setSubmitOpen(false);

      await reloadApplication?.();
    } catch (error) {
      console.error("SUBMIT APPLICATION ERROR:", error);

      setSubmitError(
        error.response?.data?.message || "Failed to submit your application.",
      );

      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Empty Form
  |--------------------------------------------------------------------------
  */

  if (sections.length === 0 || allQuestions.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-4 py-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c1218]/20 bg-[#8c1218]/10">
            <FileText className="h-8 w-8 text-[#c92a2a]" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            No questions configured
          </h1>

          <p className="mt-4 leading-7 text-zinc-400">
            This application does not currently contain any available questions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#090909] px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        {/* Background */}

        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-100 w-100 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px] sm:h-137.5 sm:w-137.5" />

        <div className="mx-auto max-w-5xl">
          {/* Hero */}

          <header className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
            <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d65b5b] sm:text-xs sm:tracking-[0.35em]">
              {applicationDefinition?.title || "Astra Application"}
            </span>

            <h1 className="mt-7 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Complete Your
              <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
                Application
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
              Complete every question carefully. Detailed and thoughtful
              responses help our staff make a fair decision.
            </p>
          </header>

          {/* Form */}

          <div className="space-y-8">
            {sections.map((section) => {
              const sectionQuestions = Array.isArray(section.questions)
                ? section.questions
                : [];

              if (sectionQuestions.length === 0) {
                return null;
              }

              return (
                <section
                  key={String(section._id || section.title)}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/80"
                >
                  <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c92a2a]">
                      Application Section
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      {section.title || "General"}
                    </h2>

                    {section.description && (
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-8 p-5 sm:p-8">
                    {sectionQuestions.map((question, index) => {
                      const questionId = String(question.id || question._id);

                      return (
                        <QuestionInput
                          key={questionId}
                          index={index + 1}
                          question={{
                            ...question,
                            id: questionId,
                          }}
                          value={
                            answers[questionId] ??
                            (question.type === "checkbox" ? [] : "")
                          }
                          error={errors[questionId]}
                          onChange={(value) => updateAnswer(questionId, value)}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Bottom Actions */}

            <div className="rounded-3xl border border-white/10 bg-[#111111]/80 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <SaveIndicator saving={saving} />

                <Button
                  type="button"
                  disabled={saving || submitting}
                  onClick={handleSubmitRequest}
                  className="h-12 w-full rounded-xl bg-[#8c1218] px-8 text-white shadow-lg shadow-[#8c1218]/20 transition-all hover:bg-[#a41717] sm:w-auto"
                >
                  Submit Application
                </Button>
              </div>

              {submitError && (
                <p className="mt-4 text-sm text-red-400">{submitError}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <SubmitModal
        open={submitOpen}
        onClose={() => {
          if (!submitting) {
            setSubmitOpen(false);
          }
        }}
        onSubmit={submitApplication}
        applicationTitle={applicationDefinition?.title}
      />
    </>
  );
}
