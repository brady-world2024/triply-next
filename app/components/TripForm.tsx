"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { postTrip } from "@/app/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tripRequestSchema = z.object({
  destination: z.string().trim().min(1, "Destination required"),
  departTime: z.string().min(1, "Depart date required"),
  returnTime: z.string().min(1, "Return date required"),
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

type TripRequest = z.infer<typeof tripRequestSchema>;

export default function TripForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TripRequest>({
    resolver: zodResolver(tripRequestSchema),
    defaultValues: {
      preference: "CompactTravel",
      theme: "LeisureTravel",
      localTravel: "SelfDriving",
    },
  });

  const onSubmit = async (values: TripRequest) => {
    try {
      const { tripId, shareUrl } = await postTrip(values);

      toast.success("Trip created", {
        description: shareUrl ? "Share link ready." : "Generated successfully.",
      });

      router.push(`/trip/${tripId}`);
    } catch (e: unknown) {

      console.error("[TripForm] postTrip failed:", e);

      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : JSON.stringify(e);

      toast.error("Create failed", { description: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <Label>Destination</Label>
        <Input placeholder="e.g., Wellington" {...register("destination")} />
        {errors.destination && (
          <p className="text-sm text-destructive">
            {errors.destination.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Depart</Label>
          <Input type="date" {...register("departTime")} />
          {errors.departTime && (
            <p className="text-sm text-destructive">
              {errors.departTime.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Return</Label>
          <Input type="date" {...register("returnTime")} />
          {errors.returnTime && (
            <p className="text-sm text-destructive">
              {errors.returnTime.message}
            </p>
          )}
        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="grid gap-2">
          <Label>Preference</Label>
          <Controller
            control={control}
            name="preference"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CompactTravel">Compact</SelectItem>
                  <SelectItem value="RelaxedTravel">Relaxed</SelectItem>
                  <SelectItem value="HybridTravel">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.preference && (
            <p className="text-sm text-destructive">
              {errors.preference.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Theme</Label>
          <Controller
            control={control}
            name="theme"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LeisureTravel">Leisure</SelectItem>
                  <SelectItem value="CultureTravel">Culture</SelectItem>
                  <SelectItem value="NatureTravel">Nature</SelectItem>
                  <SelectItem value="AdventureTravel">Adventure</SelectItem>
                  <SelectItem value="BusinessTravel">Business</SelectItem>
                  <SelectItem value="ShoppingTravel">Shopping</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.theme && (
            <p className="text-sm text-destructive">{errors.theme.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Local travel</Label>
          <Controller
            control={control}
            name="localTravel"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Local travel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SelfDriving">Self-driving</SelectItem>
                  <SelectItem value="PublicTransportation">
                    Public transport
                  </SelectItem>
                  <SelectItem value="Taxi">Taxi</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.localTravel && (
            <p className="text-sm text-destructive">
              {errors.localTravel.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating…" : "Create Trip"}
        </Button>
      </div>
    </form>
  );
}
