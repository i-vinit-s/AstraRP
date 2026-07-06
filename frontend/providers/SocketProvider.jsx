"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getSocket } from "@/lib/socket";

export default function SocketProvider({ children }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.emit("staff:join", {
      token: localStorage.getItem("accessToken"),
    });

    socket.on("application:new", (payload) => {
      toast.info("New Application", {
        description: `${payload.user.globalName || payload.user.username} submitted a whitelist application.`,
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-applications"],
      });
    });

    socket.on("application:approved", (payload) => {
      toast.success("Application Approved", {
        description: `${payload.actor.globalName} approved ${payload.target.globalName}'s whitelist.`,
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-users"],
      });
    });

    socket.on("application:rejected", (payload) => {
      toast.error("Application Rejected", {
        description: `${payload.actor.globalName} rejected ${payload.target.globalName}'s whitelist.`,
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-users"],
      });
    });

    return () => {
      socket.off("application:new");
      socket.off("application:approved");
      socket.off("application:rejected");

      socket.emit("leave-staff");
      socket.disconnect();
    };
  }, [queryClient]);

  return children;
}
