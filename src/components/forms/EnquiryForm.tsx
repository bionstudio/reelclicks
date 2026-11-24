"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { BUDGET_RANGES, SERVICE_OPTIONS, enquirySchema, type Enquiry, type EnquiryInput } from "@/lib/validation/enquiry";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { RollingLabel } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };

function Field({
  id,
  label,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="label flex justify-between">
        <span className="text-paper">{label}</span>
        {optional && <span>Optional</span>}
      </label>
      {children}
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-2 min-h-[1.1rem] text-xs text-[#e08f78]">
        {error ?? ""}
      </p>
    </div>
  );
}

export function EnquiryForm({ services }: { services: { slug: string; title: string }[] }) {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef(Date.now());
  const statusRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput, unknown, Enquiry>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", date: "", location: "", budget: "", message: "", company: "" },
  });

  // Pre-select the service when arriving from a service page (?service=slug)
  useEffect(() => {
    const slug = params.get("service");
    if (!slug) return;
    const title = services.find((s) => s.slug === slug)?.title;
    const match = SERVICE_OPTIONS.find((o) => o === title);
    if (match) setValue("service", match);
  }, [params, services, setValue]);

  useEffect(() => {
    if (status.kind !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (data: Enquiry) => {
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string[]> };
      if (res.ok && json.ok) {
        setStatus({ kind: "success" });
        reset();
        return;
      }
      if (json.fields) {
        for (const [k, v] of Object.entries(json.fields)) {
          if (v?.[0]) setError(k as keyof EnquiryInput, { message: v[0] });
        }
      }
      setStatus({ kind: "error", message: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "You appear to be offline. Please check your connection or reach us on WhatsApp." });
    }
  };

  /** Hand the same details over to WhatsApp. */
  const whatsappFromForm = () => {
    const v = getValues();
    const lines = [
      "Hi REELCLICKS.IN 👋 I'd like to enquire about a shoot.",
      "",
      v.name && `Name: ${v.name}`,
      v.service && `Service: ${v.service}`,
      v.date && `Date: ${v.date}`,
      v.location && `Location: ${v.location}`,
      v.budget && `Budget: ${v.budget}`,
      v.message && `Details: ${v.message}`,
    ].filter(Boolean);
    return `https://wa.me/${site.people.founder.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const aria = (name: keyof EnquiryInput) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": `${name}-error`,
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status.kind === "success" ? (
          <motion.div
            key="success"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border border-line p-8 outline-none md:p-14"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-ink">
              <Check size={22} strokeWidth={1.75} />
            </span>
            <h3 className="display mt-8 text-[clamp(2.25rem,4vw,3.75rem)] leading-none">
              Thank you — <em>scene one</em> begins.
            </h3>
            <p className="mt-6 max-w-md text-mute">
              Your enquiry has reached our team. We&apos;ll get back to you soon. For anything urgent, WhatsApp us directly.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${site.people.founder.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-3 rounded-full bg-lime px-7 text-[0.95rem] font-bold text-ink hover:bg-paper"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  startedAt.current = Date.now();
                  setStatus({ kind: "idle" });
                }}
                className="inline-flex h-13 items-center rounded-full border border-line-strong px-7 text-[0.95rem] font-bold hover:border-lime"
              >
                Send another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-x-10 gap-y-6 sm:grid-cols-2"
            aria-describedby="form-note"
          >
            <Field id="name" label="Full name" error={errors.name?.message}>
              <input id="name" autoComplete="name" className="field" placeholder="Your name" {...register("name")} {...aria("name")} />
            </Field>
            <Field id="phone" label="Phone number" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="field"
                placeholder="10-digit mobile"
                {...register("phone")}
                {...aria("phone")}
              />
            </Field>
            <Field id="email" label="Email address" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field"
                placeholder="you@example.com"
                {...register("email")}
                {...aria("email")}
              />
            </Field>
            <Field id="service" label="Service required" error={errors.service?.message}>
              <select id="service" className="field" defaultValue="" {...register("service")} {...aria("service")}>
                <option value="" disabled>
                  Select a service
                </option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="date" label="Event / project date" error={errors.date?.message} optional>
              <input id="date" type="date" className="field" {...register("date")} {...aria("date")} />
            </Field>
            <Field id="location" label="Location" error={errors.location?.message}>
              <input
                id="location"
                autoComplete="address-level2"
                className="field"
                placeholder="City / venue"
                {...register("location")}
                {...aria("location")}
              />
            </Field>
            <Field id="budget" label="Budget range" error={errors.budget?.message} optional className="sm:col-span-2">
              <select id="budget" className="field" {...register("budget")} {...aria("budget")}>
                <option value="">Prefer not to say</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="message" label="Project details" error={errors.message?.message} className="sm:col-span-2">
              <textarea
                id="message"
                rows={5}
                className="field resize-y"
                placeholder="Tell us about the moment, the people and the feeling you want to keep…"
                {...register("message")}
                {...aria("message")}
              />
            </Field>

            {/* Honeypot — hidden from people, irresistible to bots */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            <AnimatePresence>
              {status.kind === "error" && (
                <motion.div
                  ref={statusRef}
                  tabIndex={-1}
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden outline-none sm:col-span-2"
                >
                  <div className="border-l-2 border-[#e08f78] bg-[#e08f78]/5 px-5 py-4 text-sm text-paper/90">
                    {status.message}{" "}
                    <a href={whatsappFromForm()} target="_blank" rel="noopener noreferrer" className="link-draw text-lime">
                      Send these details on WhatsApp →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn inline-flex h-14 items-center justify-center gap-3 rounded-full bg-lime px-9 text-[0.95rem] font-bold text-ink transition-colors hover:bg-paper disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <RollingLabel>Send enquiry</RollingLabel>
                    <ArrowUpRight size={17} strokeWidth={2.25} className="transition-transform duration-500 group-hover/btn:rotate-45" />
                  </>
                )}
              </button>
              <a
                href={whatsappFromForm()}
                onClick={(e) => {
                  // compute with the latest values at click time
                  e.currentTarget.href = whatsappFromForm();
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex items-center gap-2 text-paper hover:text-lime"
              >
                <WhatsAppIcon size={16} /> Prefer WhatsApp? Send these details
              </a>
            </div>
            <p id="form-note" className="label text-mute-2 sm:col-span-2">
              We only use your details to reply to this enquiry.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
