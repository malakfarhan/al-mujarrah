"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { messages } from "../i18n/messages";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import TechMarquee from "./components/TechMarquee";
import ClientStories from "./components/ClientStories";
import Partners from "./components/Partners";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <div className={theme === "dark" ? "site-shell dark" : "site-shell"}>
        <Header
          theme={theme}
          locale={locale}
          onLocaleChange={() => setLocale(locale === "ar" ? "en" : "ar")}
          onThemeChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <main>
          <Hero />
          <About />
          <Services />
          <ClientStories />
          <Partners />
          <Team />
          <TechMarquee />
          <Contact />
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
