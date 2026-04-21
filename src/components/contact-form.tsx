'use client';

import { useState } from 'react';

import { businessDetails } from '@/lib/site-content';

type FormState = 'idle' | 'success' | 'error';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [state, setState] = useState<FormState>('idle');
  const [feedback, setFeedback] = useState('');

  function updateField<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setState('error');
      setFeedback('Please complete your name, email address, and message.');
      return;
    }

    const subject = encodeURIComponent('Website contact form enquiry');
    const body = encodeURIComponent(
      [
        `Name: ${values.name.trim()}`,
        `Email: ${values.email.trim()}`,
        `Phone: ${values.phone.trim() || 'Not provided'}`,
        '',
        'Message:',
        values.message.trim(),
      ].join('\n'),
    );

    window.location.href = `${businessDetails.emailHref}?subject=${subject}&body=${body}`;

    setState('success');
    setFeedback('Opening your email app with your message prefilled.');
    setValues(initialValues);
  }

  return (
    <form className="section-card space-y-5" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-name"
          >
            Name
          </label>
          <input
            autoComplete="name"
            className="min-h-12 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 text-base text-stone-900"
            id="contact-name"
            name="name"
            onChange={(event) => updateField('name', event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="min-h-12 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 text-base text-stone-900"
            id="contact-email"
            name="email"
            onChange={(event) => updateField('email', event.target.value)}
            required
            type="email"
            value={values.email}
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-phone"
          >
            Phone (optional)
          </label>
          <input
            autoComplete="tel"
            className="min-h-12 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 text-base text-stone-900"
            id="contact-phone"
            name="phone"
            onChange={(event) => updateField('phone', event.target.value)}
            type="tel"
            value={values.phone}
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-message"
          >
            Message
          </label>
          <textarea
            className="min-h-40 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 py-3 text-base text-stone-900"
            id="contact-message"
            name="message"
            onChange={(event) => updateField('message', event.target.value)}
            required
            value={values.message}
          />
        </div>
      </div>
      <input
        autoComplete="off"
        className="hidden"
        name="company"
        tabIndex={-1}
        type="text"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="heading-section pressable inline-flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-6 text-sm font-bold text-stone-50 uppercase hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
        >
          Send Message
        </button>
        {feedback ? (
          <p
            aria-live="polite"
            className={`max-w-md text-sm leading-6 ${
              state === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
