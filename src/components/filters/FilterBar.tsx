import React from "react";
import { DueDateFilter, SortDirection, SortField, TaskPriority, TaskStatus } from "../../types/task";
import { TEAM_MEMBERS } from "../../data/users";
import { ArrowUpDown, RotateCcw } from "lucide-react";

interface Props {
  status: TaskStatus | "all";
  assignee: string | "all";
  priority: TaskPriority | "all";
  due: DueDateFilter;
  sort: SortField;
  direction: SortDirection;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<Props> = ({
  status,
  assignee,
  priority,
  due,
  sort,
  direction,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 w-full">
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            aria-label="Filter by task status"
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="backlog">Status: Backlog</option>
            <option value="in-progress">Status: In Progress</option>
            <option value="blocked">Status: Blocked</option>
            <option value="done">Status: Done</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="relative">
          <select
            value={assignee}
            onChange={(e) => onFilterChange("assignee", e.target.value)}
            aria-label="Filter by assignee"
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">Assignee: All</option>
            <option value="unassigned">Unassigned</option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
            aria-label="Filter by priority"
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">Priority: All</option>
            <option value="high">Priority: High</option>
            <option value="medium">Priority: Medium</option>
            <option value="low">Priority: Low</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div className="relative">
          <select
            value={due}
            onChange={(e) => onFilterChange("due", e.target.value)}
            aria-label="Filter by due date"
            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">Due: All</option>
            <option value="overdue">Due: Overdue</option>
            <option value="today">Due: Today</option>
            <option value="week">Due: This Week</option>
            <option value="none">Due: None</option>
          </select>
        </div>

        {/* Clear filters shortcut */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-200/70 rounded transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3 text-gray-400" aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span>Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
          aria-label="Sort tasks by"
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer"
        >
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Created Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        {/* Sort Direction Toggle */}
        <button
          type="button"
          onClick={() => onFilterChange("direction", direction === "asc" ? "desc" : "asc")}
          aria-label={`Toggle sort order, current: ${direction === "asc" ? "ascending" : "descending"}`}
          title={`Sort ${direction === "asc" ? "Ascending" : "Descending"}`}
          className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors inline-flex items-center gap-0.5 text-xs font-semibold"
        >
          <ArrowUpDown className="w-3 h-3 text-gray-500" aria-hidden="true" />
          <span className="uppercase text-[10px]">{direction}</span>
        </button>
      </div>
    </div>
  );
};

