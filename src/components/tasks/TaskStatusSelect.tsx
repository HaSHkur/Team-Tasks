import React from "react";
import { TaskStatus } from "../../types/task";
import { ChevronDown } from "lucide-react";

interface Props {
  status: TaskStatus;
  onChange: (newStatus: TaskStatus) => void;
  className?: string;
  size?: "sm" | "md";
}

export const TaskStatusSelect: React.FC<Props> = ({
  status,
  onChange,
  className = "",
  size = "sm",
}) => {
  const statusConfig: Record<
    TaskStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    backlog: {
      label: "Backlog",
      bg: "bg-gray-100 hover:bg-gray-200",
      text: "text-gray-700",
      border: "border-gray-200",
    },
    "in-progress": {
      label: "In Progress",
      bg: "bg-blue-100 hover:bg-blue-200",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    blocked: {
      label: "Blocked",
      bg: "bg-orange-100 hover:bg-orange-200",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    done: {
      label: "Done",
      bg: "bg-green-100 hover:bg-green-200",
      text: "text-green-700",
      border: "border-green-200",
    },
  };

  const current = statusConfig[status] || statusConfig.backlog;

  const sizeClasses =
    size === "sm"
      ? "h-6 pl-2 pr-5 text-[10px]"
      : "h-7 pl-2.5 pr-6 text-xs";

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <select
        value={status}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value as TaskStatus);
        }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Change task status"
        className={`appearance-none cursor-pointer rounded font-bold uppercase tracking-wider transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${sizeClasses} ${current.bg} ${current.text} ${current.border}`}
      >
        <option value="backlog">Backlog</option>
        <option value="in-progress">In Progress</option>
        <option value="blocked">Blocked</option>
        <option value="done">Done</option>
      </select>
      <ChevronDown
        className={`pointer-events-none absolute right-1.5 w-3 h-3 ${current.text} opacity-70`}
        aria-hidden="true"
      />
    </div>
  );
};

