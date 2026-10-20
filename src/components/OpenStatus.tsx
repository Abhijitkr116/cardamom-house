import type { RestaurantHours } from "@/types/menu";

// Supports real-time status and the three demo scenarios.
export type DemoState = "actual" | "open" | "closed" | "special-sold-out";

// Defines the props accepted by this component.
type OpenStatusProps = {
  hours: RestaurantHours;
  demoState: DemoState;
};

// Stores parsed opening and closing times.
type ParsedHours = {
  open: number;
  close: number;
  openText: string;
  closeText: string;
};

// Defines weekday keys and display labels in calendar order.
const days: { key: keyof RestaurantHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// Parses and validates a schedule such as "08:00 – 15:00".
function parseHours(schedule: string): ParsedHours | null {
  const matches = schedule.match(
    /^\s*(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*$/,
  );

  if (!matches) return null;

  const openHour = Number(matches[1]);
  const openMinute = Number(matches[2]);
  const closeHour = Number(matches[3]);
  const closeMinute = Number(matches[4]);

  // Rejects invalid 24-hour clock values.
  if (openHour > 23 || closeHour > 23 || openMinute > 59 || closeMinute > 59) {
    return null;
  }

  const open = openHour * 60 + openMinute;
  const close = closeHour * 60 + closeMinute;

  // Supports opening and closing on the same day only.
  if (close <= open) return null;

  return {
    open,
    close,
    openText: `${String(openHour).padStart(2, "0")}:${String(openMinute).padStart(2, "0")}`,
    closeText: `${String(closeHour).padStart(2, "0")}:${String(closeMinute).padStart(2, "0")}`,
  };
}

// Gets the current weekday and time in Boa Vista, Cape Verde.
function getLocalTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Atlantic/Cape_Verde",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  
  // Retrieves an individual part from the formatted local time.
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    day: get("weekday").toLowerCase(),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// Finds the next day with valid opening hours, skipping closed days.
function getNextOpening(hours: RestaurantHours, currentDayIndex: number) {
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = days[(currentDayIndex + offset) % 7];
    const nextHours = parseHours(hours[nextDay.key]);

    if (nextHours) {
      return {
        isOpen: false,
        message: `Closed · opens ${nextDay.label} at ${nextHours.openText}`,
      };
    }
  }

  // Handles schedules with no valid opening times.
  return {
    isOpen: false,
    message: "Opening status unavailable · check our hours below",
  };
}

// Calculates the real opening status using Boa Vista's current local time.
function getActualStatus(hours: RestaurantHours) {
  const { day, minutes } = getLocalTime();
  const todayIndex = days.findIndex((item) => item.key === day);

  if (todayIndex === -1) {
    return {
      isOpen: false,
      message: "Opening status unavailable · check our hours below",
    };
  }

  const today = days[todayIndex];
  const todayHours = parseHours(hours[today.key]);

  // Shows open status only before the closing time.
  if (todayHours && minutes >= todayHours.open && minutes < todayHours.close) {
    return {
      isOpen: true,
      message: `Open now · until ${todayHours.closeText}`,
    };
  }

  // If today's opening time is still ahead, show today's opening time.
  if (todayHours && minutes < todayHours.open) {
    return {
      isOpen: false,
      message: `Closed · opens today at ${todayHours.openText}`,
    };
  }

  // After closing, or on a closed day, find the next opening day.
  return getNextOpening(hours, todayIndex);
}

// Calculates the status for the requested demo scenario.
function getDemoStatus(
  hours: RestaurantHours,
  demoState: Exclude<DemoState, "actual">,
) {
  const tuesday = parseHours(hours.tuesday);

  // Simulates a closed Monday and shows Tuesday's opening time.
  if (demoState === "closed") {
    return {
      isOpen: false,
      message: tuesday
        ? `Closed · opens Tuesday at ${tuesday.openText}`
        : "Closed · next opening time unavailable",
    };
  }

  // Simulates Tuesday at 11:30 for the open and sold-out demos.
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

  // Explains the schedule when the simulated time falls outside opening hours.
  if (tuesday) {
    return {
      isOpen: false,
      message: `Closed · opens Tuesday at ${tuesday.openText}`,
    };
  }

  return {
    isOpen: false,
    message: "Opening status unavailable · check our hours below",
  };
}

// Displays the opening status in actual or demo mode.
export default function OpenStatus({ hours, demoState }: OpenStatusProps) {
  const status =
    demoState === "actual"
      ? getActualStatus(hours)
      : getDemoStatus(hours, demoState);

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
