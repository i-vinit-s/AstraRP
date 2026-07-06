"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AnnouncementModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "public",
    type: "announcement",
    color: "#8c1218",
    pinned: false,
    published: true,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/staff/announcements", form);

      return data;
    },

    onSuccess: () => {
      toast.success("Announcement published.");

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });

      onClose();

      setForm({
        title: "",
        content: "",
        category: "public",
        type: "announcement",
        color: "#8c1218",
        pinned: false,
        published: true,
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to publish announcement.",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-white/10 bg-[#111111] text-white">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Input
            placeholder="Announcement title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="rounded-lg border border-white/10 bg-[#0f0f0f] p-3"
            >
              <option value="public">Public</option>

              <option value="whitelist">Whitelist</option>

              <option value="offtopic">Off Topic</option>
            </select>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="rounded-lg border border-white/10 bg-[#0f0f0f] p-3"
            >
              <option value="announcement">Announcement</option>

              <option value="update">Update</option>

              <option value="maintenance">Maintenance</option>

              <option value="event">Event</option>
            </select>
          </div>

          <Textarea
            rows={10}
            placeholder="Write your announcement..."
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content: e.target.value,
              })
            }
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) =>
                setForm({
                  ...form,
                  pinned: e.target.checked,
                })
              }
            />
            Pin Announcement
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="bg-[#8c1218]"
          >
            {mutation.isPending ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
