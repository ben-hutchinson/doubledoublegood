'use client';

import { useState } from 'react';

import { integrationSettings } from '@/lib/site-content';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setState('error');
      setFeedback('Please complete your name, email address, and message.');
      return;
    }

    const endpoint = integrationSettings.contactFormEndpoint.trim();
    const formData = new FormData(formElement);
    const honeypot = String(formData.get('company') ?? '').trim();

    if (honeypot) {
      setState('success');
      setFeedback("Thanks, we'll get back to you soon.");
      setValues(initialValues);
      return;
    }

    if (!endpoint) {
      setState('error');
      setFeedback(
        'Contact form is temporarily unavailable right now. Please call or email the shop directly.',
      );
      return;
    }

    setIsSubmitting(true);
    setState('idle');
    setFeedback('');

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || '',
        message: values.message.trim(),
        _subject: 'Website contact form enquiry',
        _replyto: values.email.trim(),
        source: 'website-contact-form',
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ errors: [] as Array<{ message?: string }> }));
        const providerMessage = errorBody.errors?.[0]?.message;
        throw new Error(
          providerMessage ||
            'Something went wrong sending your message. Please call or email the shop directly.',
        );
      }

      setState('success');
      setFeedback("Thanks, we'll get back to you soon.");
      setValues(initialValues);
      formElement.reset();
    } catch (error) {
      setState('error');
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Something went wrong sending your message. Please call or email the shop directly.',
      );
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
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
