import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useSupabaseQuery } from "@/lib/use-supabase-query";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Proctor Admin" }] }),
  component: AuditLogs,
});

type AuditLog = {
  id: string;
  created_at: string;
  actor: string;
  event: string;
  severity: string;
  ip_address: string;
  client: string;
};

// A grouped session row: one login + one submit per actor
type SessionRow = {
  key: string;
  actor: string;
  examName: string;
  loginTime: string;
  submitTime: string;
  loginIp: string;
  submitIp: string;
  client: string;
  severity: string;
  eventLabel: string;
};

const tone: Record<string, string> = {
  info: "bg-muted text-muted-foreground border-0",
  warn: "bg-warning/15 text-warning-foreground border-0",
  danger: "bg-destructive/10 text-destructive border-0",
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

// Parse "lat, lng" string → Google Maps URL
function mapsUrl(ip: string) {
  const match = ip?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (!match) return null;
  return `https://www.google.com/maps?q=${match[1]},${match[2]}`;
}

function isCoords(ip: string) {
  return /(-?\d+\.\d+),\s*(-?\d+\.\d+)/.test(ip ?? "");
}

function groupLogs(logs: AuditLog[]): SessionRow[] {
  // Sort oldest first so login comes before submit
  const sorted = [...logs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Bucket by actor name — match login → submit pairs
  const loginMap: Record<string, AuditLog[]> = {};
  const submitMap: Record<string, AuditLog[]> = {};
  const otherLogs: AuditLog[] = [];

  for (const log of sorted) {
    if (log.event.startsWith("Login success")) {
      loginMap[log.actor] = [...(loginMap[log.actor] ?? []), log];
    } else if (
      log.event.startsWith("Exam submitted") ||
      log.event.startsWith("Exam terminated")
    ) {
      submitMap[log.actor] = [...(submitMap[log.actor] ?? []), log];
    } else {
      otherLogs.push(log);
    }
  }

  const rows: SessionRow[] = [];

  // Pair logins with submits per actor
  const allActors = new Set([...Object.keys(loginMap), ...Object.keys(submitMap)]);
  for (const actor of allActors) {
    const logins = loginMap[actor] ?? [];
    const submits = submitMap[actor] ?? [];
    const maxLen = Math.max(logins.length, submits.length);

    for (let i = 0; i < maxLen; i++) {
      const login = logins[i];
      const submit = submits[i];

      // Extract exam name from event text
      const examName =
        submit?.event.replace(/^Exam (submitted|terminated)[^:]*:\s*/, "") ??
        login?.event.replace(/^Login success — joined exam:\s*/, "") ??
        "—";

      const eventLabel = submit
        ? submit.event.startsWith("Exam terminated") ? "Terminated" : "Completed"
        : "In progress";

      rows.push({
        key: `${actor}-${i}`,
        actor,
        examName,
        loginTime: login ? formatTime(login.created_at) : "—",
        submitTime: submit ? formatTime(submit.created_at) : "—",
        loginIp: login?.ip_address ?? "—",
        submitIp: submit?.ip_address ?? "—",
        client: login?.client ?? submit?.client ?? "—",
        severity: submit?.severity ?? login?.severity ?? "info",
        eventLabel,
      });
    }
  }

  // Add ungrouped logs as individual rows
  for (const log of otherLogs) {
    rows.push({
      key: log.id,
      actor: log.actor,
      examName: "—",
      loginTime: formatTime(log.created_at),
      submitTime: "—",
      loginIp: log.ip_address,
      submitIp: "—",
      client: log.client,
      severity: log.severity,
      eventLabel: log.event,
    });
  }

  // Sort newest first
  return rows.reverse();
}

function AuditLogs() {
  const { data, loading } = useSupabaseQuery<AuditLog>("audit_logs", {
    order: { column: "created_at", ascending: false },
  });

  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    const grouped = groupLogs(data);
    if (!filter.trim()) return grouped;
    const q = filter.toLowerCase();
    return grouped.filter(
      (r) =>
        r.actor.toLowerCase().includes(q) ||
        r.examName.toLowerCase().includes(q) ||
        r.eventLabel.toLowerCase().includes(q) ||
        r.loginIp.includes(q) ||
        r.submitIp.includes(q)
    );
  }, [data, filter]);

  return (
    <AdminLayout title="Audit Logs">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by actor, exam, event, IP…"
              className="pl-8 h-9 w-80 rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{rows.length} session{rows.length !== 1 ? "s" : ""}</span>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actor</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Login time</TableHead>
                  <TableHead>Submit time</TableHead>
                  <TableHead>Login location</TableHead>
                  <TableHead>Submit location</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.key}>
                    <TableCell className="font-medium">{r.actor}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.examName}</TableCell>
                    <TableCell>
                      <Badge className={
                        r.eventLabel === "Completed" ? "bg-success/10 text-success border-0"
                        : r.eventLabel === "Terminated" ? "bg-warning/15 text-warning-foreground border-0"
                        : r.eventLabel === "In progress" ? "bg-muted text-muted-foreground border-0"
                        : tone[r.severity] ?? tone.info
                      }>
                        {r.eventLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{r.loginTime}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{r.submitTime}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.loginIp}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.submitIp}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate" title={r.client}>
                      {r.client.length > 40 ? r.client.slice(0, 40) + "…" : r.client}
                    </TableCell>
                    <TableCell>
                      {(isCoords(r.loginIp) || isCoords(r.submitIp)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg h-7 px-2 text-xs gap-1"
                          onClick={() => {
                            const url = mapsUrl(r.loginIp) ?? mapsUrl(r.submitIp);
                            if (url) window.open(url, "_blank");
                          }}
                        >
                          <MapPin className="h-3 w-3" /> Locate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground text-sm py-8">
                      No logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
