"use client";

import { useState } from "react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";
import { industries } from "@/lib/data";

const basePositions = [
  "lg:-rotate-[8deg] lg:translate-y-7",
  "lg:-rotate-[5deg] lg:translate-y-2",
  "lg:-rotate-[2deg] lg:translate-y-6",
  "lg:rotate-[2deg] lg:translate-y-2",
  "lg:rotate-[5deg] lg:translate-y-6",
  "lg:rotate-[8deg] lg:translate-y-3",
];

export default function IndustriesDeck() {
  const [hovered, setHovered] = useState<number | null>(null);

  const getPosition = (index: number) => {
    if (hovered === null) return basePositions[index] ?? "";

    if (index === hovered) {
      return "lg:!translate-x-0 lg:!-translate-y-7 lg:!rotate-0 lg:!scale-[1.05] xl:!-translate-y-9 xl:!scale-[1.07] 2xl:!-translate-y-10 2xl:!scale-[1.08] lg:!z-50";
    }

    if (index < hovered) {
      const distance = hovered - index;

      return distance === 1
        ? "lg:-translate-x-6 lg:translate-y-3 lg:-rotate-[7deg] lg:scale-[0.97] xl:-translate-x-10 2xl:-translate-x-16"
        : "lg:-translate-x-9 lg:translate-y-5 lg:-rotate-[10deg] lg:scale-[0.94] xl:-translate-x-14 2xl:-translate-x-24";
    }

    const distance = index - hovered;

    return distance === 1
      ? "lg:translate-x-6 lg:translate-y-3 lg:rotate-[7deg] lg:scale-[0.97] xl:translate-x-10 2xl:translate-x-16"
      : "lg:translate-x-9 lg:translate-y-5 lg:rotate-[10deg] lg:scale-[0.94] xl:translate-x-14 2xl:translate-x-24";
  };

  return (
    <section className="overflow-hidden bg-[#eff3f7] py-20 md:py-[118px]">
      <Container>
        <Reveal>
          <div className="max-w-[820px]">
            <SectionHeading
              kicker="Industry-focused delivery"
              title="Software that understands the operation behind the screen."
            />
          </div>
        </Reveal>
      </Container>

      <div className="relative mt-12 w-full lg:mt-14 lg:min-h-[410px] xl:min-h-[430px] 2xl:min-h-[450px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(49,210,181,0.10),rgba(93,140,255,0.05)_38%,transparent_70%)] blur-3xl"
        />

        <div className="flex snap-x snap-mandatory items-center justify-start gap-4 overflow-x-auto px-5 pb-10 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center lg:gap-0 lg:overflow-visible lg:px-10 lg:pb-0 lg:pt-8 xl:px-16 2xl:px-20">
          {industries.map(({ title, copy, icon: Icon }, index) => (
            <div
              key={title}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className={`relative shrink-0 snap-start transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:-ml-[68px] lg:first:ml-0 xl:-ml-[64px] 2xl:-ml-[54px] ${getPosition(index)}`}
              style={{ zIndex: hovered === index ? 50 : industries.length - index }}
            >
              <article
                className={`group relative flex min-h-[305px] w-[285px] flex-col overflow-hidden rounded-[28px] border bg-[#101214] p-6 text-white transition-all duration-500 lg:w-[220px] xl:min-h-[320px] xl:w-[245px] 2xl:min-h-[335px] 2xl:w-[300px] ${
                  hovered === index
                    ? "border-[#31d2b5]/50 shadow-[0_45px_100px_rgba(7,17,31,0.40)]"
                    : "border-white/[0.10] shadow-[0_25px_60px_rgba(7,17,31,0.16)]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:34px_34px] transition-opacity duration-500 group-hover:opacity-[0.30]"
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-24 -top-24 h-[250px] w-[250px] rounded-full blur-[70px] transition-all duration-500 ${
                    hovered === index ? "bg-[#31d2b5]/20" : "bg-[#31d2b5]/0"
                  }`}
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-24 -left-24 h-[230px] w-[230px] rounded-full blur-[80px] transition-all duration-500 ${
                    hovered === index ? "bg-[#5d8cff]/15" : "bg-transparent"
                  }`}
                />

                <div className="relative z-10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-[#6ee2cf] backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:border-[#31d2b5]/25 group-hover:bg-[#31d2b5]/10 xl:h-14 xl:w-14">
                    <Icon size={23} />
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-10 xl:pt-14 2xl:pt-16">
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6ee2cf] rtl:normal-case rtl:tracking-normal">
                    Industry
                  </span>

                  <h3 className="mt-3 font-display text-[20px] font-semibold leading-[1.1] tracking-[-0.04em] rtl:font-arabic rtl:tracking-normal xl:text-[22px] 2xl:text-[25px]">
                    {title}
                  </h3>

                  <p
                    className={`mt-3 text-[11px] leading-5 transition-colors duration-500 xl:text-[12px] xl:leading-6 2xl:text-[13px] ${
                      hovered === index ? "text-[#c2cfda]" : "text-[#899caf]"
                    }`}
                  >
                    {copy}
                  </p>
                </div>

                <div
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#31d2b5] to-transparent transition-all duration-500 ${
                    hovered === index ? "w-[70%] opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}