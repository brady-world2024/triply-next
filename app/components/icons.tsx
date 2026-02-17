// app/components/icons.tsx
import {
  Utensils,
  Landmark,
  Bus,
  Train,
  Car,

  Footprints,
  Hotel,
  Trees,
  ShoppingBag,
  Activity,
  Coffee,
  Bed,
  MapPin,
  Cable,
  Ship,
  Plane,
  HelpCircle,
} from "lucide-react";

export function iconByCategory(category: string) {
  switch (category) {
    case "Food":
      return Utensils;
    case "Landmark":
      return Landmark;
    case "Hotel":
      return Hotel;
    case "Nature":
      return Trees;
    case "Shopping":
      return ShoppingBag;
    case "Activity":
      return Activity;
    case "Rest":
      return Bed;
    case "Transport":
      return MapPin;
    default:
      return HelpCircle;
  }
}

export function iconByTransportMode(mode: string) {
  switch (mode) {
    case "Walk":
      return Footprints;
    case "Bus":
      return Bus;
    case "Train":
      return Train;
    case "Car":
      return Car;
    case "Taxi":
      return Car;
    case "Ferry":
      return Ship;
    case "CableCar":
      return Cable;
    case "Flight":
      return Plane;
    case "None":
      return Coffee;
    default:
      return MapPin;
  }
}
