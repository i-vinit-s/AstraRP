"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  SquareStack,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function ApplicationSectionsTab({
  applicationId,
  sections = [],
}) {
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  function resetForm() {
    setCreating(false);
    setEditingId(null);

    setForm({
      title: "",
      description: "",
    });
  }

  function startCreating() {
    setEditingId(null);
    setCreating(true);

    setForm({
      title: "",
      description: "",
    });
  }

  function startEditing(section) {
    setCreating(false);
    setEditingId(section._id);

    setForm({
      title: section.title || "",
      description: section.description || "",
    });
  }

  async function refreshBuilder() {
    await queryClient.invalidateQueries({
      queryKey: ["application-builder", applicationId],
    });
  }

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/staff/application-definitions/${applicationId}/sections`,
        payload,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Section created successfully.");

      resetForm();
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create section.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ sectionId, payload }) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${applicationId}/sections/${sectionId}`,
        payload,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Section updated successfully.");

      resetForm();
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update section.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (sectionId) => {
      const { data } = await api.delete(
        `/staff/application-definitions/${applicationId}/sections/${sectionId}`,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Section deleted successfully.");
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete section.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (sectionIds) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${applicationId}/sections/reorder`,
        {
          sectionIds,
        },
      );

      return data;
    },

    onMutate: async (sectionIds) => {
      await queryClient.cancelQueries({
        queryKey: ["application-builder", applicationId],
      });

      const previousData = queryClient.getQueryData([
        "application-builder",
        applicationId,
      ]);

      queryClient.setQueryData(
        ["application-builder", applicationId],
        (current) => {
          if (!current) {
            return current;
          }

          const sectionMap = new Map(
            (current.sections || []).map((section) => [
              String(section._id),
              section,
            ]),
          );

          return {
            ...current,

            sections: sectionIds
              .map((sectionId, index) => {
                const section = sectionMap.get(String(sectionId));

                if (!section) {
                  return null;
                }

                return {
                  ...section,
                  order: index,
                };
              })
              .filter(Boolean),
          };
        },
      );

      return {
        previousData,
      };
    },

    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["application-builder", applicationId],
          context.previousData,
        );
      }

      toast.error(
        error.response?.data?.message || "Failed to reorder sections.",
      );
    },

    onSettled: async () => {
      await refreshBuilder();
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      toast.error("Section title is required.");
      return;
    }

    const payload = {
      title,
      description: form.description.trim(),
    };

    if (editingId) {
      updateMutation.mutate({
        sectionId: editingId,
        payload,
      });

      return;
    }

    createMutation.mutate(payload);
  }

  function handleDelete(section) {
    const questionCount = section.questions?.length || 0;

    if (questionCount > 0) {
      toast.error(
        `This section contains ${questionCount} question${
          questionCount === 1 ? "" : "s"
        }. Move or delete them before deleting the section.`,
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete the "${section.title}" section? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(section._id);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sections.findIndex(
      (section) => String(section._id) === String(active.id),
    );

    const newIndex = sections.findIndex(
      (section) => String(section._id) === String(over.id),
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);

    reorderMutation.mutate(reorderedSections.map((section) => section._id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111111] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <SquareStack className="text-[#8c1218]" size={24} />

            <h2 className="text-2xl font-semibold">Form Sections</h2>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Organize questions into logical sections displayed to applicants.
          </p>
        </div>

        {!creating && !editingId && (
          <Button
            type="button"
            onClick={startCreating}
            className="shrink-0 bg-[#8c1218] text-white hover:bg-[#a41717]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        )}
      </div>

      {(creating || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#8c1218]/30 bg-[#111111] p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {editingId ? "Edit Section" : "Create Section"}
            </h3>

            <button
              type="button"
              onClick={resetForm}
              className="text-zinc-500 transition hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 grid gap-6">
            <Field label="Section Title" required>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Character Information"
                className={inputClass}
                autoFocus
              />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Tell applicants what information is required in this section..."
                className={`${inputClass} h-auto resize-y py-4`}
              />
            </Field>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#8c1218] text-white hover:bg-[#a41717]"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}

              {editingId ? "Save Changes" : "Create Section"}
            </Button>
          </div>
        </form>
      )}

      {!sections.length ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-20 text-center">
          <SquareStack className="mx-auto text-zinc-700" size={36} />

          <h3 className="mt-5 text-lg font-semibold">No sections yet</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Create your first section to start organizing application questions.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SortableSectionCard
                  key={section._id}
                  section={section}
                  index={index}
                  deleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === section._id
                  }
                  reorderPending={reorderMutation.isPending}
                  onEdit={startEditing}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}

        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]";

function SortableSectionCard({
  section,
  index,
  deleting,
  reorderPending,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section._id,
    disabled: reorderPending,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const questionCount = section.questions?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-4 rounded-3xl border bg-[#111111] p-6 transition ${
        isDragging
          ? "z-50 border-[#8c1218]/60 opacity-70 shadow-2xl"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={reorderPending}
        aria-label={`Reorder ${section.title}`}
        className="mt-1 cursor-grab touch-none text-zinc-700 transition hover:text-zinc-400 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GripVertical size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold">{section.title}</h3>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-500">
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </span>

          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-600">
            Order {section.order ?? index}
          </span>
        </div>

        {section.description && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
            {section.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDragging}
          onClick={() => onEdit(section)}
          className="text-zinc-500 hover:bg-white/5 hover:text-white"
        >
          <Pencil size={17} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={deleting || isDragging}
          onClick={() => onDelete(section)}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 size={17} />
          )}
        </Button>
      </div>
    </div>
  );
}