import axios from "axios";
import { tripDataSchema, type TripData } from "@/app/lib/tripSchema";

const BASE_URL = "http://localhost:5170/api/advisor";

type UnknownRecord = Record<string, unknown>;

function asRecord(v: unknown): UnknownRecord | null {
  return v && typeof v === "object" ? (v as UnknownRecord) : null;
}

function safeStringify(v: unknown): string {
  try {
    return typeof v === "string" ? v : JSON.stringify(v);
  } catch {
    return "Unknown error";
  }
}

function normalizeTripResponse(respData: unknown): unknown {
  const r = asRecord(respData);
  if (!r) return respData;

  const itineraryRaw = r.Itinerary ?? r.itinerary;
  const adviceRaw = r.Advice ?? r.advice;

  const itineraryArr = Array.isArray(itineraryRaw) ? itineraryRaw : [];

  const normalizedItinerary = itineraryArr.map((day) => {
    const d = asRecord(day) ?? {};
    const scheduleRaw = d.Schedule ?? d.schedule;
    const scheduleArr = Array.isArray(scheduleRaw) ? scheduleRaw : [];

    const normalizedSchedule = scheduleArr.map((ev) => {
      const e = asRecord(ev) ?? {};
      return {
        time: e.Time ?? e.time,
        title: e.Title ?? e.title,
        transfer: e.Transfer ?? e.transfer,
        duration: e.Duration ?? e.duration,
        parking: e.Parking ?? e.parking,
        place: e.Place ?? e.place,
        category: e.Category ?? e.category,
        transportMode: e.TransportMode ?? e.transportMode,
        durationMinutes: e.DurationMinutes ?? e.durationMinutes,
        notes: e.Notes ?? e.notes,
      };
    });

    return {
      day: d.Day ?? d.day,
      date: d.Date ?? d.date,
      schedule: normalizedSchedule,
    };
  });

  return { itinerary: normalizedItinerary, advice: adviceRaw };
}

function formatError(e: unknown): string {
  // zod issues
  const er = asRecord(e);
  const issues = er?.issues;
  if (Array.isArray(issues) && issues.length > 0) {
    const first = asRecord(issues[0]);
    const path = Array.isArray(first?.path) ? first?.path.join(".") : "";
    const msg =
      typeof first?.message === "string" ? first.message : "Invalid data";
    return path ? `${path}: ${msg}` : msg;
  }

  // axios error
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const data = e.response?.data;
    if (status) return `HTTP ${status}: ${safeStringify(data)}`;
    return `Network: ${e.message}`;
  }

  if (e instanceof Error) return e.message;
  return safeStringify(e);
}

export async function postTrip(
  values: unknown
): Promise<{ tripId: string; shareUrl?: string }> {
  if (typeof window === "undefined") {
    throw new Error(
      "postTrip must be called in the browser (window is undefined)"
    );
  }

  try {
    const resp = await axios.post(BASE_URL, values);

    const normalized = normalizeTripResponse(resp.data);
    const parsed: TripData = tripDataSchema.parse(normalized);

    const tripId = crypto.randomUUID();
    sessionStorage.setItem(tripId, JSON.stringify(parsed));

    return { tripId };
  } catch (e) {
    throw new Error(formatError(e));
  }
}

export async function getTrip(tripId: string): Promise<TripData> {
  if (typeof window === "undefined") {
    throw new Error(
      "getTrip must be called in the browser (window is undefined)"
    );
  }
  const str = sessionStorage.getItem(tripId);
  if (!str) throw new Error("Trip data not found (sessionStorage empty)");
  return JSON.parse(str) as TripData;
}
