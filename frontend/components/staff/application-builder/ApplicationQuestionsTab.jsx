"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckSquare,
  ChevronDown,
  FileQuestion,
  GripVertical,
  ListChecks,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

const QUESTION_TYPES = [
  { value: "text", label: "Short Text", icon: Type },
  { value: "textarea", label: "Long Text", icon: Type },
  { value: "number", label: "Number", icon: Type },
  { value: "email", label: "Email", icon: Type },
  { value: "url", label: "URL", icon: Type },
  { value: "select", label: "Select", icon: ChevronDown },
  { value: "radio", label: "Radio", icon: ListChecks },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "date", label: "Date", icon: Type },
];

const OPTION_TYPES = ["select", "radio", "checkbox"];

function createEmptyForm() {
  return {
    id: "",
    title: "",
    description: "",
    placeholder: "",
    type: "text",
    section: "",
    order: 0,
    enabled: true,

    options: [],

    validation: {
      required: false,
      minLength: "",
      maxLength: "",
      min: "",
      max: "",
      regex: "",
    },
  };
}

function generateQuestionId(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeQuestion(question) {
  return {
    id: question.id || "",
    title: question.title || "",
    description: question.description || "",
    placeholder: question.placeholder || "",
    type: question.type || "text",

    section:
      typeof question.section === "object"
        ? question.section?._id || ""
        : question.section || "",

    order: question.order ?? 0,
    enabled: question.enabled !== false,

    options: Array.isArray(question.options)
      ? question.options.map((option) => ({
          label: option.label || "",
          value: option.value || "",
        }))
      : [],

    validation: {
      required: question.validation?.required || false,

      minLength: question.validation?.minLength ?? "",

      maxLength: question.validation?.maxLength ?? "",

      min: question.validation?.min ?? "",

      max: question.validation?.max ?? "",

      regex: question.validation?.regex || "",
    },
  };
}

export default function ApplicationQuestionsTab({
  applicationId,
  sections = [],
  unsectionedQuestions = [],
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
  const [form, setForm] = useState(createEmptyForm);

  const allQuestions = useMemo(() => {
    const sectionQuestions = sections.flatMap(
      (section) => section.questions || [],
    );

    return [...sectionQuestions, ...unsectionedQuestions].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }, [sections, unsectionedQuestions]);

  function resetForm() {
    setCreating(false);
    setEditingId(null);
    setForm(createEmptyForm());
  }

  function startCreating() {
    setEditingId(null);
    setCreating(true);
    setForm(createEmptyForm());
  }

  function startEditing(question) {
    setCreating(false);
    setEditingId(question._id);
    setForm(normalizeQuestion(question));
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateValidation(field, value) {
    setForm((current) => ({
      ...current,

      validation: {
        ...current.validation,
        [field]: value,
      },
    }));
  }

  async function refreshBuilder() {
    await queryClient.invalidateQueries({
      queryKey: ["application-builder", applicationId],
    });
  }

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/staff/application-definitions/${applicationId}/questions`,
        payload,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Question Created", {description: "New Question Created Successfully."});
      resetForm();
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create question.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ questionId, payload }) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${applicationId}/questions/${questionId}`,
        payload,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Question Updated", {description: "Question Updated Successfully."});
      resetForm();
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update question.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (questionId) => {
      const { data } = await api.delete(
        `/staff/application-definitions/${applicationId}/questions/${questionId}`,
      );

      return data;
    },

    onSuccess: async () => {
      toast.success("Question Deleted", {description: "Question Deleted Successfully."});
      await refreshBuilder();
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete question.",
      );
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (questions) => {
      const { data } = await api.patch(
        `/staff/application-definitions/${applicationId}/questions/reorder`,
        {
          questions,
        },
      );

      return data;
    },

    onMutate: async (reorderedQuestions) => {
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

          const questionMap = new Map(
            reorderedQuestions.map((item) => [String(item.id), item]),
          );

          const updateQuestion = (question) => {
            const reordered = questionMap.get(String(question._id));

            if (!reordered) {
              return question;
            }

            return {
              ...question,
              order: reordered.order,
            };
          };

          return {
            ...current,

            questions: Array.isArray(current.questions)
              ? current.questions
                  .map(updateQuestion)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              : [],

            sections: Array.isArray(current.sections)
              ? current.sections.map((section) => ({
                  ...section,

                  questions: Array.isArray(section.questions)
                    ? section.questions
                        .map(updateQuestion)
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    : [],
                }))
              : [],

            unsectionedQuestions: Array.isArray(current.unsectionedQuestions)
              ? current.unsectionedQuestions
                  .map(updateQuestion)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              : [],
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
        error.response?.data?.message || "Failed to reorder questions.",
      );
    },

    onSettled: async () => {
      await refreshBuilder();
    },
  });

  function addOption() {
    setForm((current) => ({
      ...current,

      options: [
        ...current.options,
        {
          label: "",
          value: "",
        },
      ],
    }));
  }

  function updateOption(index, field, value) {
    setForm((current) => ({
      ...current,

      options: current.options.map((option, currentIndex) =>
        currentIndex === index
          ? {
              ...option,
              [field]: value,
            }
          : option,
      ),
    }));
  }

  function removeOption(index) {
    setForm((current) => ({
      ...current,

      options: current.options.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const id = generateQuestionId(form.id);
    const title = form.title.trim();

    if (!id) {
      toast.error("Question ID is required.");
      return;
    }

    if (!title) {
      toast.error("Question title is required.");
      return;
    }

    let options = [];

    if (OPTION_TYPES.includes(form.type)) {
      options = form.options
        .map((option) => ({
          label: option.label.trim(),

          value: option.value.trim() || generateQuestionId(option.label),
        }))
        .filter((option) => option.label && option.value);

      if (!options.length) {
        toast.error(`${form.type} questions require at least one option.`);

        return;
      }

      const optionValues = options.map((option) => option.value);

      if (new Set(optionValues).size !== optionValues.length) {
        toast.error("Option values must be unique.");
        return;
      }
    }

    const validation = {
      required: Boolean(form.validation.required),
    };

    if (form.validation.minLength !== "") {
      validation.minLength = Number(form.validation.minLength);
    }

    if (form.validation.maxLength !== "") {
      validation.maxLength = Number(form.validation.maxLength);
    }

    if (form.validation.min !== "") {
      validation.min = Number(form.validation.min);
    }

    if (form.validation.max !== "") {
      validation.max = Number(form.validation.max);
    }

    if (form.validation.regex.trim()) {
      validation.regex = form.validation.regex.trim();
    }

    const payload = {
      id,
      title,

      description: form.description.trim(),

      placeholder: form.placeholder.trim(),

      type: form.type,

      section: form.section || null,

      order: Number(form.order) || 0,

      enabled: Boolean(form.enabled),

      options,

      validation,
    };

    if (editingId) {
      updateMutation.mutate({
        questionId: editingId,
        payload,
      });

      return;
    }

    createMutation.mutate(payload);
  }

  function handleDelete(question) {
    const confirmed = window.confirm(
      `Delete "${question.title}"? Existing submitted answers may still reference its question ID.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(question._id);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = allQuestions.findIndex(
      (question) => String(question._id) === String(active.id),
    );

    const newIndex = allQuestions.findIndex(
      (question) => String(question._id) === String(over.id),
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedQuestions = arrayMove(allQuestions, oldIndex, newIndex);

    const payload = reorderedQuestions.map((question, index) => ({
      id: question._id,

      order: index,

      section:
        typeof question.section === "object"
          ? question.section?._id || null
          : question.section || null,
    }));

    reorderMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111111] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <FileQuestion className="text-[#8c1218]" size={24} />

            <h2 className="text-2xl font-semibold">Application Questions</h2>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Create and configure the questions applicants must answer.
          </p>
        </div>

        {!creating && !editingId && (
          <Button
            type="button"
            onClick={startCreating}
            className="shrink-0 bg-[#8c1218] text-white hover:bg-[#a41717]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        )}
      </div>

      {(creating || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#8c1218]/30 bg-[#111111] p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {editingId ? "Edit Question" : "Create Question"}
              </h3>

              <p className="mt-1 text-sm text-zinc-600">
                Configure how this question appears and validates applicant
                responses.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-zinc-500 transition hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field label="Question Title" required>
              <input
                value={form.title}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((current) => {
                    const previousGeneratedId = generateQuestionId(
                      current.title,
                    );

                    const shouldUpdateId =
                      !current.id || current.id === previousGeneratedId;

                    return {
                      ...current,
                      title: value,

                      id: shouldUpdateId
                        ? generateQuestionId(value)
                        : current.id,
                    };
                  });
                }}
                placeholder="What is your character's name?"
                className={inputClass}
                autoFocus
              />
            </Field>

            <Field label="Question ID" required>
              <input
                value={form.id}
                onChange={(event) =>
                  updateField("id", generateQuestionId(event.target.value))
                }
                placeholder="character_name"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-zinc-600">
                Stored with submitted answers. Avoid changing this after users
                have submitted responses.
              </p>
            </Field>

            <Field label="Question Type" required>
              <select
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
                className={inputClass}
              >
                {QUESTION_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="bg-[#111111]"
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Section">
              <select
                value={form.section}
                onChange={(event) => updateField("section", event.target.value)}
                className={inputClass}
              >
                <option value="" className="bg-[#111111]">
                  No section
                </option>

                {sections.map((section) => (
                  <option
                    key={section._id}
                    value={section._id}
                    className="bg-[#111111]"
                  >
                    {section.title}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Placeholder">
              <input
                value={form.placeholder}
                onChange={(event) =>
                  updateField("placeholder", event.target.value)
                }
                placeholder="Enter your answer..."
                className={inputClass}
              />
            </Field>

            <Field label="Display Order">
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(event) => updateField("order", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Optional additional instructions for the applicant..."
                className={`${inputClass} h-auto resize-y py-4`}
              />
            </Field>
          </div>

          {OPTION_TYPES.includes(form.type) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold">Question Options</h4>

                  <p className="mt-1 text-sm text-zinc-600">
                    Configure the options applicants can choose from.
                  </p>
                </div>

                <Button type="button" variant="outline" onClick={addOption}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>

              {!form.options.length ? (
                <div className="mt-6 rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-zinc-600">
                  No options added yet.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {form.options.map((option, index) => (
                    <div
                      key={index}
                      className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <input
                        value={option.label}
                        onChange={(event) =>
                          updateOption(index, "label", event.target.value)
                        }
                        placeholder="Option label"
                        className={inputClass}
                      />

                      <input
                        value={option.value}
                        onChange={(event) =>
                          updateOption(
                            index,
                            "value",
                            generateQuestionId(event.target.value),
                          )
                        }
                        placeholder="option_value"
                        className={inputClass}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="h-12 w-12 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={17} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
            <h4 className="font-semibold">Validation</h4>

            <p className="mt-1 text-sm text-zinc-600">
              Control which answers are accepted by the form.
            </p>

            <div className="mt-6">
              <ToggleCard
                title="Required Question"
                description="Applicants must answer this question before submitting."
                checked={form.validation.required}
                onChange={(checked) => updateValidation("required", checked)}
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {(form.type === "text" ||
                form.type === "textarea" ||
                form.type === "email" ||
                form.type === "url") && (
                <>
                  <Field label="Minimum Length">
                    <input
                      type="number"
                      min="0"
                      value={form.validation.minLength}
                      onChange={(event) =>
                        updateValidation("minLength", event.target.value)
                      }
                      placeholder="No minimum"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Maximum Length">
                    <input
                      type="number"
                      min="0"
                      value={form.validation.maxLength}
                      onChange={(event) =>
                        updateValidation("maxLength", event.target.value)
                      }
                      placeholder="No maximum"
                      className={inputClass}
                    />
                  </Field>
                </>
              )}

              {form.type === "number" && (
                <>
                  <Field label="Minimum Value">
                    <input
                      type="number"
                      value={form.validation.min}
                      onChange={(event) =>
                        updateValidation("min", event.target.value)
                      }
                      placeholder="No minimum"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Maximum Value">
                    <input
                      type="number"
                      value={form.validation.max}
                      onChange={(event) =>
                        updateValidation("max", event.target.value)
                      }
                      placeholder="No maximum"
                      className={inputClass}
                    />
                  </Field>
                </>
              )}

              {["text", "textarea"].includes(form.type) && (
                <Field label="Regex Pattern">
                  <input
                    value={form.validation.regex}
                    onChange={(event) =>
                      updateValidation("regex", event.target.value)
                    }
                    placeholder="Optional regular expression"
                    className={inputClass}
                  />
                </Field>
              )}
            </div>
          </div>

          <div className="mt-6">
            <ToggleCard
              title="Question Enabled"
              description="Disabled questions remain saved but are hidden from applicants."
              checked={form.enabled}
              onChange={(checked) => updateField("enabled", checked)}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
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

              {editingId ? "Save Changes" : "Create Question"}
            </Button>
          </div>
        </form>
      )}

      {!allQuestions.length ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] px-6 py-20 text-center">
          <FileQuestion className="mx-auto text-zinc-700" size={36} />

          <h3 className="mt-5 text-lg font-semibold">No questions yet</h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Add your first question to begin building this application form.
          </p>

          {!creating && (
            <Button
              type="button"
              onClick={startCreating}
              className="mt-6 bg-[#8c1218] text-white hover:bg-[#a41717]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allQuestions.map((question) => question._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {allQuestions.map((question, index) => {
                const section = sections.find(
                  (item) =>
                    String(item._id) ===
                    String(
                      typeof question.section === "object"
                        ? question.section?._id
                        : question.section,
                    ),
                );

                return (
                  <SortableQuestionCard
                    key={question._id}
                    question={question}
                    index={index}
                    section={section}
                    deleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === question._id
                    }
                    reorderPending={reorderMutation.isPending}
                    onEdit={startEditing}
                    onDelete={handleDelete}
                  />
                );
              })}
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

function ToggleCard({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div>
        <p className="font-medium text-white">{title}</p>

        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-[#8c1218]" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#8c1218]";

function SortableQuestionCard({
  question,
  index,
  section,
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
    id: question._id,
    disabled: reorderPending,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
        aria-label={`Reorder ${question.title}`}
        className="mt-1 cursor-grab touch-none text-zinc-700 transition hover:text-zinc-400 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GripVertical size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{question.title}</h3>

          {question.validation?.required && (
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400">
              Required
            </span>
          )}

          {!question.enabled && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-500">
              Disabled
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            {question.type}
          </span>

          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            {section?.title || "No section"}
          </span>

          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            ID: {question.id}
          </span>

          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
            Order {question.order ?? index}
          </span>
        </div>

        {question.description && (
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {question.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isDragging}
          onClick={() => onEdit(question)}
          className="text-zinc-500 hover:bg-white/5 hover:text-white"
        >
          <Pencil size={17} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={deleting || isDragging}
          onClick={() => onDelete(question)}
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