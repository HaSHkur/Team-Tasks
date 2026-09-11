export type TaskStatus = "backlog" | "in-progress" | "blocked" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type DueDateFilter = "all" | "overdue" | "today" | "week" | "none";

export type SortField = "title" | "dueDate" | "priority" | "createdAt";

export type SortDirection = "asc" | "desc";

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  avatarInitials?: string;
  appRole?: "admin" | "user";
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TaskFilterParams {
  q?: string;
  status?: TaskStatus | "all";
  assignee?: string | "all"; // team member id, "unassigned", or "all"
  priority?: TaskPriority | "all";
  due?: DueDateFilter;
  sort?: SortField;
  direction?: SortDirection;
  page?: number;
}

export interface TaskSummaryStats {
  total: number;
  inProgress: number;
  overdue: number;
  unassigned: number;
}
