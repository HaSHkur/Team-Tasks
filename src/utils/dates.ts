export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDueDate(dateStr?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  rawDate?: string;
} {
  if (!dateStr) {
    return {
      label: "No due date",
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  }

  const todayStr = getTodayString();
  const [y, m, d] = dateStr.split("-").map(Number);
  const taskDate = new Date(y, m - 1, d);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const isOverdue = dateStr < todayStr;
  const isToday = dateStr === todayStr;
  const isTomorrow = dateStr === tomorrowStr;

  let label: string;
  if (isOverdue) {
    const formatted = taskDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    label = `Overdue (${formatted})`;
  } else if (isToday) {
    label = "Due today";
  } else if (isTomorrow) {
    label = "Due tomorrow";
  } else {
    label = taskDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: taskDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }

  return {
    label,
    isOverdue,
    isToday,
    isTomorrow,
    rawDate: dateStr,
  };
}

export function formatFullDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
