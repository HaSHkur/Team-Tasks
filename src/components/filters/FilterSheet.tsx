import React, { useEffect, useState } from "react";
import { DueDateFilter, SortDirection, SortField, TaskPriority, TaskStatus } from "../../types/task";
import { TEAM_MEMBERS } from "../../data/users";
import { X, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: TaskStatus | "all";
  assignee: string | "all";
  priority: TaskPriority | "all";
  due: DueDateFilter;
  sort: SortField;
  direction: SortDirection;
  onApply: (filters: {
    status: TaskStatus | "all";
    assignee: string | "all";
    priority: TaskPriority | "all";
    due: DueDateFilter;
    sort: SortField;
    direction: SortDirection;
  }) => void;
  onClearAll: () => void;
}

export const FilterSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  status,
  assignee,
  priority,
  due,
  sort,
  direction,
  onApply,
  onClearAll,
}) => {
  // Local state until user clicks Apply
  const [localStatus, setLocalStatus] = useState(status);
  const [localAssignee, setLocalAssignee] = useState(assignee);
  const [localPriority, setLocalPriority] = useState(priority);
  const [localDue, setLocalDue] = useState(due);
  const [localSort, setLocalSort] = useState(sort);
  const [localDirection, setLocalDirection] = useState(direction);

  useEffect(() => {
    if (isOpen) {
      setLocalStatus(status);
      setLocalAssignee(assignee);
      setLocalPriority(priority);
      setLocalDue(due);
      setLocalSort(sort);
      setLocalDirection(direction);
    }
  }, [isOpen, status, assignee, priority, due, sort, direction]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      status: localStatus,
      assignee: localAssignee,
      priority: localPriority,
      due: localDue,
      sort: localSort,
      direction: localDirection,
    });
    onClose();
  };

  const handleClear = () => {
    setLocalStatus("all");
    setLocalAssignee("all");
    setLocalPriority("all");
    setLocalDue("all");
    setLocalSort("createdAt");
    setLocalDirection("desc");
    onClearAll();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity sm:justify-center sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h2 id="filter-sheet-title" className="text-base font-semibold text-slate-900">
              Filters & Sorting
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Refine team tasks</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-sm">
          {/* Status */}
          <div>
            <label htmlFor="filter-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              id="filter-status"
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value as any)}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="filter-assignee" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assignee
            </label>
            <select
              id="filter-assignee"
              value={localAssignee}
              onChange={(e) => setLocalAssignee(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned Only</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="filter-priority" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              id="filter-priority"
              value={localPriority}
              onChange={(e) => setLocalPriority(e.target.value as any)}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="filter-due" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <select
              id="filter-due"
              value={localDue}
              onChange={(e) => setLocalDue(e.target.value as any)}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            >
              <option value="all">All Due Dates</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
              <option value="none">No Due Date</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="pt-2 border-t border-slate-200">
            <label htmlFor="filter-sort" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                id="filter-sort"
                value={localSort}
                onChange={(e) => setLocalSort(e.target.value as any)}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>

              <button
                type="button"
                onClick={() => setLocalDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="h-10 px-3 flex items-center justify-center gap-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium hover:bg-slate-100 active:bg-slate-200"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span>{localDirection === "asc" ? "Ascending" : "Descending"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-200 bg-slate-50">
          <Button variant="ghost" size="md" onClick={handleClear}>
            Clear all
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
