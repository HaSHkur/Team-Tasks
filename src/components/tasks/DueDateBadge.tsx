import React from "react";
import { formatDueDate } from "../../utils/dates";

interface Props {
  dueDate?: string;
  className?: string;
}

export const DueDateBadge: React.FC<Props> = ({ dueDate, className = "" }) => {
  const info = formatDueDate(dueDate);

  if (!dueDate) {
    return (
      <span className={`inline-flex items-center text-xs text-gray-400 italic ${className}`}>
        No due date
      </span>
    );
  }

  if (info.isOverdue) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold text-red-600 ${className}`}
        title={`Task is overdue: ${info.rawDate}`}
      >
        <span aria-hidden="true">⚠</span>
        <span>{info.label}</span>
      </span>
    );
  }

  if (info.isToday) {
    return (
      <span
        className={`inline-flex items-center text-xs font-semibold text-orange-500 ${className}`}
        title="Due today"
      >
        Due Today
      </span>
    );
  }

  if (info.isTomorrow) {
    return (
      <span
        className={`inline-flex items-center text-xs font-medium text-blue-600 ${className}`}
        title="Due tomorrow"
      >
        Due tomorrow
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-xs text-gray-500 ${className}`}
      title={`Due: ${info.rawDate}`}
    >
      <span>{info.label}</span>
    </span>
  );
};

