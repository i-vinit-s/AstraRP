"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import AnnouncementModal from "./AnnouncementModal";

import { Button } from "@/components/ui/button";

export default function CreateAnnouncementButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#8c1218] hover:bg-red-700"
      >
        <Plus className="mr-2 h-4 w-4" />

        New Announcement
      </Button>

      <AnnouncementModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}