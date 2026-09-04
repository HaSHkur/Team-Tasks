import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Task, TaskStatus } from "../types/task";
import { taskService } from "../services/taskService";
import { getTeamMember } from "../data/users";
import { TaskStatusSelect } from "../components/tasks/TaskStatusSelect";
import { TaskPriorityBadge } from "../components/tasks/TaskPriorityBadge";
import { DueDateBadge } from "../components/tasks/DueDateBadge";
import { formatFullDate } from "../utils/dates";
import { Button } from "../components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";

export const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(false);

    taskService
      .getTaskById(taskId)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setTask(res);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    try {
      const updated = await taskService.updateTaskStatus(task.id, newStatus);
      setTask(updated);
    } catch (err) {
      console.error("Could not update task status:", err);
    }
  };

  const member = task ? getTeamMember(task.assigneeId) : undefined;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 p-1.5 -ml-1.5 rounded hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to tasks</span>
          </button>

          {task && (
            <span className="text-xs font-mono font-medium text-gray-400">
              {task.id}
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-24 bg-gray-100 rounded w-full" />
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          </div>
        ) : error || !task ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Task not found
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              The task you are looking for does not exist or may have been deleted.
            </p>
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                Return to tasks list
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Title & Status Banner */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                  {task.id}
                </span>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                    Status:
                  </span>
                  <TaskStatusSelect
                    status={task.status}
                    onChange={handleStatusChange}
                    size="md"
                  />
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {task.title}
              </h1>
            </div>

            {/* Description Section */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Description</span>
              </h2>

              {task.description ? (
                <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-200">
                  {task.description}
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">No description</p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 text-sm">
              {/* Assignee */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-medium text-gray-500">
                    Assignee
                  </span>
                  {member ? (
                    <div className="mt-1">
                      <p className="font-semibold text-gray-900 break-words text-xs sm:text-sm">
                        {member.name}
                      </p>
                      {member.role && (
                        <span className="text-xs text-gray-500">
                          {member.role}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="font-normal text-gray-400 italic mt-1 text-xs sm:text-sm">
                      Unassigned
                    </p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">
                  <Tag className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 mb-1">
                    Priority
                  </span>
                  <TaskPriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 mb-1">
                    Due Date
                  </span>
                  <DueDateBadge dueDate={task.dueDate} />
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-gray-500">Created: </span>
                    <span className="font-medium text-gray-700">
                      {formatFullDate(task.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last updated: </span>
                    <span className="font-medium text-gray-700">
                      {formatFullDate(task.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

};
