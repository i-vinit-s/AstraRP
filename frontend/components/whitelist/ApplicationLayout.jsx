"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import QuestionCard from "./QuestionCard";
import QuestionInput from "./QuestionInput";
import Navigation from "./Navigation";
import SaveIndicator from "./SaveIndicator";
import ReviewCard from "./ReviewCard";
import SubmitModal from "./SubmitModal";

import api from "@/lib/api";

export default function ApplicationLayout({
  application,
  questions,
  reloadApplication,
}) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState(application?.answers ?? {});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const sections = useMemo(() => {
    const grouped = {};

    questions.forEach((question) => {
      const key = question.category || "General";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(question);
    });

    return Object.entries(grouped).map(([title, questions]) => ({
      title,
      questions,
    }));
  }, [questions]);

  const currentSection = sections[step];

  function updateAnswer(id, value) {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const saveDraft = useCallback(async () => {
    try {
      setSaving(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        }),
      );

      const { data } = await api.post("/applications/me", {
        answers: formattedAnswers,
      });

      return data.application;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setSaving(false);
    }
  }, [answers]);

  useEffect(() => {
    if (questions.length === 0) return;

    const timeout = setTimeout(() => {
      saveDraft();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [questions.length, saveDraft]);

  async function submit() {
    try {
      await api.post("/applications/me/submit");

      setSubmitOpen(false);

      await reloadApplication();
    } catch (err) {
      console.error(err);
    }
  }

  function handleNext() {
    // Review page
    if (step >= sections.length) {
      setSubmitOpen(true);
      return;
    }

    const currentSection = sections[step];

    const newErrors = {};

    for (const question of currentSection.questions) {
      const value = answers[question.id];

      if (question.required && (!value || value.toString().trim() === "")) {
        newErrors[question.id] = "This field is required.";
        continue;
      }

      if (question.minLength && value && value.length < question.minLength) {
        newErrors[question.id] =
          `Minimum ${question.minLength} characters required.`;
      }
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);

      const first = document.getElementById(Object.keys(newErrors)[0]);

      first?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      first?.focus();

      return;
    }

    setErrors({});
    setStep((prev) => prev + 1);
  }

  return (
    <>
      <div className="relative">
        {/* Background */}

        <div className="absolute inset-0 -z-10 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="absolute left-1/2 top-0 -z-10 h-112.5 w-112.5 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px]" />

        {/* Hero */}

        <div className="mb-14 text-center">
          <span className="inline-flex rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#d65b5b]">
            Whitelist Application
          </span>

          <h1 className="mt-8 text-5xl font-black uppercase leading-none tracking-tight lg:text-6xl">
            Continue Your
            <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
              Application
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Complete every section carefully. Your answers help our staff
            understand the type of roleplayer you&apos;ll be inside Astra.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                Step {step + 1} of {sections.length + 1}
              </span>

              <span className="text-sm font-semibold text-[#8c1218]">
                {Math.round(((step + 1) / (sections.length + 1)) * 100)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-[#8c1218] transition-all duration-500"
                style={{
                  width: `${((step + 1) / (sections.length + 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Layout */}

        <div className="mx-auto max-w-5xl">

          {/* Main */}

          <div className="space-y-10">
            <div className="rounded-3xl border border-white/10 bg-[#111111]/70 p-8 backdrop-blur-xl">
              {step < sections.length ? (
                
                <QuestionCard title={currentSection.title}>
                  {currentSection.questions.map((question, index) => (
                    <QuestionInput
                      index={index + 1}
                      key={question.id}
                      question={question}
                      value={answers[question.id] || ""}
                      error={errors[question.id]}
                      onChange={(value) => {
                        updateAnswer(question.id, value);

                        setErrors((prev) => ({
                          ...prev,
                          [question.id]: "",
                        }));
                      }}
                    />
                  ))}
                </QuestionCard>
              ) : (
                <ReviewCard sections={sections} answers={answers} />
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111111]/70 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <SaveIndicator saving={saving} />

                <Navigation
                  current={step}
                  total={sections.length}
                  onBack={() => setStep((prev) => Math.max(prev - 1, 0))}
                  onNext={handleNext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}
