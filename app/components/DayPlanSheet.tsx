// app/components/DayPlanSheet.tsx
"use client";

import { DayPlan } from "@/app/lib/tripSchema";
import RouteMap from "@/app/components/RouteMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DayPlanSheet({
  dayPlan,
  destination,
  showAdvice,
  advice,
}: {
  dayPlan: DayPlan;
  destination: string;
  showAdvice: boolean;
  advice: string;
}) {
  return (
    <section className="a4-page">
      <Card className="print-flat">
        <CardHeader>
          <CardTitle className="flex items-baseline justify-between gap-4">
            <span>
              Day {dayPlan.day} · {dayPlan.date}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {destination}
            </span>
          </CardTitle>
          {dayPlan.summary && (
            <p className="text-sm text-muted-foreground">{dayPlan.summary}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <RouteMap items={dayPlan.schedule} />

          {showAdvice && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-1 text-sm font-medium">Trip advice</div>
              <div className="text-sm text-muted-foreground">{advice}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
