// app/components/RouteMap.tsx
"use client";

import { ScheduleItem } from "@/app/lib/tripSchema";
import { iconByCategory, iconByTransportMode } from "@/app/components/icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function formatDuration(min: number) {
  if (!min) return "";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function RouteMap({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 text-sm font-medium text-muted-foreground">
        Route
      </div>

      <div className="space-y-4">
        {items.map((ev, idx) => {
          const CatIcon = iconByCategory(ev.category);
          const TIcon = iconByTransportMode(ev.transportMode);

          return (
            <div
              key={`${ev.time}-${idx}`}
              className="grid grid-cols-[72px_1fr] gap-4"
            >
              <div className="text-sm font-medium tabular-nums text-muted-foreground">
                {ev.time}
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CatIcon className="h-4 w-4" />
                      <div className="truncate font-semibold">{ev.title}</div>
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      {ev.place?.area ? `${ev.place.area} · ` : ""}
                      {ev.place?.name}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {formatDuration(ev.durationMinutes) && (
                      <Badge variant="secondary">
                        {formatDuration(ev.durationMinutes)}
                      </Badge>
                    )}
                    <TIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {ev.transfer && (
                  <div className="text-sm text-muted-foreground">
                    {ev.transfer}
                  </div>
                )}

                {idx !== items.length - 1 && <Separator />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
