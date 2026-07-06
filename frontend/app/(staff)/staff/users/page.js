"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useMemo, useState } from "react";

import UsersTable from "@/components/staff/users/UsersTable";
import SearchBar from "@/components/staff/users/SearchBar";
import StatusFilter from "@/components/staff/users/StatusFilter";

export default function StaffUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff-users"],
    queryFn: async () => {
      const { data } = await api.get("/staff/users");
      return data.users;
    },
  });

  const filteredUsers = useMemo(() => {
    let list = [...users];

    const query = search.toLowerCase();

    if (query) {
      list = list.filter((user) => {
        return (
          user.username?.toLowerCase().includes(query) ||
          user.globalName?.toLowerCase().includes(query) ||
          user.discordId?.includes(query)
        );
      });
    }

    if (filter === "whitelisted") {
      list = list.filter((user) => user.isWhitelisted);
    }

    if (filter === "not_whitelisted") {
      list = list.filter((user) => !user.isWhitelisted);
    }

    return list;
  }, [users, search, filter]);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#8c1218]">
          Astra Staff
        </p>

        <h1 className="text-5xl font-bold">Players</h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Search and manage all registered Astra Roleplay players.
        </p>
      </div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar value={search} onChange={setSearch} />

        <StatusFilter
          value={filter}
          onChange={setFilter}
          total={users.length}
          whitelisted={users.filter((u) => u.isWhitelisted).length}
          notWhitelisted={users.filter((u) => !u.isWhitelisted).length}
        />
      </div>
      <UsersTable users={filteredUsers} loading={isLoading} error={error} />
    </div>
  );
}
