"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useSubmitApplication() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/applications/me/submit");

      return data;
    },
  });
}
