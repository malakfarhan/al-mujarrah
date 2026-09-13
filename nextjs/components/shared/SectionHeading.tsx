export default function SectionHeading({
  kicker,
  title,
  copy,
  light = false,
}: {
  kicker: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-12 max-w-[850px]">
      <span className={`inline-flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.15em] before:h-px before:w-6 before:bg-current rtl:normal-case rtl:tracking-normal ${light ? "text-[#6ee2cf]" : "text-teal-deep"}`}>
        {kicker}
      </span>
      <h2 className={`mt-3.5 font-display text-[clamp(38px,4.3vw,64px)] font-semibold leading-[1.04] tracking-[-0.04em] rtl:font-arabic rtl:tracking-[-0.02em] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {copy && <p className={`mt-4 max-w-[680px] text-[17px] leading-7 ${light ? "text-[#9eb0c3]" : "text-muted"}`}>{copy}</p>}
    </div>
  );
}
