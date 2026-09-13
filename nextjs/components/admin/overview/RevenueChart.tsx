"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/shared/LanguageProvider";
import {
  getQuotations,
  type Quotation,
} from "@/lib/api/quotations";

const MONTH_COUNT = 8;

function currencySymbol(currency: string) {
  if (currency === "SAR") return "\u20C1";
  if (currency === "USD") return "$";
  if (currency === "AED") return "د.إ";
  return currency;
}

function formatMoney(value: number, currency: string) {
  return `${currencySymbol(currency)} ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(value)}`;
}

export default function RevenueChart() {
  const { isArabic } = useLanguage();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("SAR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getQuotations();
        setQuotations(data);

        const firstAccepted = data.find(
          (quotation) => quotation.status === "accepted",
        );

        if (firstAccepted?.currency) {
          setSelectedCurrency(firstAccepted.currency);
        }
      } catch (error) {
        console.error("Quotation chart error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const accepted = useMemo(
    () =>
      quotations.filter(
        (quotation) => quotation.status === "accepted",
      ),
    [quotations],
  );

  const currencies = useMemo(() => {
    const values = Array.from(
      new Set(accepted.map((quotation) => quotation.currency)),
    );

    return values.length ? values.sort() : ["SAR"];
  }, [accepted]);

  useEffect(() => {
    if (!currencies.includes(selectedCurrency)) {
      setSelectedCurrency(currencies[0]);
    }
  }, [currencies, selectedCurrency]);

  const months = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let offset = MONTH_COUNT - 1; offset >= 0; offset--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1,
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const value = accepted
        .filter((quotation) => {
          if (quotation.currency !== selectedCurrency) return false;

          const created = new Date(quotation.createdAt);

          return (
            created.getFullYear() === year &&
            created.getMonth() === month
          );
        })
        .reduce(
          (total, quotation) => total + quotation.totalAmount,
          0,
        );

      result.push({
        key: `${year}-${month}`,
        label: new Intl.DateTimeFormat(
          isArabic ? "ar-SA" : "en-US",
          { month: "short" },
        ).format(date),
        value,
      });
    }

    return result;
  }, [accepted, selectedCurrency, isArabic]);

  const total = months.reduce(
    (sum, month) => sum + month.value,
    0,
  );

  const maxValue = Math.max(
    ...months.map((month) => month.value),
    1,
  );

  if (loading) {
    return (
      <div className="h-[385px] animate-pulse rounded-3xl border border-slate-200 bg-white" />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">
            {isArabic
              ? "قيمة عروض الأسعار المقبولة"
              : "Accepted quotation value"}
          </h3>

          <p className="mt-1 text-[10px] text-slate-400">
            {isArabic
              ? "آخر 8 أشهر حسب تاريخ إنشاء عرض السعر"
              : "Last 8 months by quotation creation date"}
          </p>
        </div>

        <select
          value={selectedCurrency}
          onChange={(event) =>
            setSelectedCurrency(event.target.value)
          }
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 outline-none"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <small className="text-[10px] text-slate-400">
          {isArabic ? "القيمة المقبولة" : "Accepted value"}
        </small>

        <strong className="block font-display text-2xl text-ink">
          {formatMoney(total, selectedCurrency)}
        </strong>
      </div>

      <div className="mt-7 flex h-52 items-end gap-3">
        {months.map((month) => {
          const height =
            month.value > 0
              ? Math.max(5, (month.value / maxValue) * 100)
              : 2;

          return (
            <div
              key={month.key}
              className="flex h-full flex-1 flex-col justify-end gap-2"
              title={formatMoney(month.value, selectedCurrency)}
            >
              <span
                className="w-full rounded-t-md bg-gradient-to-t from-blue to-teal transition-all"
                style={{ height: `${height}%` }}
              />

              <small className="text-center text-[9px] text-slate-400">
                {month.label}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}