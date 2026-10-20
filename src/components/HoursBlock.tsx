"use client";

import { motion } from "motion/react";
import type { RestaurantHours } from "@/types/menu";

type HoursBlockProps = {
  hours: RestaurantHours;
};

// Defines the valid weekday keys supported by RestaurantHours.
const days: { key: keyof RestaurantHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// Displays the restaurant's weekly opening hours with theme-aware styling.
export default function HoursBlock({ hours }: HoursBlockProps) {
  // Gets today's weekday using the browser's local date.
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase();

    // console.log(hours["tuesday"]);

  return (
    <section
      id="hours"
      className="bg-cream px-5 py-20 text-espresso transition-colors duration-300 sm:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-panel p-8 text-white sm:p-10"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Come visit us
          </p>

          <h2 className="mb-5 font-heading text-3xl font-semibold sm:text-4xl">
            Good food, slow mornings.
          </h2>

          <p className="leading-7 text-white/75">
            Join us for a relaxed brunch, freshly brewed coffee, and comforting
            flavours inspired by our love of good food.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Opening hours
          </p>

          <h3 className="mb-6 font-heading text-2xl font-semibold">
            Plan your visit
          </h3>

          <div className="divide-y divide-sand rounded-xl border border-sand bg-surface px-5">
            {days.map(({ key, label }) => {
              const isToday = today === key;

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-4 py-4 ${
                    isToday
                      ? "font-semibold text-brand"
                      : "text-espresso"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-right text-sm sm:text-base">
                    {hours[key]}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">
            Opening hours may vary on public holidays. Please contact us if
            you are planning a special visit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
