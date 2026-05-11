'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  getOpenStatusMessage,
  parseWeeklyOpeningHours,
} from '@/lib/open-status';
import { businessDetails } from '@/lib/site-content';

type OpenStatusBadgeProps = {
  tone?: 'light' | 'dark';
  className?: string;
  messageOverride?: string;
};

export function OpenStatusBadge({
  tone = 'light',
  className = '',
  messageOverride,
}: OpenStatusBadgeProps) {
  const schedule = useMemo(
    () => parseWeeklyOpeningHours(businessDetails.weeklyOpeningHours),
    [],
  );
  const [scheduleMessage, setScheduleMessage] = useState(() =>
    getOpenStatusMessage(schedule),
  );

  useEffect(() => {
    if (messageOverride) {
      return;
    }

    const updateMessage = () => {
      setScheduleMessage(getOpenStatusMessage(schedule));
    };

    updateMessage();

    const interval = window.setInterval(updateMessage, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [messageOverride, schedule]);

  const message = messageOverride ?? scheduleMessage;

  const baseClassName =
    tone === 'dark'
      ? 'border-stone-600/75 bg-stone-900 text-stone-100'
      : 'border-stone-900/15 bg-white/80 text-stone-800';

  const dotClassName = message.startsWith('Open')
    ? 'bg-emerald-500'
    : 'bg-stone-500';

  return (
    <p
      className={`${baseClassName} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.1em] uppercase ${className}`.trim()}
    >
      <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
      {message}
    </p>
  );
}
