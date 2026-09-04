import { Task, TaskFilterParams, TaskStatus, TaskSummaryStats } from "../types/task";
import { generateMockTasks } from "../data/mockTasks";
import { getTodayString } from "../utils/dates";

const STORAGE_KEY = "team_tasks_db_v1";

let shouldSimulateError = false;

export function setSimulateError(val: boolean) {
  shouldSimulateError = val;
}

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read localStorage tasks:", err);
  }

  // Generate initial 200 tasks
  const initial = generateMockTasks(200);
  saveToStorage(initial);
  return initial;
}

function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Could not write tasks to localStorage:", err);
  }
}

export const taskService = {
  async getTasks(params: TaskFilterParams): Promise<{ tasks: Task[]; total: number }> {
    // Artificial small delay to showcase skeleton loading state
    await new Promise((r) => setTimeout(r, 220));

    if (shouldSimulateError) {
      throw new Error("Network request failed while fetching tasks");
    }

    let allTasks = loadFromStorage();

    // 1. Search Query (Title + optional description search)
    if (params.q && params.q.trim() !== "") {
      const query = params.q.trim().toLowerCase();
      allTasks = allTasks.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(query);
        const descMatch = t.description ? t.description.toLowerCase().includes(query) : false;
        const idMatch = t.id.toLowerCase().includes(query);
        return titleMatch || descMatch || idMatch;
      });
    }

    // 2. Status Filter
    if (params.status && params.status !== "all") {
      allTasks = allTasks.filter((t) => t.status === params.status);
    }

    // 3. Assignee Filter
    if (params.assignee && params.assignee !== "all") {
      if (params.assignee === "unassigned") {
        allTasks = allTasks.filter((t) => !t.assigneeId);
      } else {
        allTasks = allTasks.filter((t) => t.assigneeId === params.assignee);
      }
    }

    // 4. Priority Filter
    if (params.priority && params.priority !== "all") {
      allTasks = allTasks.filter((t) => t.priority === params.priority);
    }

    // 5. Due Date Filter
    // 'all' | 'overdue' | 'today' | 'week' | 'none'
    if (params.due && params.due !== "all") {
      const todayStr = getTodayString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, "0")}-${String(nextWeek.getDate()).padStart(2, "0")}`;

      if (params.due === "overdue") {
        allTasks = allTasks.filter((t) => t.dueDate && t.dueDate < todayStr && t.status !== "done");
      } else if (params.due === "today") {
        allTasks = allTasks.filter((t) => t.dueDate === todayStr);
      } else if (params.due === "week") {
        allTasks = allTasks.filter(
          (t) => t.dueDate && t.dueDate >= todayStr && t.dueDate <= nextWeekStr
        );
      } else if (params.due === "none") {
        allTasks = allTasks.filter((t) => !t.dueDate);
      }
    }

    // 6. Sorting
    // Support: Title, Due date, Priority, Created date
    // Missing due dates placed after dated tasks
    const sortField = params.sort || "createdAt";
    const direction = params.direction || (sortField === "createdAt" ? "desc" : "asc");

    const priorityWeight: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    allTasks.sort((a, b) => {
      if (sortField === "dueDate") {
        // Missing due dates placed consistently after dated tasks regardless of sort direction
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return direction === "asc"
          ? a.dueDate.localeCompare(b.dueDate)
          : b.dueDate.localeCompare(a.dueDate);
      }

      if (sortField === "priority") {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return direction === "asc" ? weightA - weightB : weightB - weightA;
      }

      if (sortField === "title") {
        return direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      // Default: createdAt
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return direction === "asc" ? timeA - timeB : timeB - timeA;
    });

    const total = allTasks.length;
    const page = Math.max(1, params.page || 1);
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const paginated = allTasks.slice(startIndex, startIndex + pageSize);

    return {
      tasks: paginated,
      total,
    };
  },

  async getTaskById(id: string): Promise<Task | null> {
    await new Promise((r) => setTimeout(r, 120));
    const all = loadFromStorage();
    const found = all.find((t) => t.id === id);
    return found || null;
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const all = loadFromStorage();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }

    const updated: Task = {
      ...all[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    saveToStorage(all);
    return updated;
  },

  async createTask(newTaskData: {
    title: string;
    description?: string;
    status: TaskStatus;
    assigneeId?: string;
    priority: Task["priority"];
    dueDate?: string;
  }): Promise<Task> {
    await new Promise((r) => setTimeout(r, 150));
    const all = loadFromStorage();

    // Determine new ID (TT-xxx)
    const nextNum = all.length + 1001;
    const now = new Date().toISOString();

    const created: Task = {
      id: `TT-${nextNum}`,
      title: newTaskData.title.trim(),
      description: newTaskData.description?.trim() || undefined,
      status: newTaskData.status,
      assigneeId: newTaskData.assigneeId || undefined,
      priority: newTaskData.priority,
      dueDate: newTaskData.dueDate || undefined,
      createdAt: now,
      updatedAt: now,
    };

    all.unshift(created);
    saveToStorage(all);
    return created;
  },

  async getSummaryStats(): Promise<TaskSummaryStats> {
    const all = loadFromStorage();
    const todayStr = getTodayString();

    const total = all.length;
    const inProgress = all.filter((t) => t.status === "in-progress").length;
    const overdue = all.filter(
      (t) => t.dueDate && t.dueDate < todayStr && t.status !== "done"
    ).length;
    const unassigned = all.filter((t) => !t.assigneeId).length;

    return {
      total,
      inProgress,
      overdue,
      unassigned,
    };
  },

  resetToDefault(): void {
    const fresh = generateMockTasks(200);
    saveToStorage(fresh);
  }
};
