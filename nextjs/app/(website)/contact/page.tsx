"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import Container from "@/components/shared/Container";
import { useLanguage } from "@/components/shared/LanguageProvider";
import { createLead } from "@/lib/api/leads";

const inputClass =
  "mt-2 w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-teal-deep focus:ring-4 focus:ring-teal/10";

export default function Contact() {
  const { isArabic } = useLanguage();

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSending(true);
    setSent(false);
    setError("");

    try {
      await createLead({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        company: String(formData.get("company") || ""),
        service: String(formData.get("service") || ""),
        budget: String(formData.get("budget") || ""),
        message: String(formData.get("message") || ""),
      });

      setSent(true);
      form.reset();
    } catch {
      setError(
        isArabic
          ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-[#06101d] pt-[78px]"
    >
      <section className="relative overflow-hidden py-16 text-white md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(49,210,181,.1),transparent_26%),radial-gradient(circle_at_88%_65%,rgba(93,140,255,.15),transparent_28%)]" />

        <Container className="relative z-10 grid items-start gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <div className="pt-4">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.15em] text-[#6ee2cf] before:h-px before:w-6 before:bg-current rtl:normal-case rtl:tracking-normal">
              {isArabic ? "تواصل مع المجرة" : "Contact Almajrah"}
            </span>

            <h1 className="mt-4 max-w-[680px] font-display text-[clamp(48px,6vw,78px)] font-semibold leading-[.98] tracking-[-.055em] rtl:font-arabic rtl:tracking-[-.02em]">
              {isArabic
                ? "شاركنا تحديات عملك المعقدة."
                : "Bring us the complex workflow."}
            </h1>

            <p className="mt-6 max-w-[650px] text-[17px] leading-8 text-[#aab9c8]">
              {isArabic
                ? "سواء كنت تحتاج إلى نظام ERP أو تطبيق جوال أو منصة ويب أو حلول ذكاء اصطناعي أو أمن سيبراني أو بنية سحابية، أخبرنا بما تريد تطويره."
                : "ERP implementation, mobile product, web platform, AI workflow, cybersecurity or cloud engineering — tell us what you are trying to improve."}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <ContactMethod
                icon={<Mail />}
                label={isArabic ? "البريد الإلكتروني" : "Email"}
                value="hello@almajrah.com"
              />

              <ContactMethod
                icon={<Phone />}
                label={isArabic ? "الهاتف" : "Phone"}
                value="+966 XX XXX XXXX"
              />

              <ContactMethod
                icon={<MapPin />}
                label={isArabic ? "الموقع" : "Location"}
                value={isArabic ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
              />

              <ContactMethod
                icon={<MessageCircle />}
                label={isArabic ? "وقت الرد" : "Response"}
                value={isArabic ? "خلال يوم عمل واحد" : "Within one business day"}
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/10 bg-white p-6 text-ink shadow-[0_35px_90px_rgba(0,0,0,.25)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "الاسم" : "Name"}
                <input
                  name="name"
                  className={inputClass}
                  required
                  placeholder={isArabic ? "اسمك" : "Your name"}
                />
              </label>

              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "الشركة" : "Company"}
                <input
                  name="company"
                  className={inputClass}
                  placeholder={isArabic ? "اسم الشركة" : "Company name"}
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "البريد الإلكتروني" : "Email"}
                <input
                  name="email"
                  className={`${inputClass} rtl:text-left`}
                  required
                  type="email"
                  placeholder="you@company.com"
                />
              </label>

              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "الهاتف" : "Phone"}
                <input
                  name="phone"
                  className={`${inputClass} rtl:text-left`}
                  placeholder="+966 ..."
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "الخدمة" : "Service"}

                {/* Values remain consistent in the database, labels change by language */}
                <select name="service" className={inputClass} defaultValue="">
                  <option value="" disabled>
                    {isArabic ? "اختر الخدمة" : "Select a service"}
                  </option>

                  <option value="ERP & Odoo Engineering">
                    {isArabic ? "هندسة أنظمة ERP و Odoo" : "ERP & Odoo Engineering"}
                  </option>

                  <option value="Mobile Development">
                    {isArabic ? "تطوير تطبيقات الجوال" : "Mobile Development"}
                  </option>

                  <option value="Web Development">
                    {isArabic ? "تطوير الويب" : "Web Development"}
                  </option>

                  <option value="AI & Automation">
                    {isArabic ? "الذكاء الاصطناعي والأتمتة" : "AI & Automation"}
                  </option>

                  <option value="Cybersecurity">
                    {isArabic ? "الأمن السيبراني" : "Cybersecurity"}
                  </option>

                  <option value="Cloud & DevOps">
                    {isArabic ? "الحوسبة السحابية وDevOps" : "Cloud & DevOps"}
                  </option>
                </select>
              </label>

              <label className="text-xs font-extrabold text-[#43546a]">
                {isArabic ? "الميزانية المتوقعة" : "Estimated budget"}

                {/* Budget value is stored once while the visible label is bilingual */}
                <select name="budget" className={inputClass} defaultValue="">
                  <option value="">
                    {isArabic ? "حدد الميزانية" : "Select budget"}
                  </option>

                  <option value="Under SAR 10K">
                    {isArabic ? "أقل من 10,000 ر.س" : "Under SAR 10K"}
                  </option>

                  <option value="SAR 10K - 25K">
                    {isArabic ? "10,000 - 25,000 ر.س" : "SAR 10K - 25K"}
                  </option>

                  <option value="SAR 25K - 50K">
                    {isArabic ? "25,000 - 50,000 ر.س" : "SAR 25K - 50K"}
                  </option>

                  <option value="SAR 50K - 100K">
                    {isArabic ? "50,000 - 100,000 ر.س" : "SAR 50K - 100K"}
                  </option>

                  <option value="SAR 100K+">
                    {isArabic ? "أكثر من 100,000 ر.س" : "SAR 100K+"}
                  </option>

                  <option value="Not sure">
                    {isArabic ? "غير محدد حالياً" : "Not sure yet"}
                  </option>
                </select>
              </label>
            </div>

            <label className="mt-4 block text-xs font-extrabold text-[#43546a]">
              {isArabic ? "تفاصيل المشروع" : "Project details"}

              <textarea
                name="message"
                className={`${inputClass} min-h-[150px] resize-y`}
                required
                rows={6}
                placeholder={
                  isArabic
                    ? "اشرح المشروع أو التحدي أو سير العمل الذي تريد تطويره..."
                    : "Describe the project, challenge or workflow..."
                }
              />
            </label>

            <button
              type="submit"
              disabled={sending}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-4 text-sm font-extrabold text-[#052118] shadow-[0_10px_24px_rgba(49,210,181,.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending
                ? isArabic
                  ? "جارٍ الإرسال..."
                  : "Sending..."
                : isArabic
                  ? "إرسال تفاصيل المشروع"
                  : "Send project brief"}

              {!sending && <Send size={16} />}
            </button>

            {sent && (
              <div className="mt-4 rounded-xl border border-teal/20 bg-[#e9f9f5] px-4 py-3 text-sm font-bold text-teal-deep">
                {isArabic
                  ? "شكراً لك — تم إرسال تفاصيل مشروعك بنجاح."
                  : "Thanks — your project brief has been sent successfully."}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}
          </form>
        </Container>
      </section>
    </main>
  );
}

function ContactMethod({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-white/[.09] bg-white/[.04] p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </span>

      <span className="min-w-0 text-sm text-white">
        <small className="mb-1 block text-[9px] font-extrabold uppercase tracking-[.12em] text-[#6f879e] rtl:normal-case rtl:tracking-normal">
          {label}
        </small>

        {value}
      </span>
    </div>
  );
}