"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data } = await api.get("/applications/questions");
      return data.questions;
    },
  });
}
