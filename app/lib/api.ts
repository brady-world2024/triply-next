// app/lib/api.ts
import { http, type ApiError } from "@/app/lib/http";
import { tripDataSchema, type TripData } from "@/app/lib/tripSchema";

type UnknownRecord = Record<string, unknown>;
function asRecord(v: unknown): UnknownRecord | null {
  return v && typeof v === "object" ? (v as UnknownRecord) : null;
}

type CreateTripResponse = {
  tripId: string;
  shareUrl?: string;
  advice?: string;
  itinerary?: unknown;
};

function normalizeTripResponse(respData: unknown): unknown {
  const r = asRecord(respData);
  if (!r) return respData;

  const itineraryRaw = r.Itinerary ?? r.itinerary;
  const adviceRaw = r.Advice ?? r.advice;
  return { itinerary: itineraryRaw ?? [], advice: adviceRaw ?? "" };
}

function ensureString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export async function postTrip(
  values: unknown,
): Promise<{ tripId: string; shareUrl?: string }> {
  try {
    const resp = await http.post("/api/Advisor", values);
    const data = resp.data as unknown;

    const r = asRecord(data);
    const tripId = ensureString(r?.tripId);
    if (!tripId) throw new Error("Trip created but tripId missing");

    const shareUrl = typeof r?.shareUrl === "string" ? r.shareUrl : undefined;
    return { tripId, shareUrl };
  } catch (e) {
    const err = e as ApiError;
    throw new Error(
      err.status ? `HTTP ${err.status}: ${err.message}` : err.message,
    );
  }
}

export async function getTrip(tripId: string): Promise<TripData> {
  try {
    const resp = await http.get(`/api/Trips/${encodeURIComponent(tripId)}`);
    const normalized = normalizeTripResponse(resp.data);
    return tripDataSchema.parse(normalized);
  } catch (e) {
    const err = e as ApiError;
    throw new Error(
      err.status ? `HTTP ${err.status}: ${err.message}` : err.message,
    );
  }
}

export type TripSummary = {
  id: string;
  destination: string;
  departDate: string;
  returnDate: string;
  createdAt: string;
};

function toTripSummary(x: unknown): TripSummary | null {
  const r = asRecord(x);
  if (!r) return null;

  const id = ensureString(r.id);
  if (!id) return null;

  return {
    id,
    destination: ensureString(r.destination),
    departDate: ensureString(r.departDate),
    returnDate: ensureString(r.returnDate),
    createdAt: ensureString(r.createdAt),
  };
}

export async function listTrips(take = 20): Promise<TripSummary[]> {
  const safeTake = Math.min(Math.max(take, 1), 100);

  try {
    const resp = await http.get("/api/Trips", { params: { take: safeTake } });
    const arr = Array.isArray(resp.data) ? (resp.data as unknown[]) : [];
    return arr.map(toTripSummary).filter((x): x is TripSummary => x !== null);
  } catch (e) {
    const err = e as ApiError;
    throw new Error(
      err.status ? `HTTP ${err.status}: ${err.message}` : err.message,
    );
  }
}
