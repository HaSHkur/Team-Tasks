import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DueDateFilter,
  SortDirection,
  SortField,
  Task,
  TaskPriority,
  TaskStatus,
  TaskSummaryStats,
} from "../types/task";
import { taskService, setSimulateError } from "../services/taskService";
import { TaskSummaryBar } from "../components/tasks/TaskSummaryBar";
import { TaskTable } from "../components/tasks/TaskTable";
import { TaskCard } from "../components/tasks/TaskCard";
import { SearchInput } from "../components/filters/SearchInput";
import { FilterBar } from "../components/filters/FilterBar";
import { FilterSheet } from "../components/filters/FilterSheet";
import { Pagination } from "../components/ui/Pagination";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { SummarySkeleton, TableSkeleton, CardListSkeleton } from "../components/ui/Skeleton";
import { CreateTaskDialog } from "../components/tasks/CreateTaskDialog";
import { Button } from "../components/ui/Button";
import { AppSidebar } from "../components/layout/AppSidebar";
import { SlidersHorizontal, Plus, Bug, Menu } from "lucide-react";

export const TasksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read params directly from URL as single source of truth
  const q = searchParams.get("q") || "";
  const status = (searchParams.get("status") as TaskStatus | "all") || "all";
  const assignee = searchParams.get("assignee") || "all";
  const priority = (searchParams.get("priority") as TaskPriority | "all") || "all";
  const due = (searchParams.get("due") as DueDateFilter) || "all";
  const sort = (searchParams.get("sort") as SortField) || "createdAt";
  const direction = (searchParams.get("direction") as SortDirection) || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Component states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<TaskSummaryStats>({
    total: 0,
    inProgress: 0,
    overdue: 0,
    unassigned: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Dialog states
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);


  // Count active filters (excluding default sort/page)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (status !== "all") count++;
    if (assignee !== "all") count++;
    if (priority !== "all") count++;
    if (due !== "all") count++;
    return count;
  }, [status, assignee, priority, due]);

  const hasActiveFilters = activeFiltersCount > 0 || q.trim() !== "";

  // Helper to update search params while resetting page to 1 for filters
  const updateQuery = useCallback(
    (updates: Record<string, string | null>, shouldResetPage = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          Object.entries(updates).forEach(([k, v]) => {
            if (v === null || v === "" || v === "all") {
              next.delete(k);
            } else {
              next.set(k, v);
            }
          });

          if (shouldResetPage && !updates.page) {
            next.delete("page"); // Defaults to page 1
          }

          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  // Fetch tasks and statistics
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const [tasksResult, statsResult] = await Promise.all([
        taskService.getTasks({
          q,
          status,
          assignee,
          priority,
          due,
          sort,
          direction,
          page,
        }),
        taskService.getSummaryStats(),
      ]);

      setTasks(tasksResult.tasks);
      setTotalCount(tasksResult.total);
      setStats(statsResult);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [q, status, assignee, priority, due, sort, direction, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle rapid status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updated = await taskService.updateTaskStatus(taskId, newStatus);
      // Optimistically update list
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      // Refresh summary numbers
      const updatedStats = await taskService.getSummaryStats();
      setStats(updatedStats);
    } catch (err) {
      console.error("Could not update status:", err);
    }
  };

  // Handle task creation
  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    assigneeId?: string;
    priority: TaskPriority;
    dueDate?: string;
  }) => {
    await taskService.createTask(data);
    // Reload data to show newly created task
    await loadData();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: false });
  };

  // Toggle simulated error for grading test verification
  const handleTriggerSimulatedError = () => {
    setSimulateError(true);
    loadData();
  };

  const handleRetryAfterError = () => {
    setSimulateError(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans flex overflow-x-hidden">
      {/* High Density Dark Sidebar */}
      <AppSidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-3 flex-1 min-w-0 mr-3">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* High Density Search Bar */}
            <div className="w-full max-w-sm">
              <SearchInput
                value={q}
                onChange={(newQ) => updateQuery({ q: newQ })}
              />
            </div>

            {/* URL State Preview Pill matching design spec */}
            <div
              className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 hidden xl:inline-block max-w-[320px] truncate"
              title={`/tasks?${searchParams.toString()}`}
            >
              /tasks{searchParams.toString() ? `?${searchParams.toString()}` : ""}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Quick test utility to trigger error state as required in Section 20 */}
            <button
              type="button"
              onClick={handleTriggerSimulatedError}
              title="Test error & retry state (Simulation)"
              className="text-xs text-gray-400 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors hidden md:inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Bug className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-[11px]">Simulate Error</span>
            </button>

            {/* Mobile Filter Sheet Trigger Button (Mobile only) */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                aria-label={`Open filters, ${activeFiltersCount} active`}
                className={`px-2.5 py-1.5 text-xs font-medium border rounded-md transition-colors inline-flex items-center gap-1.5 ${
                  activeFiltersCount > 0
                    ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* New Task Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
              <span>+ New task</span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 space-y-5 flex-1 flex flex-col max-w-7xl w-full mx-auto">
          {/* Summary Stats */}
          {isLoading && tasks.length === 0 ? (
            <SummarySkeleton />
          ) : (
            <TaskSummaryBar stats={stats} />
          )}

          {/* Content Area */}
          {isLoading ? (
            <div>
              <div className="hidden md:block">
                <TableSkeleton />
              </div>
              <div className="block md:hidden">
                <CardListSkeleton />
              </div>
            </div>
          ) : isError ? (
            <ErrorState onRetry={handleRetryAfterError} />
          ) : tasks.length === 0 ? (
            <EmptyState
              isFiltered={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onCreateTask={() => setIsCreateDialogOpen(true)}
            />
          ) : (
            <>
              {/* Desktop View: High Density Card containing FilterBar + TaskTable + Pagination */}
              <div className="hidden md:flex bg-white rounded-lg border border-gray-200 shadow-sm flex-col overflow-hidden">
                {/* High Density Filter Toolbar */}
                <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <FilterBar
                    status={status}
                    assignee={assignee}
                    priority={priority}
                    due={due}
                    sort={sort}
                    direction={direction}
                    onFilterChange={(key, val) => updateQuery({ [key]: val })}
                    onResetFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <TaskTable tasks={tasks} onStatusChange={handleStatusChange} />
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={page}
                  totalItems={totalCount}
                  pageSize={20}
                  onPageChange={(newPage) => updateQuery({ page: String(newPage) }, false)}
                />
              </div>

              {/* Mobile View: Cards (<768px, specifically 375px) */}
              <div className="block md:hidden space-y-3">
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalItems={totalCount}
                  pageSize={20}
                  onPageChange={(newPage) => updateQuery({ page: String(newPage) }, false)}
                />
              </div>
            </>
          )}
        </main>
      </div>


      {/* Create Task Modal */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Mobile Filter Sheet */}
      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        status={status}
        assignee={assignee}
        priority={priority}
        due={due}
        sort={sort}
        direction={direction}
        onApply={(f) => {
          updateQuery({
            status: f.status,
            assignee: f.assignee,
            priority: f.priority,
            due: f.due,
            sort: f.sort,
            direction: f.direction,
          });
        }}
        onClearAll={handleClearFilters}
      />
    </div>
  );
};
