"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowUpRight,
  Blocks,
  CheckCircle2,
  CloudCog,
  PanelsTopLeft,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import TypingText from "@/components/shared/TypingText";
import { useLanguage } from "@/components/shared/LanguageProvider";
import Container from "@/components/shared/Container";

const slides = [
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=2400&q=92",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=94",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=2400&q=94",
];

const nodeClass = "absolute z-[8] flex items-center gap-2 rounded-full border border-white/[.13] bg-[#050e1ca8] py-2 pe-3 ps-2 text-[10px] font-extrabold tracking-[.025em] text-[#dfeaf6] shadow-[0_14px_40px_rgba(0,0,0,.22)] backdrop-blur-xl animate-float";
const nodeIconClass = "grid h-7 w-7 place-items-center rounded-full border border-[#87f1dd1f] bg-gradient-to-br from-[#46e5ca3d] to-[#596fff38] text-[#8af2df] [&>svg]:h-3.5 [&>svg]:w-3.5";

export default function HeroSlider() {
  const { t, isArabic } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => setShowDescription(false), [isArabic]);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    event.currentTarget.style.setProperty("--copy-x", `${x * -0.14}px`);
    event.currentTarget.style.setProperty("--copy-y", `${y * -0.10}px`);
    event.currentTarget.style.setProperty("--visual-x", `${x * 0.38}px`);
    event.currentTarget.style.setProperty("--visual-y", `${y * 0.28}px`);
  };

  const resetParallax = () => {
    heroRef.current?.style.setProperty("--copy-x", "0px");
    heroRef.current?.style.setProperty("--copy-y", "0px");
    heroRef.current?.style.setProperty("--visual-x", "0px");
    heroRef.current?.style.setProperty("--visual-y", "0px");
  };

  return (
    <section
      ref={heroRef}
      data-slide={slideIndex}
      onPointerMove={onPointerMove}
      onPointerLeave={resetParallax}
      className="relative isolate flex h-[100svh] min-h-[720px] max-h-[980px] overflow-hidden bg-[#020710] text-white [--copy-x:0px] [--copy-y:0px] [--visual-x:0px] [--visual-y:0px] max-sm:min-h-[760px]"
    >
      {/* background slider */}
      <div className="absolute inset-0 z-0 bg-[#020710]" aria-hidden="true">
        {slides.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover mix-blend-screen brightness-[.68] saturate-[.92] contrast-[1.08] transition-[opacity,transform] duration-[1200ms] ${slideIndex === index ? "scale-100 opacity-[.52] [transition-duration:1200ms,7000ms]" : "scale-[1.06] opacity-0 [transition-duration:1200ms,7000ms]"}`}
            style={{ backgroundImage: `url('${image}')`, backgroundPosition: index === 0 ? "center" : "72% center" }}
          />
        ))}
        <div className={`absolute inset-0 ${slideIndex === 0 ? "bg-[radial-gradient(ellipse_at_72%_42%,rgba(75,94,255,.20),transparent_23%),radial-gradient(ellipse_at_62%_58%,rgba(20,214,195,.12),transparent_25%),radial-gradient(ellipse_at_30%_18%,rgba(152,86,255,.16),transparent_26%),linear-gradient(90deg,rgba(2,7,16,.98)_0%,rgba(2,7,16,.93)_38%,rgba(2,7,16,.50)_69%,rgba(2,7,16,.70)_100%)] rtl:bg-[radial-gradient(ellipse_at_28%_42%,rgba(75,94,255,.20),transparent_23%),radial-gradient(ellipse_at_38%_58%,rgba(20,214,195,.12),transparent_25%),radial-gradient(ellipse_at_70%_18%,rgba(152,86,255,.16),transparent_26%),linear-gradient(270deg,rgba(2,7,16,.98)_0%,rgba(2,7,16,.93)_38%,rgba(2,7,16,.50)_69%,rgba(2,7,16,.70)_100%)]" : "bg-[linear-gradient(90deg,rgba(2,7,16,.98)_0%,rgba(2,7,16,.90)_38%,rgba(2,7,16,.32)_68%,rgba(2,7,16,.28)_100%)] rtl:bg-[linear-gradient(270deg,rgba(2,7,16,.98)_0%,rgba(2,7,16,.90)_38%,rgba(2,7,16,.32)_68%,rgba(2,7,16,.28)_100%)]"}`} />
      </div>

      {/* cosmic ambient effects */}
      <div className="pointer-events-none absolute -inset-[18%] z-[1] animate-nebula bg-[radial-gradient(ellipse_at_74%_45%,rgba(64,91,255,.22),transparent_16%),radial-gradient(ellipse_at_64%_50%,rgba(44,217,191,.11),transparent_20%),radial-gradient(ellipse_at_24%_72%,rgba(121,74,255,.12),transparent_24%)] blur-[34px] motion-reduce:animate-none" />
      <div className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden transition-opacity duration-500 ${slideIndex === 0 ? "opacity-100" : "opacity-20"}`} aria-hidden="true">
        <div className="absolute inset-0 animate-stars bg-[radial-gradient(circle_at_12px_17px,rgba(255,255,255,.85)_0_1px,transparent_1.4px),radial-gradient(circle_at_84px_53px,rgba(146,205,255,.7)_0_1px,transparent_1.3px),radial-gradient(circle_at_154px_108px,rgba(255,255,255,.68)_0_.8px,transparent_1.2px),radial-gradient(circle_at_201px_187px,rgba(255,255,255,.55)_0_.7px,transparent_1.1px),radial-gradient(circle_at_41px_161px,rgba(104,255,226,.48)_0_.8px,transparent_1.2px)] [background-size:220px_220px] motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-stars-slow bg-[radial-gradient(circle_at_25px_64px,rgba(255,255,255,.9)_0_1.4px,transparent_2px),radial-gradient(circle_at_225px_31px,rgba(145,173,255,.75)_0_1.2px,transparent_1.8px),radial-gradient(circle_at_304px_254px,rgba(255,255,255,.7)_0_1px,transparent_1.6px)] opacity-40 [background-size:340px_340px] motion-reduce:animate-none" />
      </div>
      {slideIndex === 0 && <div className="pointer-events-none absolute right-[8%] top-[18%] z-[1] h-px w-[130px] animate-shoot bg-gradient-to-r from-transparent to-white/90 opacity-0 [filter:drop-shadow(0_0_6px_rgba(144,205,255,.9))] motion-reduce:hidden rtl:left-[8%] rtl:right-auto" />}
      <div className="pointer-events-none absolute inset-0 z-[1] origin-bottom opacity-[.07] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:linear-gradient(to_top,#000,transparent_76%)] [transform:perspective(900px)_rotateX(64deg)_translateY(34%)]" />

      <Container className="relative z-[2] grid h-full grid-cols-1 items-center gap-10 pt-[84px] lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        {/* copy */}
        <div className="relative z-10 max-w-[760px] transition-transform duration-200 [transform:translate3d(var(--copy-x),var(--copy-y),0)] max-lg:pt-10">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[.07] px-3.5 py-2.5 text-[11px] font-extrabold tracking-[.08em] text-[#dbe6ef] shadow-[inset_0_0_0_1px_rgba(107,244,223,.04),0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-xl rtl:tracking-normal">
            <span className="h-[7px] w-[7px] rounded-full bg-teal shadow-[0_0_0_5px_rgba(49,210,181,.12)]" /> {t("ERP · AI · APPS · CLOUD · SECURITY")}
          </div>

          {/* <h1 className="max-w-[800px] font-display text-[clamp(46px,5.15vw,76px)] font-semibold leading-[1] tracking-[-.052em] rtl:font-arabic rtl:tracking-[-.02em] max-sm:text-[43px]">
            {t("Build the systems")} {" "}
            <span className="bg-gradient-to-r from-white via-[#8cf3df] to-[#93a7ff] bg-clip-text text-transparent">
              <TypingText
                key={`hero-title-${isArabic ? "ar" : "en"}`}
                text={t("your business runs on.")}
                speed={55}
                onComplete={() => setShowDescription(true)}
              />
            </span>
          </h1>

          <div className="mt-5 min-h-[90px] max-w-[650px] md:min-h-[72px]">
            {showDescription && (
              <p className="text-[15px] font-medium leading-[1.75] text-[#b5c4d2] md:text-base xl:text-[17px]">
                <TypingText
                  key={`hero-description-${isArabic ? "ar" : "en"}`}
                  text={t("Almajrah engineers connected digital operations — from Odoo ERP and custom enterprise software to Flutter apps, Next.js platforms, AI automation and application security.")}
                  speed={18}
                />
              </p>
            )}
          </div> */}
          <h1 className="max-w-[800px] font-display text-[clamp(46px,5.15vw,76px)] font-semibold leading-[1] tracking-[-.052em] rtl:font-arabic rtl:tracking-[-.02em] max-sm:text-[43px]">
  {t("Build the systems")}{" "}

  <span className="bg-gradient-to-r from-white via-[#8cf3df] to-[#93a7ff] bg-clip-text text-transparent">
    <TypingText
      key={`hero-title-${isArabic ? "ar" : "en"}`}
      text={t("your business runs on.")}
      speed={55}
      onComplete={() => setShowDescription(true)}
    />
  </span>
</h1>

<div className="mt-5 min-h-[90px] max-w-[650px] md:min-h-[72px]">
  {showDescription && (
    <p className="font-mono text-[15px] font-medium leading-[1.75] text-[#b5c4d2] md:text-base xl:text-[17px]">
      <TypingText
        key={`hero-description-${isArabic ? "ar" : "en"}`}
        text={t(
          "Almajrah engineers connected digital operations — from Odoo ERP and custom enterprise software to Flutter apps, Next.js platforms, AI automation and application security."
        )}
        speed={18}
      />
    </p>
  )}
</div>

          <div className="mt-6 flex flex-wrap gap-3 max-sm:flex-col">
            <Link className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-[15px] text-sm font-extrabold text-[#052118] shadow-[0_10px_24px_rgba(49,210,181,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(49,210,181,.32)]" href="/contact">{t("Discuss your project")} <ArrowUpRight size={17}/></Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/[.14] bg-white/[.08] px-5 py-[15px] text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/[.13]" href="/services/erp-odoo"><PlayCircle size={17}/> {t("Explore our capabilities")}</Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-bold text-[#9badbe]">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal"/> {t("Enterprise architecture")}</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal"/> {t("End-to-end delivery")}</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal"/> {t("Long-term support")}</span>
          </div>
        </div>

        {/* visual */}
        <div className="relative min-h-[590px] transition-transform duration-200 [transform:translate3d(var(--visual-x),var(--visual-y),0)] max-lg:hidden" aria-hidden="true">
          {/* cosmic globe slide */}
          <div className={`absolute inset-0 grid place-items-center transition-all duration-700 ${slideIndex === 0 ? "visible scale-100 opacity-100" : "invisible translate-x-7 scale-[.975] opacity-0"}`}>
            <div className="relative grid aspect-square w-full max-w-[610px] place-items-center [filter:drop-shadow(0_35px_70px_rgba(0,0,0,.35))]">
              <div className="absolute h-[78%] w-[78%] animate-halo rounded-full bg-[radial-gradient(circle,rgba(74,112,255,.17)_0_24%,rgba(58,219,194,.08)_40%,transparent_68%)] blur-[9px] motion-reduce:animate-none" />
              <div className="absolute h-[74%] w-[74%] animate-orbit rounded-full border border-[#a9caff2e] motion-reduce:animate-none"><span className="absolute left-[25%] top-[8%] h-2 w-2 rounded-full bg-[#7ff1dd] shadow-[0_0_0_5px_rgba(127,241,221,.08),0_0_20px_rgba(127,241,221,.8)]" /></div>
              <div className="absolute h-[62%] w-[92%] animate-orbit-tilt rounded-full border border-[#5ce9d22e] motion-reduce:animate-none"><span className="absolute bottom-[4%] right-[28%] h-2 w-2 rounded-full bg-[#91a8ff] shadow-[0_0_20px_rgba(145,168,255,.8)]" /></div>
              <div className="absolute h-[94%] w-[58%] animate-orbit-tall rounded-full border border-[#ac7eff29] motion-reduce:animate-none"><span className="absolute right-[7%] top-[19%] h-2 w-2 rounded-full bg-[#b796ff] shadow-[0_0_20px_rgba(183,150,255,.8)]" /></div>

              <div className="relative z-[4] aspect-square w-[49%] animate-planet rounded-full motion-reduce:animate-none">
                <div className="absolute left-[-29%] right-[-29%] top-[42%] z-[3] h-[15%] rotate-[-15deg] rounded-[50%] border-[1.5px] border-[#7cd8eb70] bg-gradient-to-r from-transparent via-[#57d8c714] to-transparent opacity-40 [clip-path:inset(0_0_50%_0)]" />
                <div className="absolute inset-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_32%_30%,rgba(196,252,243,.94),transparent_7%),radial-gradient(ellipse_at_36%_35%,rgba(65,221,197,.78)_0_5%,transparent_13%),radial-gradient(ellipse_at_63%_38%,rgba(63,96,255,.72)_0_12%,transparent_24%),radial-gradient(ellipse_at_45%_64%,rgba(41,126,176,.86)_0_14%,transparent_25%),radial-gradient(circle_at_42%_42%,#153768_0_34%,#0d2344_58%,#061326_82%,#020710_100%)] shadow-[inset_-44px_-34px_68px_rgba(0,0,0,.72),inset_18px_16px_28px_rgba(128,249,229,.12),0_0_0_1px_rgba(169,230,255,.18),0_0_38px_rgba(72,114,255,.35),0_0_110px_rgba(27,204,182,.16)]" />
                <div className="absolute left-[-29%] right-[-29%] top-[42%] z-[5] h-[15%] rotate-[-15deg] rounded-[50%] border-[1.5px] border-[#7cd8eb70] bg-gradient-to-r from-transparent via-[#57d8c714] to-transparent [clip-path:inset(50%_0_0_0)]" />
              </div>

              <div className={`${nodeClass} left-[1%] top-[23%]`}><span className={nodeIconClass}><Blocks/></span> Odoo ERP</div>
              <div className={`${nodeClass} right-[-1%] top-[17%] [animation-delay:-1.3s]`}><span className={nodeIconClass}><Sparkles/></span> {t("AI Automation")}</div>
              <div className={`${nodeClass} bottom-[24%] right-[-4%] [animation-delay:-2.1s]`}><span className={nodeIconClass}><Smartphone/></span> Flutter</div>
              <div className={`${nodeClass} bottom-[20%] left-0 [animation-delay:-3s]`}><span className={nodeIconClass}><ShieldCheck/></span> {t("Cybersecurity")}</div>
              <div className={`${nodeClass} bottom-[1%] left-[32%] [animation-delay:-3.7s]`}><span className={nodeIconClass}><PanelsTopLeft/></span> Next.js</div>
              <div className={`${nodeClass} left-[36%] top-[1%] [animation-delay:-.7s]`}><span className={nodeIconClass}><CloudCog/></span> Cloud</div>

              <div className="absolute bottom-[14%] left-1/2 z-10 min-w-[220px] -translate-x-1/2 rounded-2xl border border-white/[.13] bg-[#040d1bb8] px-3.5 py-3 shadow-[0_15px_45px_rgba(0,0,0,.28)] backdrop-blur-xl rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2">
                <div className="flex items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-[.12em] text-[#89a0b8] rtl:normal-case rtl:tracking-normal"><span>{t("Almajrah digital core")}</span><span className="flex items-center gap-1.5 text-[#7cebd7] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#58e2c7] before:shadow-[0_0_12px_#58e2c7]">{t("Online")}</span></div>
                <div className="mt-2 flex items-end justify-between"><strong className="font-display text-xl tracking-[-.04em] rtl:font-arabic rtl:tracking-normal">{t("One connected orbit.")}</strong><div className="flex h-3.5 items-end gap-0.5"><i className="h-1 w-[3px] rounded bg-[#62e0cb]"/><i className="h-[7px] w-[3px] rounded bg-[#62e0cb]"/><i className="h-[10px] w-[3px] rounded bg-[#62e0cb]"/><i className="h-3.5 w-[3px] rounded bg-[#62e0cb]"/></div></div>
              </div>
              <div className="absolute right-[2%] top-1/2 z-[7] origin-right rotate-90 text-[9px] font-bold uppercase tracking-[.19em] text-[#7890a8] rtl:left-[2%] rtl:right-auto rtl:-rotate-90 rtl:normal-case rtl:tracking-normal">{t("Enterprise systems · connected by design")}</div>
            </div>
          </div>

          {/* ERP media slide */}
          <MediaSlide active={slideIndex === 1} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=96" icon={<Blocks/>} tag={t("Enterprise software")} badge="ERP" kicker={t("CONNECTED OPERATIONS")} title={t("ERP that runs the operation.")} copy={t("Finance · Sales · Inventory · HR · Service")} />

          {/* mobile media slide */}
          <MediaSlide active={slideIndex === 2} image="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1800&q=96" icon={<Smartphone/>} tag={t("Digital products")} badge="APP" kicker={t("MOBILE EXPERIENCE")} title={t("Apps built around real workflows.")} copy={t("Flutter · iOS · Android · APIs · Portals")} />
        </div>
      </Container>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2" aria-label="Hero slides">
        {slides.map((_, index) => (
          <button key={index} type="button" className={`relative h-[3px] w-[34px] overflow-hidden rounded-full transition ${slideIndex === index ? "bg-white/20 after:absolute after:inset-y-0 after:left-0 after:w-full after:origin-left after:animate-progress after:bg-teal rtl:after:origin-right" : "bg-white/25"}`} aria-label={`Hero slide ${index + 1}`} onClick={() => setSlideIndex(index)} />
        ))}
      </div>
    </section>
  );
}

function MediaSlide({ active, image, icon, tag, badge, kicker, title, copy }: { active: boolean; image: string; icon: React.ReactNode; tag: string; badge: string; kicker: string; title: string; copy: string }) {
  return (
    <div className={`absolute inset-0 grid place-items-center transition-all duration-700 ${active ? "visible scale-100 opacity-100" : "invisible translate-x-7 scale-[.975] opacity-0"}`}>
      <div className="relative h-[500px] w-[96%] max-w-[565px] overflow-hidden rounded-[32px] border border-white/15 bg-ink shadow-[0_42px_100px_rgba(0,0,0,.44),0_0_0_1px_rgba(93,140,255,.06)] [transform:perspective(1200px)_rotateY(-4deg)_rotateX(1.2deg)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full scale-[1.025] object-cover brightness-[1.12] saturate-[1.08] contrast-[1.01] transition-transform duration-[7000ms]" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0309120a] via-transparent to-[#03091294]" />
        <div className="absolute left-[22px] right-[22px] top-[22px] z-[4] flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#050e1b7a] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-[#d9e7f1] backdrop-blur-xl rtl:normal-case rtl:tracking-normal [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-teal">{icon}{tag}</span>
          <b className="grid h-[43px] w-[43px] place-items-center rounded-[14px] border border-teal/20 bg-teal/[.12] text-[10px] tracking-[.08em] text-[#86ead8] backdrop-blur-xl">{badge}</b>
        </div>
        <div className="absolute bottom-7 left-7 right-7 z-[4]">
          <small className="block text-[9px] font-black tracking-[.15em] text-[#6ee2cf] rtl:tracking-normal">{kicker}</small>
          <strong className="mt-2 block max-w-[480px] font-display text-[clamp(26px,2.6vw,38px)] leading-[1.08] tracking-[-.04em] text-white rtl:font-arabic rtl:tracking-normal">{title}</strong>
          <span className="mt-3 block text-[11px] font-bold tracking-[.02em] text-[#d6e2eb] [text-shadow:0_2px_12px_rgba(0,0,0,.6)] rtl:tracking-normal">{copy}</span>
        </div>
      </div>
    </div>
  );
}
