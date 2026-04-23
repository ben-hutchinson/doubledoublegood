'use client';

import { useRef, useState } from 'react';

import { getTrustedExternalUrl, trustedHostnames } from '@/lib/security';
import { integrationSettings } from '@/lib/site-content';

type FormState = 'idle' | 'success' | 'error';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validationOrder: Array<keyof FormValues> = ['name', 'email', 'message'];

function validateFields(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  const normalizedEmail = values.email.trim();

  if (!normalizedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please enter your message.';
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [state, setState] = useState<FormState>('idle');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nameFieldRef = useRef<HTMLInputElement>(null);
  const emailFieldRef = useRef<HTMLInputElement>(null);
  const messageFieldRef = useRef<HTMLTextAreaElement>(null);

  function focusField(field: keyof FormValues) {
    if (field === 'name') {
      nameFieldRef.current?.focus();
      return;
    }

    if (field === 'email') {
      emailFieldRef.current?.focus();
      return;
    }

    if (field === 'message') {
      messageFieldRef.current?.focus();
    }
  }

  function updateField<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      return { ...current, [key]: undefined };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validationErrors = validateFields(values);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setState('error');
      setFeedback('Please fix the highlighted fields before sending.');

      const firstInvalidField = validationOrder.find((field) =>
        Boolean(validationErrors[field]),
      );

      if (firstInvalidField) {
        focusField(firstInvalidField);
      }

      return;
    }

    const endpoint = integrationSettings.contactFormEndpoint.trim();
    const trustedEndpoint = getTrustedExternalUrl(endpoint, {
      allowedHostnames: trustedHostnames.contactFormEndpoint,
    });
    const formData = new FormData(formElement);
    const honeypot = String(formData.get('company') ?? '').trim();

    if (honeypot) {
      setState('success');
      setFeedback("Thanks, we'll get back to you soon.");
      setValues(initialValues);
      setFieldErrors({});
      return;
    }

    if (!trustedEndpoint) {
      setState('error');
      setFeedback(
        'Contact form is temporarily unavailable right now. Please call or email the shop directly.',
      );
      return;
    }

    setIsSubmitting(true);
    setState('idle');
    setFeedback('');
    setFieldErrors({});

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

      const response = await fetch(trustedEndpoint, {
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
    <form
      aria-describedby={feedback ? 'contact-form-feedback' : undefined}
      className="section-card space-y-5"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-name"
          >
            Name
          </label>
          <input
            aria-describedby={
              fieldErrors.name ? 'contact-name-error' : undefined
            }
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            className="min-h-12 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 text-base text-stone-900"
            id="contact-name"
            name="name"
            onChange={(event) => updateField('name', event.target.value)}
            ref={nameFieldRef}
            required
            type="text"
            value={values.name}
          />
          {fieldErrors.name ? (
            <p className="text-sm text-red-700" id="contact-name-error">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-stone-700"
            htmlFor="contact-email"
          >
            Email
          </label>
          <input
            aria-describedby={
              fieldErrors.email ? 'contact-email-error' : undefined
            }
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            className="min-h-12 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 text-base text-stone-900"
            id="contact-email"
            name="email"
            onChange={(event) => updateField('email', event.target.value)}
            ref={emailFieldRef}
            required
            type="email"
            value={values.email}
          />
          {fieldErrors.email ? (
            <p className="text-sm text-red-700" id="contact-email-error">
              {fieldErrors.email}
            </p>
          ) : null}
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
            aria-describedby={
              fieldErrors.message ? 'contact-message-error' : undefined
            }
            aria-invalid={Boolean(fieldErrors.message)}
            className="min-h-40 w-full rounded-2xl border border-stone-900/70 bg-stone-50 px-4 py-3 text-base text-stone-900"
            id="contact-message"
            name="message"
            onChange={(event) => updateField('message', event.target.value)}
            ref={messageFieldRef}
            required
            value={values.message}
          />
          {fieldErrors.message ? (
            <p className="text-sm text-red-700" id="contact-message-error">
              {fieldErrors.message}
            </p>
          ) : null}
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
            aria-atomic="true"
            aria-live="polite"
            className={`max-w-md text-sm leading-6 ${
              state === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
            id="contact-form-feedback"
            role={state === 'error' ? 'alert' : undefined}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
