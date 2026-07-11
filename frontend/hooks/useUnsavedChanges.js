"use client";

import { useEffect } from "react";

export default function useUnsavedChanges(hasChanges) {
  useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);
}
