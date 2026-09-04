import React from "react";
import { Task, TaskStatus } from "../../types/task";
import { getTeamMember } from "../../data/users";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { DueDateBadge } from "./DueDateBadge";
import { useNavigate } from "react-router-dom";

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskTable: React.FC<Props> = ({ tasks, onStatusChange }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse table-fixed min-w-[700px]">
        <caption className="sr-only">Team Tasks List</caption>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
            <th scope="col" className="w-[45%] px-4 py-2.5">
              Task Title
            </th>
            <th scope="col" className="w-[20%] px-4 py-2.5">
              Assignee
            </th>
            <th scope="col" className="w-[12%] px-4 py-2.5 text-center">
              Status
            </th>
            <th scope="col" className="w-[11%] px-4 py-2.5 text-center">
              Priority
            </th>
            <th scope="col" className="w-[12%] px-4 py-2.5">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const member = getTeamMember(task.assigneeId);

            return (
              <tr
                key={task.id}
                tabIndex={0}
                role="link"
                aria-label={`View task: ${task.title}`}
                onClick={() => navigate(`/tasks/${task.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/tasks/${task.id}`);
                  }
                }}
                className="hover:bg-blue-50 cursor-pointer group bg-white transition-colors focus-visible:outline-none focus-visible:bg-blue-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
              >
                {/* Task Title */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[11px] font-mono text-gray-400 font-medium flex-shrink-0">
                      {task.id}
                    </span>
                    <span
                      className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate block text-sm"
                      title={task.title}
                    >
                      {task.title}
                    </span>
                  </div>
                </td>

                {/* Assignee */}
                <td className="px-4 py-3 align-middle text-gray-600 text-xs">
                  {member ? (
                    <span className="truncate block" title={member.name}>
                      {member.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3 align-middle text-center">
                  <TaskStatusSelect
                    status={task.status}
                    onChange={(newStatus) => onStatusChange(task.id, newStatus)}
                  />
                </td>

                {/* Priority */}
                <td className="px-4 py-3 align-middle text-center">
                  <TaskPriorityBadge priority={task.priority} />
                </td>

                {/* Due Date */}
                <td className="px-4 py-3 align-middle">
                  <DueDateBadge dueDate={task.dueDate} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

