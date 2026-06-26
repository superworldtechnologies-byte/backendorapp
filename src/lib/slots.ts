type DayAvailability = {
  active?: boolean;
  enabled?: boolean;
  start?: string | null;
  end?: string | null;
};

type AvailabilityMap = {
  mon?: DayAvailability;
  tue?: DayAvailability;
  wed?: DayAvailability;
  thu?: DayAvailability;
  fri?: DayAvailability;
  sat?: DayAvailability;
  sun?: DayAvailability;
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
  sunday?: DayAvailability;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad(h)}:${pad(m)}`;
}

function getDayKeys(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay();

  const shortMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const longMap = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;

  return {
    short: shortMap[day],
    long: longMap[day],
  };
}

function isPastSlot(dateString: string, time: string) {
  const now = new Date();
  const slot = new Date(`${dateString}T${time}:00`);
  return slot.getTime() <= now.getTime();
}

export function generateAvailableSlots({
  date,
  availability,
  durationMinutes,
  existingBookings,
}: {
  date: string;
  availability: AvailabilityMap;
  durationMinutes: number;
  existingBookings: { startTime: string; endTime?: string }[];
}) {
  const { short, long } = getDayKeys(date);
  const dayAvailability = availability?.[short] || availability?.[long];

  const isEnabled = !!(dayAvailability?.active ?? dayAvailability?.enabled);

  if (!isEnabled || !dayAvailability?.start || !dayAvailability?.end) {
    return [];
  }

  const startMinutes = toMinutes(dayAvailability.start);
  const endMinutes = toMinutes(dayAvailability.end);
  const slots: string[] = [];

  for (let current = startMinutes; current + durationMinutes <= endMinutes; current += 15) {
    const slotStart = toTimeString(current);
    const slotEnd = toTimeString(current + durationMinutes);

    const overlaps = existingBookings.some((booking) => {
      const bookingStart = toMinutes(booking.startTime);
      const bookingEnd = toMinutes(booking.endTime || booking.startTime);
      return current < bookingEnd && current + durationMinutes > bookingStart;
    });

    if (overlaps) continue;
    if (isPastSlot(date, slotStart)) continue;

    slots.push(slotStart);
  }

  return slots;
}

export function calculateEndTime(startTime: string, durationMinutes: number) {
  return toTimeString(toMinutes(startTime) + durationMinutes);
}