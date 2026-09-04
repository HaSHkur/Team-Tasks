import React from "react";
import { TaskSummaryStats } from "../../types/task";

interface Props {
  stats: TaskSummaryStats;
}

export const TaskSummaryBar: React.FC<Props> = ({ stats }) => {
  return (
    <section
      aria-label="Task Summary Metrics"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {/* Total tasks */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Total Tasks
        </p>
        <p className="text-2xl font-bold mt-1 text-gray-900">{stats.total}</p>
      </div>

      {/* In Progress */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          In Progress
        </p>
        <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
      </div>

      {/* Overdue */}
      <div
        className={`bg-white p-4 rounded-lg shadow-sm ${
          stats.overdue > 0 ? "border border-red-100" : "border border-gray-200"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            stats.overdue > 0 ? "text-red-500" : "text-gray-500"
          }`}
        >
          Overdue
        </p>
        <p
          className={`text-2xl font-bold mt-1 ${
            stats.overdue > 0 ? "text-red-600" : "text-gray-900"
          }`}
        >
          {stats.overdue}
        </p>
      </div>

      {/* Unassigned */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Unassigned
        </p>
        <p className="text-2xl font-bold mt-1 text-gray-700">{stats.unassigned}</p>
      </div>
    </section>
  );
};

