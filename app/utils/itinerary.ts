import { parse } from "date-fns";
import {
  FaBus,
  FaTrain,
  FaUtensils,
  FaHotel,
  FaLandmark,
  FaWalking,
} from "react-icons/fa";
import type { TripData, FlatTripEvent } from "@/app/lib/types";


export function flattenItinerary(data: TripData) {
  const entries: Array<{
    ts: Date;
    time: string;
    title: string;
    transfer: string;
    duration: string;
    parking?: string;
  }> = [];

  data.itinerary.forEach((day) => {
    day.schedule.forEach((ev) => {
      const ts = parse(
        `${day.date} ${ev.time}`,
        "yyyy-MM-dd hh:mm a", 
        new Date()
      );
      entries.push({ ...ev, ts });
    });
  });

  entries.sort((a, b) => a.ts.getTime() - b.ts.getTime());
  return entries;
}

export function pickIcon(title: string, transfer: string) {
  const txt = `${title} ${transfer}`.toLowerCase();
  if (txt.includes("bus")) return FaBus;
  if (txt.includes("train") || txt.includes("rail")) return FaTrain;
  if (
    txt.includes("cafe") ||
    txt.includes("dinner") ||
    txt.includes("restaurant") ||
    txt.includes("lunch")
  )
    return FaUtensils;
  if (txt.includes("hotel") || txt.includes("check-in")) return FaHotel;
  if (
    txt.includes("museum") ||
    txt.includes("botanic") ||
    txt.includes("park") ||
    txt.includes("waterfront")
  )
    return FaLandmark;
  return FaWalking;
}
