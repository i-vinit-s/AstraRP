"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-999 flex h-14 w-14 items-center justify-center rounded-2xl border  border-white/10  bg-[#111111]/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-1  hover:border-[#8c1218]/50 hover:bg-[#8c1218]/15 hover:shadow-[0_0_35px_rgba(140,18,24,.35)] ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"}`}
    >
      <ChevronUp className="h-6 w-6 text-white" />
    </button>
  );
}
