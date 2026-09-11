# Team Tasks System

A focused, accessible, and high-performance task management frontend designed for teams of 8–15 people. Built with React 19, TypeScript, Vite, and React Router, adhering to strict internal productivity design principles.

---

## 1. Project Overview

Team Tasks provides engineering and product teams with an immediate, density-optimized dashboard to triage, track, and execute work. The application prioritizes:

- **Instant visibility**: Overdue tasks, unassigned tickets, and in-progress work are immediately highlighted.
- **URL-as-State**: Every filter, search term, sort parameter, and pagination offset lives in the URL, enabling 1:1 view sharing, browser bookmarking, and history traversal.
- **Adaptive Ergonomics**: A dense 5-column table on desktop (1280px+), balanced medium layout on tablet (768px), and dedicated mobile card interfaces at 375px with zero horizontal scrolling.
- **Fast status updates**: Change task states directly from the list, table, or detail view without drag-and-drop complexity.

---

## 2. How to Run

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```

---

## 3. Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 6, tsx
- **Routing**: React Router v7 (`BrowserRouter`, `Routes`, `Route`, `useSearchParams`, `useNavigate`)
- **Styling**: Tailwind CSS v4 with custom CSS base reset and accessible focus tokens
- **Icons**: Lucide React
- **Storage**: Deterministic Seeded In-Memory/LocalStorage Task Store

---

## 4. Data Model

The data model matches the specification:

```typescript
export type TaskStatus = "backlog" | "in-progress" | "blocked" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type DueDateFilter = "all" | "overdue" | "today" | "week" | "none";

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  avatarInitials?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Deterministic Dataset

- **200 generated tasks** using a deterministic pseudo-random number generator (Mulberry32).
- Edge cases included:
  - Very short titles (`Fix typo`, `API 500`, `SSL renewal`)
  - Very long titles (>120 characters without overflow breaks)
  - Missing descriptions (`No description`)
  - Missing assignees (`Unassigned`)
  - Missing due dates (`No due date`)
  - Overdue dates (`⚠️ Overdue (date)`)
  - Due today & due tomorrow indicators
  - Long member name: `Bartholomew-Wellington Montgomery III`

---

## 5. Workflow Stages + Rationale

1. **Dashboard & Summary**: 4 key telemetry cards (Total, In Progress, Overdue, Unassigned) give team leads and engineers instant situational awareness without cognitive overload.
2. **Search & Quick Triage**: Title and ID search debounced to 250ms directly synchronized to `?q=...`.
3. **Multi-dimensional Filtering**: Filter by status, assignee, priority, and relative due date range. All filter adjustments automatically reset `page=1` to prevent out-of-bounds pagination.
4. **Instant In-Place Status Updates**: Changing a task status from the table or card updates the persistent local store optimistically and refreshes summary statistics immediately without full-page reloads.
5. **Detail Inspection**: `/tasks/:taskId` presents complete task metadata, formatted creation/modification dates, full description or explicit fallback states, and status switching.
6. **Task Creation**: Accessible modal on desktop and sheet on mobile with client validation (trimmed title required, max 200 chars, default statuses).

---

## 6. Layout Choice + Rationale

- **Desktop (1280px)**: A dense data table (`Task | Assignee | Status | Priority | Due`). Horizontal space is utilized for scanning IDs, titles, assignee tags, and status dropdowns without visual clipping.
- **Tablet (768px)**: Responsive column compression and flexible filter bars ensure no secondary information overlaps or triggers horizontal scrollbars.
- **Mobile (375px)**: Tables are replaced with custom structured cards. Mobile cards display the task ID, title, assignee pill, inline status switcher, priority tag, and due date warning badge.

---

## 7. Mobile Strategy

- **Zero Horizontal Scrolling**: Tables are strictly hidden below `md` (`768px`). Stacked vertical cards maintain a 100% viewport width containment.
- **Filter Sheet**: Instead of wrapping 5 dropdowns into multiple messy rows, mobile users tap `[ Filters (count) ]` to open an accessible bottom sheet with `[Clear all]` and `[Apply]`.
- **Touch Targets**: All touch targets on mobile (buttons, selects, row triggers) meet or exceed 44x44px requirements.
- **Native Select Fallbacks**: Select menus use styled native elements for consistent OS picker behavior on iOS and Android.

---

## 8. What Was Intentionally NOT Built + Why

In accordance with Section 3:

- **Authentication & RBAC**: Excluded to focus purely on user-facing UI quality and responsiveness.
- **Drag-and-Drop Kanban**: Column boards introduce severe horizontal layout friction on 375px screens and degrade keyboard accessibility.
- **Complex Backend / Real-time WebSockets**: Client-side seeded store with simulated latency accurately verifies loading skeletons and error/retry states without backend infrastructure overhead.
- **Dark Mode**: Avoided per prompt ("Do not implement dark mode unless all required work is complete") to maintain high-contrast WCAG AA accessible light-mode palette.

---

## 9. 2–3 Uncertain Decisions + Alternatives

1. **Search Debounce Interval (250ms vs. Form Submit)**:
   - _Decision_: 250ms debounce into URL query parameters.
   - _Alternative_: An explicit search button.
   - _Trade-off_: Debouncing creates natural "live filtering" as the user types, but triggers intermediate history pushes if not replacing URL entries. We used search param replacement to keep history clean.
2. **Missing Due Date Sorting Position**:
   - _Decision_: Placed tasks with `No due date` at the end of the list consistently regardless of ascending or descending direction.
   - _Alternative_: Placing nulls first on descending.
   - _Trade-off_: Consistent end placement matches standard issue trackers (Jira, Linear) where unscheduled work does not obscure urgent scheduled dates.
3. **Table Row Click vs. Dedicated View Button**:
   - _Decision_: Entire row/card is clickable and keyboard accessible (Enter key navigation), with `e.stopPropagation()` on the status select.
   - _Alternative_: Explicit "View" link column.
   - _Trade-off_: Whole-row clicking maximizes speed on desktop and touch usability on mobile.

---

## 10. AI Tooling Used

Developed using ChatGPT Codex and Gemini 2./3 model for architecture planning, structure generation, UI Styling and verification.

---

## 11. Responsive Breakpoint Layout Verification

### 375px (Mobile Portrait)

- Header: Compact with brand and `+ New task` button.
- Summary: 2x2 grid cards with clear typography.
- Controls: Search input + `[ Filters (N) ]` sheet trigger.
- Content: Touch-friendly task cards with status dropdown and due date alerts.
- Filter Sheet: Bottom modal with dismiss handle, Escape listener, and Apply button.
- Layout: 0px horizontal overflow.

### 768px (Tablet)

- Header: Full brand + workspace pill + action button.
- Summary: 4 horizontal stat cards.
- Controls: Inline search with desktop filter dropdowns.
- Content: Compact table with readable columns.

### 1280px (Desktop Wide)

- Header: Spacious 7xl container alignment.
- Summary: High-contrast density cards.
- Controls: Full search bar, status, assignee, priority, due date, sort selector, and direction toggle.
- Content: Full 5-column productivity table with hover row highlights and keyboard focus rings.
