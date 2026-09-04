import React from "react";
import { TaskPriority } from "../../types/task";

interface Props {
  priority: TaskPriority;
  className?: string;
}

export const TaskPriorityBadge: React.FC<Props> = ({ priority, className = "" }) => {
  const configs: Record<
    TaskPriority,
    { label: string; dotColor: string }
  > = {
    high: {
      label: "High",
      dotColor: "text-red-500",
    },
    medium: {
      label: "Medium",
      dotColor: "text-yellow-500",
    },
    low: {
      label: "Low",
      dotColor: "text-gray-400",
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-center ${className}`}
      title={`Priority: ${config.label}`}
    >
      <span className={`${config.dotColor} font-bold text-xs leading-none select-none`} aria-hidden="true">
        ●
      </span>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
        {config.label}
      </span>
    </span>
  );
};

