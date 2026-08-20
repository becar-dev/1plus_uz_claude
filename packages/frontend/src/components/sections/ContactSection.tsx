'use client';

import { useState, type FormEvent } from 'react';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Mail, Send, ArrowUpRight } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required';
  }
  return errors;
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/1plus.uz' },
  { label: 'Telegram', href: 'https://t.me/oneplus_uz' },
  { label: 'Behance', href: 'https://behance.net/1plus' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/1plus-uz' },
];

/**
 * Contact section with email info, social links, and a simple contact form.
 * Clean editorial layout.
 */
export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { ref: infoRef, style: infoStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'slide-left',
  });
  const { ref: formRef, style: formStyle } = useRevealAnimation<HTMLDivElement>({
    variant: 'slide-right',
    delay: 150,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Placeholder API endpoint
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      // Silently handle errors for now
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 lg:py-40 bg-[var(--bg-tertiary)]"
      aria-labelledby="contact-heading"
    >
      <Container size="xl">
        <SectionHeading
          overline="Get in Touch"
          heading="Let's Talk"
          subheading="Have a project in mind? We'd love to hear from you."
          id="contact-heading"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div ref={infoRef} style={infoStyle}>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                  Email us
                </span>
              </div>
              <a
                href="mailto:hello@1plus.uz"
                className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
              >
                hello@1plus.uz
              </a>
            </div>

            <div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md">
                Whether you have a question, a project idea, or just want to say hello, we are
                always open to new conversations and collaborations.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-[var(--border-primary)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-200"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div ref={formRef} style={formStyle}>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-primary)]">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)] bg-opacity-10 flex items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Thank you for reaching out. We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                    className={`
                      w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border
                      text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent
                      transition-all duration-200
                      ${errors.name ? 'border-red-500' : 'border-[var(--border-primary)]'}
                    `}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`
                      w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border
                      text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent
                      transition-all duration-200
                      ${errors.email ? 'border-red-500' : 'border-[var(--border-primary)]'}
                    `}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us about your project..."
                    rows={5}
                    className={`
                      w-full px-4 py-3 rounded-xl bg-[var(--surface-card)] border resize-none
                      text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent
                      transition-all duration-200
                      ${errors.message ? 'border-red-500' : 'border-[var(--border-primary)]'}
                    `}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
