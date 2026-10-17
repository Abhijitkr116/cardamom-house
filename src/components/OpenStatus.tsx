
import type { RestaurantHours } from "@/types/menu";

export type DemoState = "open" | "closed" | "special-sold-out";

type OpenStatusProps = {
  hours: RestaurantHours;
  demoState: DemoState;
};

type ParsedHours = {
  open: number;
  close: number;
  openText: string;
  closeText: string;
};

/**
 * Parse a daily schedule such as "08:00 – 15:00".
 * Return null if the schedule is closed or invalid.
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

  // Validate the 24-hour clock values.
  if (
    openHour > 23 ||
    closeHour > 23 ||
    openMinute > 59 ||
    closeMinute > 59
  ) {
    return null;
  }

  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;

  // This parser supports opening and closing on the same day.
  if (close <= open) return null;

  return {
    open,
    close,
    openText: `${String(openHour).padStart(2, "0")}:${String(openMinute).padStart(2, "0")}`,
    closeText: `${String(closeHour).padStart(2, "0")}:${String(closeMinute).padStart(2, "0")}`,
  };
}

/**
 * Calculate the displayed status for each demo scenario.
 */
function getDemoStatus(
  hours: RestaurantHours,
  demoState: DemoState,
) {
  const tuesday = parseHours(hours.tuesday);

  // Simulate Monday as closed and show Tuesday's opening time.
  if (demoState === "closed") {
    return {
      isOpen: false,
      message: tuesday
        ? `Closed · opens Tuesday at ${tuesday.openText}`
        : "Closed · next opening time unavailable",
    };
  }

  // Simulate Tuesday at 11:30 for both open scenarios.
  const simulatedMinutes = 11 * 60 + 30;

  if (
    tuesday &&
    simulatedMinutes >= tuesday.open &&
    simulatedMinutes < tuesday.close
  ) {
    return {
      isOpen: true,
      message: `Open now · until ${tuesday.closeText}`,
    };
  }

  // Explain the schedule if Tuesday at 11:30 falls outside opening hours.
  if (tuesday) {
    return {
      isOpen: false,
      message: `Demo time 11:30 · Tuesday hours are ${tuesday.openText}–${tuesday.closeText}`,
    };
  }

  return {
    isOpen: false,
    message: "Opening status unavailable · check our hours below",
  };
}

/**
 * Display the opening status using the component's own props type.
 */
export default function OpenStatus({
  hours,
  demoState,
}: OpenStatusProps) {
  const status = getDemoStatus(hours, demoState);

  return (
    <span
      role="status"
      className={`inline-flex flex-wrap items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${
        status.isOpen
          ? "border-green-200/50 bg-green-950/40 text-green-100"
          : "border-white/30 bg-black/30 text-white"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${
          status.isOpen ? "bg-green-400" : "bg-stone-300"
        }`}
      />
      {status.message}
    </span>
  );
}
