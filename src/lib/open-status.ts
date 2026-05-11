export type DailyHours = {
  isClosed: boolean;
  openMinutes: number | null;
  closeMinutes: number | null;
  rangeText: string;
};

export type OpenStatusDateParts = {
  weekday: string;
  minutesNow: number;
};

const closedMessage = 'Shop closed';

function parseTimeToMinutes(value: string) {
  const [hourText, minuteText] = value.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

export function parseWeeklyOpeningHours(lines: string[]) {
  const parsed = new Map<string, DailyHours>();

  for (const line of lines) {
    const parts = line.split(' - ').map((part) => part.trim());
    const day = parts[0];

    if (!day) {
      continue;
    }

    if (parts.length === 2 && parts[1] === 'CLOSED') {
      parsed.set(day, {
        isClosed: true,
        openMinutes: null,
        closeMinutes: null,
        rangeText: 'Closed',
      });
      continue;
    }

    if (parts.length === 3) {
      const openMinutes = parseTimeToMinutes(parts[1]);
      const closeMinutes = parseTimeToMinutes(parts[2]);

      if (openMinutes !== null && closeMinutes !== null) {
        parsed.set(day, {
          isClosed: false,
          openMinutes,
          closeMinutes,
          rangeText: `${parts[1]} - ${parts[2]}`,
        });
      }
    }
  }

  return parsed;
}

export function getLondonDateParts(date = new Date()): OpenStatusDateParts {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(
    parts.find((part) => part.type === 'minute')?.value ?? '0',
  );

  return {
    weekday,
    minutesNow: hour * 60 + minute,
  };
}

export function getOpenStatusMessage(
  schedule: Map<string, DailyHours>,
  now = getLondonDateParts(),
) {
  const todayHours = schedule.get(now.weekday);

  if (
    !todayHours ||
    todayHours.isClosed ||
    todayHours.openMinutes === null ||
    todayHours.closeMinutes === null ||
    now.minutesNow < todayHours.openMinutes ||
    now.minutesNow >= todayHours.closeMinutes
  ) {
    return closedMessage;
  }

  return `Open now · closes ${String(
    Math.floor(todayHours.closeMinutes / 60),
  ).padStart(2, '0')}:${String(todayHours.closeMinutes % 60).padStart(2, '0')}`;
}
