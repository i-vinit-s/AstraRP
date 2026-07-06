"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/fetcher";

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/auth/me")
      .then((res) => {
        if (res.user) {
          setUser(res.user);
        }
      })
      .catch(() => {});
  }, []);

  return user;
}
