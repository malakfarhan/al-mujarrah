import { techStack } from "@/lib/data";

export default function TechMarquee() {
  const items = [...techStack, ...techStack];
  return (
    <section className="overflow-hidden border-b border-line bg-white py-5" aria-label="Technology stack">
      <div className="flex w-max animate-marquee items-center gap-5 px-3 hover:[animation-play-state:paused]">
        {items.map(({ name, icon: Icon }, index) => (
          <div className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-600 shadow-sm" key={`${name}-${index}`}>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-teal-deep shadow-sm"><Icon size={17} /></span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
