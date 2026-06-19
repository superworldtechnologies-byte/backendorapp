"use client";

import { useMemo } from "react";
import { Activity, Clock3, Users, UserRoundSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsDashboard({
  visitors,
  sessions,
}: {
  visitors: any[];
  sessions: any[];
}) {
  const stats = useMemo(() => {
    const anonymousVisitors = visitors.filter((item) => !item.phone).length;
    const totalDuration = sessions.reduce(
      (sum, item) => sum + Number(item.totalDurationSeconds || 0),
      0
    );
    const avgDuration = sessions.length ? Math.round(totalDuration / sessions.length) : 0;

    const sourceMap = sessions.reduce((acc: Record<string, number>, item) => {
      const key = item.source || "direct";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topSources = Object.entries(sourceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalVisitors: visitors.length,
      anonymousVisitors,
      totalSessions: sessions.length,
      avgDuration,
      topSources,
      latestSessions: [...sessions]
        .sort((a, b) => String(b.startedAt || "").localeCompare(String(a.startedAt || "")))
        .slice(0, 10),
    };
  }, [visitors, sessions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Visitors</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.totalVisitors}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Anonymous Visitors</CardTitle>
            <UserRoundSearch className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.anonymousVisitors}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Sessions</CardTitle>
            <Activity className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.totalSessions}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Avg Session Seconds</CardTitle>
            <Clock3 className="h-4 w-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats.avgDuration}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topSources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No source data yet.</p>
            ) : (
              stats.topSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{source}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.latestSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
            ) : (
              stats.latestSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border p-3 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.source || "direct"}</span>
                    <span>{session.totalDurationSeconds || 0}s</span>
                  </div>
                  <p className="text-muted-foreground">
                    {session.startedAt || "-"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}