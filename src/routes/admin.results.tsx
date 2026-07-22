import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSupabaseQuery } from "@/lib/use-supabase-query";

export const Route = createFileRoute("/admin/results")({
  head: () => ({ meta: [{ title: "Results — Proctor Admin" }] }),
  component: Results,
});

type Result = {
  id: string;
  candidate_name: string;
  exam_name: string;
  score: number;
  time_taken: string;
  warnings: number;
  status: string;
};

const fallback: Result[] = Array.from({ length: 10 }, (_, i) => {
  const score = [92, 45, 88, 67, 78, 12, 84, 71, 95, 60][i];
  return {
    id: String(i),
    candidate_name: ["Sneha Rao", "Vivek Pillai", "Ayesha Malik", "Rohit Tandon", "Priya Nair", "Karan Verma", "Aditi Sen", "Nikhil Bose", "Meera Iyer", "Arjun Menon"][i],
    exam_name: "DBMS Mid-Term",
    score,
    time_taken: `${30 + i * 2}:${(10 + i) % 60}`,
    warnings: [0, 3, 0, 1, 0, 5, 0, 2, 0, 1][i],
    status: score >= 40 ? "Pass" : "Fail",
  };
});

const dist = [
  { name: "Pass", value: 82, color: "var(--success)" },
  { name: "Fail", value: 12, color: "var(--destructive)" },
  { name: "Terminated", value: 6, color: "var(--warning)" },
];

function Results() {
  const { data, loading } = useSupabaseQuery<Result>("results", { order: { column: "id", ascending: false } });
  const results = data.length > 0 ? data : fallback;

  return (
    <AdminLayout title="Results">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading && <p className="text-sm text-muted-foreground p-4">Loading…</p>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Warnings</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.candidate_name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.exam_name}</TableCell>
                    <TableCell className="font-mono">{r.score}%</TableCell>
                    <TableCell className="text-muted-foreground">{r.time_taken}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={r.warnings > 2 ? "bg-destructive/10 text-destructive border-0" : "bg-muted text-muted-foreground border-0"}>
                        {r.warnings}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        r.status === "Pass"
                          ? "bg-success/10 text-success border-0"
                          : r.status === "Terminated"
                          ? "bg-warning/15 text-warning-foreground border-0"
                          : "bg-destructive/10 text-destructive border-0"
                      }>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Outcome distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dist} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {dist.map((d) => (<Cell key={d.name} fill={d.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              {dist.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name} · {d.value}%
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
