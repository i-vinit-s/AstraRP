"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useApplication() {
  return useQuery({
    queryKey: ["application"],
    queryFn: async () => {
      const { data } = await api.get("/applications/me");
      return data.application;
    },
  });
}
