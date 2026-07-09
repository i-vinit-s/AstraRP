"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Loader2, RefreshCw } from "lucide-react";

import ApplicationCategory from "./ApplicationCategory";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ApplicationsLayout() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Applications
  |--------------------------------------------------------------------------
  */

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/applications");

      setApplications(
        Array.isArray(data.applications) ? data.applications : [],
      );
    } catch (error) {
      console.error("LOAD APPLICATIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load applications. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) {
        loadApplications();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadApplications]);

  /*
  |--------------------------------------------------------------------------
  | Group Applications By Category
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const grouped = new Map();

    const sortedApplications = [...applications].sort((a, b) => {
      const orderDifference = (a.order || 0) - (b.order || 0);

      if (orderDifference !== 0) {
        return orderDifference;
      }

      return (a.title || "").localeCompare(b.title || "");
    });

    for (const application of sortedApplications) {
      const category = application.category || "Community";

      if (!grouped.has(category)) {
        grouped.set(category, []);
      }

      grouped.get(category).push(application);
    }

    return Array.from(grouped.entries()).map(
      ([title, categoryApplications]) => ({
        title,
        applications: categoryApplications,
      }),
    );
  }, [applications]);

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
            Loading Applications
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

  if (error) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] px-4 py-28 sm:px-6">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

        <div className="w-full max-w-xl rounded-3xl border border-red-500/15 bg-[#111111] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
            Application Error
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Unable to load applications
          </h1>

          <p className="mt-5 leading-7 text-zinc-400">{error}</p>

          <Button
            type="button"
            onClick={loadApplications}
            className="mt-7 h-12 rounded-xl bg-[#8c1218] px-6 text-white hover:bg-[#a41717]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Applications
  |--------------------------------------------------------------------------
  */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090909] px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-36">
      {/* Background grid */}

      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-size-[60px_60px]" />

      {/* Background glow */}

      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-100 w-100 -translate-x-1/2 rounded-full bg-[#8c1218]/15 blur-[180px] sm:h-137.5 sm:w-137.5" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#8c1218]/30 bg-[#8c1218]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d65b5b] sm:px-5 sm:text-xs sm:tracking-[0.35em]">
            <FileText className="h-3.5 w-3.5" />
            Astra Applications
          </span>

          <h1 className="mt-7 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Place
            <span className="block text-transparent [-webkit-text-stroke:1px_#8c1218]">
              In Astra
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8 lg:text-lg">
            Explore available opportunities across Astra Roleplay. Apply for
            whitelist access, community roles, departments, businesses, and
            more.
          </p>
        </div>

        {/* Categories */}

        {categories.length > 0 ? (
          <div className="space-y-20">
            {categories.map((category) => (
              <ApplicationCategory key={category.title} category={category} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <FileText className="h-7 w-7 text-zinc-500" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              No applications available
            </h2>

            <p className="mt-3 leading-7 text-zinc-500">
              There are currently no applications configured.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
