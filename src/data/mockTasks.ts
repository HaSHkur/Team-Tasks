import { Task, TaskPriority, TaskStatus } from "../types/task";
import { TEAM_MEMBERS } from "./users";

// Deterministic PRNG using Mulberry32
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const baseTitles = [
  "Fix checkout validation when billing address differs from shipping address",
  "Review Q3 campaign landing page copy",
  "Investigate intermittent payment timeout on mobile Safari",
  "Prepare product photography assets for winter collection",
  "Update inventory synchronization job",
  "Customer export occasionally contains duplicate records",
  "Fix typo",
  "API 500 on /health",
  "SSL renewal",
  "Audit user role permissions for compliance reporting and SOC2 certification readiness",
  "Refactor notification delivery worker queue to prevent deadlocks under high burst loads",
  "Add multi-factor authentication recovery codes modal",
  "Optimize Postgres queries for dashboard analytics aggregation",
  "Upgrade React Router to latest stable release",
  "Fix layout shift on pricing cards during font swap",
  "Implement idempotency keys for Stripe webhook ingestion",
  "Write end-to-end Cypress tests for sign-up checkout funnel",
  "Fix dark mode contrast ratio on disabled input placeholders",
  "Migrate legacy Redis session cache to distributed cluster",
  "Patch vulnerable lodash sub-dependency reported by dependabot",
  "Resolve Safari flexbox gap rendering glitch in checkout stepper",
  "Add CSV import validation for bulk customer records",
  "Standardize error response structure across microservices",
  "Fix race condition in task status optimistic updates",
  "Investigate memory leak in WebSocket connection manager",
  "Add rate limiting to public password reset endpoint",
  "Support drag-to-reorder for custom dashboard widgets",
  "Update privacy policy banner for GDPR/CCPA compliance",
  "Implement automatic retry with exponential backoff for third-party shipping API",
  "Benchmark cold-start latency on serverless edge functions",
  "Fix broken deep links on iOS universal link callbacks",
  "Resolve timezone mismatch in recurring calendar exports",
  "Add automated lint rule preventing raw unescaped strings in JSX",
  "Clean up orphaned S3 image assets from canceled user drafts",
  "Design fallback illustrations for empty search filter results",
  "Support HEIC image conversion on mobile avatar upload",
  "Fix keyboard trapping issue inside modal dialogs for screen readers",
  "Deprecate v1 REST endpoints and update developer documentation",
  "Investigate database connection pool exhaustion during peak hours",
  "Add export audit logs to S3 compliance bucket"
];

const sampleDescriptions = [
  "Customers reported that clicking 'Place Order' with separate billing and shipping addresses produces an unhandled form error. Needs validation schema update and localized error messaging.",
  "Marketing team submitted new copy for the fall release. Requires proofreading, legal disclaimer verification, and mobile viewport typography adjustments.",
  "Sentinels flagged elevated 504 Gateway Timeouts for Safari 16+ users on mobile cellular connections. Initial telemetry points to slow TLS handshake renegotiation.",
  "High resolution RAW photos need conversion to web-optimized WebP with 2x retina descriptors and responsive srcset tags.",
  "Nightly cron batch fails intermittently due to database lock contention on inventory_counts table. Need to chunk updates into 500-item transactions.",
  "Data engineering noticed duplicate primary keys during weekly analytics ETL extraction. Needs deduplication filter and unique constraint enforcement.",
  "Security requirement for upcoming enterprise client demo. Must provide 10 single-use emergency backup recovery codes upon 2FA enrollment.",
  "Query analyzer shows sequential scans on order_events table taking >850ms. An index on (tenant_id, created_at DESC) will resolve this.",
  "The current implementation crashes when the network fluctuates. Implement an exponential backoff with jitter up to 5 attempts."
];

export function generateMockTasks(count = 200, seed = 1337): Task[] {
  const rng = mulberry32(seed);
  const tasks: Task[] = [];

  const statuses: TaskStatus[] = ["backlog", "in-progress", "blocked", "done"];
  const priorities: TaskPriority[] = ["low", "medium", "high"];

  // Baseline reference date: current date or stable reference
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  for (let i = 1; i <= count; i++) {
    // Deterministic selection
    let title: string;
    const titleRoll = rng();
    if (i === 1) {
      title = "Fix checkout validation when billing address differs from shipping address";
    } else if (i === 2) {
      title = "Review Q3 campaign landing page copy";
    } else if (i === 3) {
      title = "Investigate intermittent payment timeout on mobile Safari";
    } else if (i === 4) {
      title = "Fix typo"; // very short
    } else if (i === 5) {
      title = "API 500"; // very short
    } else if (i === 6) {
      title = "Audit user role permissions for compliance reporting and SOC2 certification readiness with comprehensive third-party penetration testing logs review"; // very long
    } else {
      const base = baseTitles[Math.floor(rng() * baseTitles.length)];
      if (titleRoll < 0.15) {
        title = `${base} — Phase ${Math.floor(rng() * 4) + 1} integration and telemetry validation`;
      } else {
        title = base;
      }
    }

    // Status distribution: ~30% in-progress, ~25% backlog, ~15% blocked, ~30% done
    const statusRoll = rng();
    let status: TaskStatus;
    if (statusRoll < 0.25) status = "backlog";
    else if (statusRoll < 0.55) status = "in-progress";
    else if (statusRoll < 0.70) status = "blocked";
    else status = "done";

    // Priority distribution: ~25% high, ~50% medium, ~25% low
    const prioRoll = rng();
    let priority: TaskPriority;
    if (prioRoll < 0.25) priority = "high";
    else if (prioRoll < 0.75) priority = "medium";
    else priority = "low";

    // Assignee: ~18% unassigned, otherwise assign to one of TEAM_MEMBERS
    // Ensure Bartholomew-Wellington Montgomery III has several tasks
    const hasAssignee = rng() > 0.18;
    let assigneeId: string | undefined = undefined;
    if (hasAssignee) {
      if (i % 7 === 0) {
        assigneeId = "usr_4"; // Bartholomew-Wellington Montgomery III
      } else {
        const memberIndex = Math.floor(rng() * TEAM_MEMBERS.length);
        assigneeId = TEAM_MEMBERS[memberIndex].id;
      }
    }

    // Due date:
    // ~15% No due date
    // ~25% Overdue (negative offset -1 to -14 days)
    // ~10% Due today (offset 0)
    // ~50% Future dates (+1 to +21 days)
    let dueDate: string | undefined = undefined;
    const dateRoll = rng();
    if (dateRoll >= 0.15) {
      let dayOffset: number;
      if (dateRoll < 0.40) {
        // Overdue (-1 to -12 days)
        dayOffset = -(Math.floor(rng() * 12) + 1);
      } else if (dateRoll < 0.50) {
        // Due today
        dayOffset = 0;
      } else {
        // Future (+1 to +20 days)
        dayOffset = Math.floor(rng() * 20) + 1;
      }

      const d = new Date(currentYear, currentMonth, currentDate + dayOffset);
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, "0");
      const dStr = String(d.getDate()).padStart(2, "0");
      dueDate = `${yStr}-${mStr}-${dStr}`;
    }

    // Description: ~20% missing description
    let description: string | undefined = undefined;
    if (rng() > 0.20) {
      const descTemplate = sampleDescriptions[Math.floor(rng() * sampleDescriptions.length)];
      description = `${descTemplate}\n\nKey deliverables for ticket TT-${1000 + i}:\n- Unit and integration tests\n- Documentation update in internal wiki\n- Staging deployment verification`;
    }

    // Created & Updated timestamps
    const daysAgoCreated = Math.floor(rng() * 45) + 1;
    const createdDate = new Date(currentYear, currentMonth, currentDate - daysAgoCreated, 9 + (i % 8), (i * 7) % 60);
    const updatedDate = new Date(createdDate.getTime() + Math.floor(rng() * (daysAgoCreated * 24 * 60 * 60 * 1000)));

    tasks.push({
      id: `TT-${1000 + i}`,
      title,
      description,
      status,
      assigneeId,
      priority,
      dueDate,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
    });
  }

  return tasks;
}
