import type { Metadata } from "next";
import { Manrope, Noto_Kufi_Arabic, Sora } from "next/font/google";
import "./globals.css";
import LanguageProvider from "@/components/shared/LanguageProvider";
import { JetBrains_Mono } from "next/font/google";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const arabic = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Almajrah — Enterprise Software, ERP, AI & Digital Engineering",
    template: "%s | Almajrah",
  },
  description:
    "ERP & Odoo engineering, Flutter apps, Next.js platforms, AI automation, cybersecurity and cloud engineering.",
};
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${manrope.variable} ${sora.variable} ${arabic.variable} ${jetbrainsMono.variable} overflow-x-hidden bg-surface font-sans text-ink antialiased rtl:font-arabic`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const l=localStorage.getItem('almajrah_lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl'}}catch(e){}`,
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
