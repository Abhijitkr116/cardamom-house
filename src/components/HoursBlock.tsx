"use client";

import { useEffect, useState } from "react";
import { RiTimeLine } from "@remixicon/react";

type OpeningHours = Record<string, string>;

type HoursBlockProps = {
  hours: OpeningHours;
};

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * Get today's weekday according to Lisbon's local time.
 */
function getLisbonWeekday() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase();
}

/**
 * Display the café's weekly opening schedule with today's row highlighted.
 */
export default function HoursBlock({ hours }: HoursBlockProps) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Update the highlighted weekday using Lisbon's timezone.
     */
    function updateToday() {
      setToday(getLisbonWeekday());
    }

    updateToday();

    // Refresh periodically in case the page stays open across midnight.
    const intervalId = window.setInterval(updateToday, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="hours"
      aria-labelledby="hours-heading"
      className="scroll-mt-24 py-8 sm:py-12"
    >
      <div className="overflow-hidden rounded-3xl border border-sand bg-surface shadow-sm">
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          {/* Intro panel */}
          <div className="flex flex-col justify-center bg-panel p-6 text-white sm:p-9 lg:p-10">
            <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
              <RiTimeLine size={26} aria-hidden="true" />
            </span>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Plan your visit
            </p>

            <h2
              id="hours-heading"
              className="mt-3 font-heading text-3xl font-medium text-white sm:text-4xl"
            >
              Weekly Hours
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
              Your favourite brunch spot in Lisbon. Check our hours and find the
              best time to stop by.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/80">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-green-400"
                />
                Open
              </span>

              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-stone-400"
                />
                Closed
              </span>
            </div>
          </div>

          {/* Weekly schedule */}
          <div className="bg-surface p-4 sm:p-7 lg:p-8">
            <div className="mb-3 flex items-center justify-between gap-3 px-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Opening schedule
              </p>

              {today && (
                <span className="text-xs text-muted">Lisbon local time</span>
              )}
            </div>

            <dl className="space-y-1">
              {WEEKDAYS.map((day) => {
                const schedule = hours[day] ?? "Hours unavailable";
                const isToday = today === day;
                const isClosed = /^closed$/i.test(schedule.trim());
                const isAvailable = /\d{1,2}:\d{2}/.test(schedule);

                return (
                  <div
                    key={day}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-colors sm:px-4 ${
                      isToday
                        ? "border-brand/40 bg-cream shadow-sm"
                        : "border-transparent"
                    }`}
                  >
                    <dt className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`size-2 shrink-0 rounded-full ${
                          isClosed
                            ? "bg-stone-400"
                            : isAvailable
                              ? "bg-green-500"
                              : "bg-amber-400"
                        }`}
                      />

                      <span
                        className={`capitalize ${
                          isToday
                            ? "font-bold text-espresso"
                            : isClosed
                              ? "text-muted"
                              : "font-medium text-espresso"
                        }`}
                      >
                        {day}
                      </span>

                      {isToday && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Today
                        </span>
                      )}
                    </dt>

                    <dd
                      className={`shrink-0 text-right text-sm tabular-nums ${
                        isClosed
                          ? "font-medium text-muted"
                          : isToday
                            ? "font-semibold text-brand"
                            : "font-medium text-espresso"
                      }`}
                    >
                      {isClosed ? (
                        <span className="rounded-md bg-sand/50 px-2.5 py-1 text-xs text-espresso">
                          Closed
                        </span>
                      ) : (
                        schedule
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <p className="mt-4 border-t border-sand pt-4 text-xs leading-5 text-muted">
              Hours may change on special occasions. Please contact us if
              you&apos;re planning a special visit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
