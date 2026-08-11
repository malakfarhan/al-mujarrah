import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { messages } from "../i18n/messages";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = {
  title: "Al-Mujrraha IT Solutions",
  description:
    "Modern IT & Software Solutions landing page with bilingual support.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" className={`${cairo.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        <NextIntlClientProvider locale="ar" messages={messages.ar}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
