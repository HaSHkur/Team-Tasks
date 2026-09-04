import React from "react";
import { Task, TaskStatus } from "../../types/task";
import { getTeamMember } from "../../data/users";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { DueDateBadge } from "./DueDateBadge";
import { useNavigate } from "react-router-dom";

interface Props {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onStatusChange }) => {
  const navigate = useNavigate();
  const member = getTeamMember(task.assigneeId);

  return (
    <article
      tabIndex={0}
      role="link"
      aria-label={`View task ${task.id}: ${task.title}`}
      onClick={() => navigate(`/tasks/${task.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/tasks/${task.id}`);
        }
      }}
      className="group w-full bg-white border border-gray-200 rounded-lg p-3 shadow-xs hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      {/* Top line: ID and Priority */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-[11px] font-mono font-medium text-gray-400 flex-shrink-0">
            {task.id}
          </span>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 leading-snug line-clamp-2">
            {task.title}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Assignee line */}
      <div className="flex items-center gap-1.5 my-1.5 text-xs text-gray-600">
        {member ? (
          <span className="truncate">{member.name}</span>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        )}
      </div>

      {/* Bottom Row: Status Select + Due Date */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 mt-2">
        <div onClick={(e) => e.stopPropagation()}>
          <TaskStatusSelect
            status={task.status}
            onChange={(newStatus) => onStatusChange(task.id, newStatus)}
            size="sm"
          />
        </div>
        <div>
          <DueDateBadge dueDate={task.dueDate} />
        </div>
      </div>
    </article>
  );
};

