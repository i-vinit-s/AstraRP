"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useSaveApplication() {
  return useMutation({
    mutationFn: async (answers) => {
      const { data } = await api.put("/applications/me", {
        answers,
      });

      return data;
    },
  });
}
