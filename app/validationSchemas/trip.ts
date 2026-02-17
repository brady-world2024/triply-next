import { z } from "zod";

export const tripSchema = z.object({
  destination: z.string().min(1, "Destination required"),

  departTime: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid depart date" }),

  returnTime: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid return date" }),

  preference: z.enum(["CompactTravel", "RelaxedTravel", "HybridTravel"]),

  theme: z.enum([
    "LeisureTravel",
    "CultureTravel",
    "NatureTravel",
    "AdventureTravel",
    "BusinessTravel",
    "ShoppingTravel",
  ]),

  localTravel: z.enum(["SelfDriving", "PublicTransportation", "Taxi"]),
});

export type TripFormValues = z.infer<typeof tripSchema>;
