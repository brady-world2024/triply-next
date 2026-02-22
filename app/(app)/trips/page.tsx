"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { listTrips, type TripSummary } from "@/app/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handleUnauthorized } from "@/app/lib/requireAuth";

function fmtDate(s: string) {
// Backend might return an ISO string of timestamptz

 // Here's a simple example; can replace it with date-fns later.
  return s ? new Date(s).toLocaleString() : "";
}

export default function TripsPage() {
  const [items, setItems] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const data = await listTrips(20);
        setItems(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load trips";

        if (msg.includes("HTTP 401")) {
            handleUnauthorized("/trips");
            return;
        
        } else {
          toast.error("Load failed", { description: msg });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your trips</CardTitle>
          <Button asChild variant="secondary">
            <Link href="/">New trip</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No trips yet. Create your first plan.
            </p>
          ) : (
            <div className="divide-y rounded-md border">
              {items.map((t) => (
                <Link
                  key={t.id}
                  href={`/trip/${t.id}`}
                  className="block p-4 hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {t.destination}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {t.departDate} – {t.returnDate}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-muted-foreground">
                      {fmtDate(t.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
