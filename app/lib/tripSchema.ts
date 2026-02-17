// app/lib/tripSchema.ts
import { z } from "zod";

export const CategoryEnum = z.enum([
  "Food",
  "Landmark",
  "Transport",
  "Hotel",
  "Nature",
  "Shopping",
  "Activity",
  "Rest",
  "Other",
]);
export type Category = z.infer<typeof CategoryEnum>;

export const TransportModeEnum = z.enum([
  "None",
  "Walk",
  "Bus",
  "Taxi",
  "Train",
  "Car",
  "Ferry",
  "CableCar",
  "Flight",
]);
export type TransportMode = z.infer<typeof TransportModeEnum>;

/**
 * Input tolerance: Accepts entries such as Food/food/FOOD, and standardizes them into a single enumeration.
 * - Illegal/Unknown Values => Other
 */
const CategoryInput = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => {
    const lower = v.toLowerCase();
    const map: Record<string, Category> = {
      food: "Food",
      landmark: "Landmark",
      transport: "Transport",
      hotel: "Hotel",
      nature: "Nature",
      shopping: "Shopping",
      activity: "Activity",
      rest: "Rest",
      other: "Other",
    };
    return map[lower] ?? "Other";
  })
  .pipe(CategoryEnum);

/**
 * transportMode Input error tolerance (optional, but recommended to avoid occasional case changes on the backend).
 * - Illegal/Unknown Values => None
 */
const TransportModeInput = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => {
    const lower = v.toLowerCase();
    const map: Record<string, TransportMode> = {
      none: "None",
      walk: "Walk",
      bus: "Bus",
      taxi: "Taxi",
      train: "Train",
      car: "Car",
      ferry: "Ferry",
      cablecar: "CableCar",
      cable_car: "CableCar",
      "cable car": "CableCar",
      flight: "Flight",
      plane: "Flight",
    };
    return map[lower] ?? "None";
  })
  .pipe(TransportModeEnum);

const placeSchema = z
  .object({
    name: z.string().min(1),
    area: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    mapQuery: z.string().nullable().optional(),
  })
  .partial()
  .extend({
    name: z.string().min(1),
  });

/**
 * Compatible with two backends:：
 * - New：durationMinutes/category/transportMode/place
 * - Old：duration(string)/parking
 */
const scheduleItemSchema = z
  .object({
    time: z.string(),
    title: z.string(),
    transfer: z.string().optional().default(""),


    durationMinutes: z.number().int().nonnegative().optional(),


    category: z
      .union([CategoryInput, z.undefined()])
      .optional()
      .default("Other"),

    transportMode: z
      .union([TransportModeInput, z.undefined()])
      .optional()
      .default("None"),

    place: placeSchema.optional(),


    duration: z.string().optional(),
    parking: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .transform((v) => {
    const durationMinutes =
      typeof v.durationMinutes === "number"
        ? v.durationMinutes
        : typeof v.duration === "string"
        ? guessMinutesFromText(v.duration)
        : 0;

    const place =
      v.place &&
      typeof v.place.name === "string" &&
      v.place.name.trim().length > 0
        ? v.place
        : {
            name: v.title,
            mapQuery: v.title,
            area: null,
            address: null,
            lat: null,
            lng: null,
          };

    return {
      time: v.time,
      title: v.title,
      transfer: v.transfer ?? "",
      durationMinutes,

      category: v.category ?? "Other",
      transportMode: v.transportMode ?? "None",
      place,
      parking: v.parking ?? null,
      notes: v.notes ?? null,
    };
  });

const dayPlanSchema = z.object({
  day: z.number().int(),
  date: z.string(),
  summary: z.string().nullable().optional(),
  schedule: z.array(scheduleItemSchema),
});

export const tripDataSchema = z.object({
  advice: z.string(),
  itinerary: z.array(dayPlanSchema),
});

export type TripData = z.infer<typeof tripDataSchema>;
export type DayPlan = z.infer<typeof dayPlanSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;

function guessMinutesFromText(s: string): number {
  const t = s.toLowerCase();
  const h = t.match(/(\d+(\.\d+)?)\s*h/);
  if (h) return Math.round(parseFloat(h[1]) * 60);
  const m = t.match(/(\d+)\s*m/);
  if (m) return parseInt(m[1], 10);
  return 0;
}
