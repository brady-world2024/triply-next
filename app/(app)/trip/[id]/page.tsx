"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTrip } from "@/app/lib/api";
import type { TripData } from "@/app/lib/tripSchema";

import DayPlanSheet from "@/app/components/DayPlanSheet";
import ShareBar from "@/app/components/ShareBar";
import { Card, CardContent } from "@/components/ui/card";
import { handleUnauthorized } from "@/app/lib/requireAuth";


function parseHttpStatus(msg: string): number | null {
  // To ensure compatibility, formatError() returns: "HTTP 401: ..."
  const m = msg.match(/HTTP\s+(\d{3})/i);
  if (!m) return null;
  const code = Number(m[1]);
  return Number.isFinite(code) ? code : null;
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const tripId = params?.id;

  const [trip, setTrip] = useState<TripData | null>(null);
  const [error, setError] = useState<string>("");

  const appBase =
    process.env.NEXT_PUBLIC_APP_BASE?.trim() || "http://localhost:3000";

  const shareUrl = useMemo(() => {
    if (!tripId) return "";
    return `${appBase}/trip/${tripId}`;
  }, [appBase, tripId]);

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      try {
        const data = await getTrip(tripId);
        setTrip(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load trip";

        const status = parseHttpStatus(msg);

        //  Not logged in: Redirect directly to login with a next button for backtracking.
        if (status === 401) {
        handleUnauthorized(`/trip/${tripId}`);
        return;
        }

        // Only a 404 error will display "not found"
        if (status === 404) {
          setError("Trip not found.");
          return;
        }

        setError(msg);
      }
    })();
  }, [tripId, router]);

  if (!tripId) return <p>Loading…</p>;
  if (error) return <p className="text-destructive">{error}</p>;
  if (!trip) return <p>Loading…</p>;

  const startDate = trip.itinerary?.[0]?.date ?? "";
  const endDate = trip.itinerary?.at?.(-1)?.date ?? "";

  const destinationGuess =
    trip.itinerary?.[0]?.schedule?.[0]?.place?.mapQuery ||
    trip.itinerary?.[0]?.schedule?.[0]?.place?.name ||
    "Trip";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card className="no-print print-flat">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="text-lg font-semibold">Your itinerary</div>
            <div className="text-sm text-muted-foreground">
              {startDate} {startDate && endDate ? "–" : ""} {endDate}
            </div>
          </div>

          <ShareBar shareUrl={shareUrl} title={destinationGuess} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {(trip.itinerary ?? []).map((dayPlan, idx) => (
          <DayPlanSheet
            key={`${dayPlan.day}-${dayPlan.date}`}
            dayPlan={dayPlan}
            destination={destinationGuess}
            showAdvice={idx === 0}
            advice={trip.advice}
          />
        ))}
      </div>
    </div>
  );
}
