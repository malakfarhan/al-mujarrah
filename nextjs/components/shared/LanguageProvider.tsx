"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AR_ATTRS, AR_TRANSLATIONS } from "@/lib/i18n-data";

type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  isArabic: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Only store DOM text that this provider actually translates.
const originalText = new WeakMap<Text, string>();
const originalAttrs = new WeakMap<Element, Record<string, string>>();

function translateDom(language: Language) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.body.dataset.language = language;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );

  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  nodes.forEach((node) => {
    const parent = node.parentElement;

    if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) {
      return;
    }

    const current = node.nodeValue ?? "";
    const currentKey = current.trim();

    if (!currentKey) return;

    // Arabic mode: translate only English text known by our dictionary.
    if (language === "ar") {
      if (originalText.has(node)) {
        const original = originalText.get(node) ?? "";
        const key = original.trim();
        const replacement = AR_TRANSLATIONS[key];

        if (replacement) {
          node.nodeValue = original.replace(key, replacement);
        }

        return;
      }

      const replacement = AR_TRANSLATIONS[currentKey];

      if (replacement) {
        originalText.set(node, current);
        node.nodeValue = current.replace(currentKey, replacement);
      }

      return;
    }

    // English mode: restore only text that this DOM translator changed.
    if (originalText.has(node)) {
      node.nodeValue = originalText.get(node) ?? current;
    }
  });

  document
    .querySelectorAll("[placeholder],[aria-label],[title]")
    .forEach((element) => {
      const attrs = ["placeholder", "aria-label", "title"];

      if (language === "ar") {
        let stash = originalAttrs.get(element);

        attrs.forEach((attr) => {
          if (stash?.[attr]) {
            const original = stash[attr];
            const translated =
              AR_ATTRS[original] ||
              AR_TRANSLATIONS[original] ||
              original;

            element.setAttribute(attr, translated);
            return;
          }

          const current = element.getAttribute(attr);

          if (!current) return;

          const translated =
            AR_ATTRS[current] ||
            AR_TRANSLATIONS[current];

          // Store only attributes that this provider actually translates.
          if (translated) {
            if (!stash) {
              stash = {};
              originalAttrs.set(element, stash);
            }

            stash[attr] = current;
            element.setAttribute(attr, translated);
          }
        });

        return;
      }

      // Restore only attributes previously changed by this provider.
      const stash = originalAttrs.get(element);

      if (!stash) return;

      attrs.forEach((attr) => {
        const original = stash[attr];

        if (original !== undefined) {
          element.setAttribute(attr, original);
        }
      });
    });
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>("en");

  // Load saved language once.
  useEffect(() => {
    const saved = window.localStorage.getItem("almajrah_lang");
    setLanguageState(saved === "ar" ? "ar" : "en");
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("almajrah_lang", next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next = current === "ar" ? "en" : "ar";
      window.localStorage.setItem("almajrah_lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (value: string) => {
      if (language === "ar") {
        return AR_TRANSLATIONS[value] || value;
      }

      return value;
    },
    [language],
  );

  // Translate static DOM content after React finishes rendering.
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      translateDom(language);
    });

    const timeout = window.setTimeout(() => {
      translateDom(language);
    }, 80);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [language, pathname]);

  const value = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return value;
}