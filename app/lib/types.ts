// app/lib/types.ts

export type TravelPreference =
  | "CompactTravel"
  | "RelaxedTravel"
  | "HybridTravel";

export type TravelTheme =
  | "LeisureTravel"
  | "CultureTravel"
  | "NatureTravel"
  | "AdventureTravel"
  | "BusinessTravel"
  | "ShoppingTravel";

export type LocalTravel = "SelfDriving" | "PublicTransportation" | "Taxi";

export interface TripScheduleItem {
  time: string; // "08:00" (24h) or "08:00 AM" (if you use AM/PM adjust parsing)
  title: string;
  transfer: string; // e.g. "Bus", "Walk", etc.
  duration: string; // e.g. "30m", "2h"
}

export interface TripDay {
  date: string; // "2026-01-02"
  schedule: TripScheduleItem[];
}

export interface TripData {
  itinerary: TripDay[];
}


export interface FlatTripEvent extends TripScheduleItem {
  ts: Date;
}

