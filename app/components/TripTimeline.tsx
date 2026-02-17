"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { flattenItinerary, pickIcon } from "@/app/utils/itinerary";
import { format } from "date-fns";
import styles from "./TripTimeline.module.css";
import { TripData } from "../lib/types";

export default function TripTimeline({ data }: { data: TripData }) {
  const events = flattenItinerary(data);

  return (
    <div className={styles.timeline}>
      <VerticalTimeline lineColor="#1976d2">
        {events.map((ev, i) => {
          const Icon = pickIcon(ev.title, ev.transfer);
          return (
            <VerticalTimelineElement
              key={i}
              date={format(ev.ts, "MMM d, h:mm a")}
              icon={<Icon color="white" />}
              iconStyle={{ background: "#1976d2" }}
              contentStyle={{ boxShadow: "none" }}
            >
              <h3 className="vertical-timeline-element-title">{ev.title}</h3>
              <h4 className="vertical-timeline-element-subtitle">
                {ev.transfer} • {ev.duration}
              </h4>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </div>
  );
}
