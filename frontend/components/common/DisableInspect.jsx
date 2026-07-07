"use client";

import { useEffect } from "react";

export default function DisableInspect() {
  useEffect(() => {
    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && key === "i") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && key === "j") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && key === "c") {
        e.preventDefault();
        return;
      }

      // Ctrl+U
      if (e.ctrlKey && key === "u") {
        e.preventDefault();
        return;
      }

      // Ctrl+S (optional)
      if (e.ctrlKey && key === "s") {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
