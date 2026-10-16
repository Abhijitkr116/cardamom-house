"use client";

import { useEffect, useState } from "react";

type OpeningHours = Record<string, string>;

type OpenStatusProps = {
  hours: OpeningHours;
};

type ParsedHours = {
  open: number;
  close: number;
  openText: string;
};

/**
 * Get the current weekday and time in the Lisbon timezone.
 */
function getLisbonTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    day: values.weekday.toLowerCase(),
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

/**
 * Parse opening hours such as "08:00 – 15:00".
 * Return null when the café is closed or the schedule is invalid.
 */
function parseHours(schedule: string): ParsedHours | null {
  const matches = schedule.match(
    /(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/,
  );

  if (!matches) return null;

  const openHour = Number(matches[1]);
  const openMinute = Number(matches[2]);
  const closeHour = Number(matches[3]);
  const closeMinute = Number(matches[4]);

  // Validate that the schedule contains valid 24-hour clock times.
  if (openHour > 23 || closeHour > 23 || openMinute > 59 || closeMinute > 59) {
    return null;
  }

  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;

  // This component currently supports same-day opening schedules.
  if (close <= open) return null;

  return {
    open,
    close,
    openText: `${String(openHour).padStart(2, "0")}:${String(openMinute).padStart(2, "0")}`,
  };
}

/**
 * Format minutes since midnight as HH:MM.
 */
function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
}

/**
 * Calculate whether the café is open and find its next opening time.
 */
function getStatus(hours: OpeningHours) {
  const now = getLisbonTime();

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const currentDayIndex = days.indexOf(now.day);

  if (currentDayIndex === -1) {
    return {
      isOpen: false,
      message: "Opening status temporarily unavailable",
    };
  }

  const today = parseHours(hours[now.day] ?? "");

  // Check whether the café is currently open.
  if (today && now.minutes >= today.open && now.minutes < today.close) {
    return {
      isOpen: true,
      message: `Open now · until ${formatTime(today.close)}`,
    };
  }

  // Find the next opening time, checking today and the following six days.
  for (let offset = 0; offset < 7; offset++) {
    const dayIndex = (currentDayIndex + offset) % 7;
    const day = days[dayIndex];
    const schedule = parseHours(hours[day] ?? "");

    if (!schedule) continue;

    // If today's opening time has passed, look for the next day instead.
    if (offset === 0 && now.minutes >= schedule.open) continue;

    const dayLabel = offset === 0 ? "today" : offset === 1 ? "tomorrow" : day;

    return {
      isOpen: false,
      message: `Closed · opens ${dayLabel} at ${schedule.openText}`,
    };
  }

  return {
    isOpen: false,
    message: "Closed · no upcoming opening hours listed",
  };
}

/**
 * Render an opening status badge that refreshes every minute.
 */
export default function OpenStatus({ hours }: OpenStatusProps) {
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(
    null,
  );

  useEffect(() => {
    /**
     * Refresh the café status using the current Lisbon time.
     */
    function updateStatus() {
      setStatus(getStatus(hours));
    }

    updateStatus();

    const intervalId = window.setInterval(updateStatus, 60_000);

    return () => window.clearInterval(intervalId);
  }, [hours]);

  if (!status) {
    return (
      <span className="inline-flex rounded-full border border-white/30 px-3 py-2 text-sm text-white">
        Checking opening hours…
      </span>
    );
  }

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${
        status.isOpen
          ? "border-green-200/50 bg-green-950/40 text-green-100"
          : "border-white/30 bg-black/30 text-white"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${
          status.isOpen ? "bg-green-400" : "bg-stone-300"
        }`}
      />
      {status.message}
    </span>
  );
}
