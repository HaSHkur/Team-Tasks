import React, { useState, useEffect, useRef } from "react";
import { Task, TaskPriority, TaskStatus } from "../../types/task";
import { TEAM_MEMBERS } from "../../data/users";
import { X, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    assigneeId?: string;
    priority: TaskPriority;
    dueDate?: string;
  }) => Promise<void>;
}

export const CreateTaskDialog: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setStatus("backlog");
      setAssigneeId("");
      setPriority("medium");
      setDueDate("");
      setError(null);
      setIsSubmitting(false);

      // Focus title input
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required and cannot be blank.");
      titleInputRef.current?.focus();
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Task title must be under 200 characters.");
      titleInputRef.current?.focus();
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
        status,
        assigneeId: assigneeId || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      onClose();
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg max-h-[96vh] sm:max-h-[90vh] bg-white rounded-t-xl sm:rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 id="create-task-title" className="text-sm font-semibold text-gray-900">
              Create new task
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Add a piece of work to the team backlog or in-progress sprint.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1 text-sm">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="task-title" className="block text-xs font-semibold text-gray-700">
                  Title <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] text-gray-400">{title.length}/200</span>
              </div>
              <input
                ref={titleInputRef}
                id="task-title"
                type="text"
                required
                maxLength={200}
                placeholder="e.g. Fix checkout validation when billing differs from shipping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-white border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-desc" className="block text-xs font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="task-desc"
                rows={3}
                placeholder="Add context, acceptance criteria, or relevant links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
            </div>

            {/* Grid for Status and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="task-status" className="block text-xs font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-gray-300 rounded text-gray-800 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-priority" className="block text-xs font-semibold text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-gray-300 rounded text-gray-800 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Grid for Assignee and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="task-assignee" className="block text-xs font-semibold text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-gray-300 rounded text-gray-800 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <option value="">Unassigned</option>
                  {TEAM_MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="task-due" className="block text-xs font-semibold text-gray-700 mb-1">
                  Due date
                </label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs bg-white border border-gray-300 rounded text-gray-800 focus-visible:ring-2 focus-visible:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
