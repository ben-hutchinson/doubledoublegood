'use client';

import { useEffect, useMemo, useState } from 'react';

import { businessDetails } from '@/lib/site-content';

type OpenStatusBadgeProps = {
  tone?: 'light' | 'dark';
  className?: string;
};

type DailyHours = {
  isClosed: boolean;
  openMinutes: number | null;
  closeMinutes: number | null;
  rangeText: string;
};

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

function parseWeeklyHours(lines: string[]) {
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

function getLondonDateParts() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
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

function getStatusMessage(schedule: Map<string, DailyHours>) {
  const now = getLondonDateParts();
  const todayHours = schedule.get(now.weekday);

  if (!todayHours || todayHours.isClosed) {
    return 'Closed today';
  }

  if (
    todayHours.openMinutes === null ||
    todayHours.closeMinutes === null ||
    now.minutesNow < todayHours.openMinutes ||
    now.minutesNow >= todayHours.closeMinutes
  ) {
    return `Open today · ${todayHours.rangeText}`;
  }

  return `Open now · closes ${String(
    Math.floor(todayHours.closeMinutes / 60),
  ).padStart(2, '0')}:${String(todayHours.closeMinutes % 60).padStart(2, '0')}`;
}

function getDefaultMessage(schedule: Map<string, DailyHours>) {
  const today = getLondonDateParts().weekday;
  const todayHours = schedule.get(today);

  if (!todayHours) {
    return 'Today';
  }

  if (todayHours.isClosed) {
    return 'Closed today';
  }

  return `Open today · ${todayHours.rangeText}`;
}

export function OpenStatusBadge({
  tone = 'light',
  className = '',
}: OpenStatusBadgeProps) {
  const schedule = useMemo(
    () => parseWeeklyHours(businessDetails.weeklyOpeningHours),
    [],
  );
  const [message, setMessage] = useState(() => getDefaultMessage(schedule));

  useEffect(() => {
    const updateMessage = () => {
      setMessage(getStatusMessage(schedule));
    };

    updateMessage();

    const interval = window.setInterval(updateMessage, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [schedule]);

  const baseClassName =
    tone === 'dark'
      ? 'border-stone-600/75 bg-stone-900 text-stone-100'
      : 'border-stone-900/15 bg-white/80 text-stone-800';

  const dotClassName =
    message.startsWith('Open') ? 'bg-emerald-500' : 'bg-stone-500';

  return (
    <p
      className={`${baseClassName} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.1em] uppercase ${className}`.trim()}
    >
      <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
      {message}
    </p>
  );
}
