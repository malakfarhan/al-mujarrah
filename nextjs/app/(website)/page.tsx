import Link from "next/link";
import { ArrowRight, Code2, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import HeroSlider from "@/components/home/HeroSlider";
import TechMarquee from "@/components/home/TechMarquee";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTA from "@/components/shared/CTA";
import Container from "@/components/shared/Container";
import { portfolio, services } from "@/lib/data";
import IndustriesDeck from "@/components/home/IndustriesDeck";

export default function Home() {


  return (
    <main>
      <HeroSlider />
      <TechMarquee />

      <section className="bg-surface py-20 md:py-[118px]" id="process">
        <Container className="grid items-start gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32">
            <SectionHeading
              kicker="Connected operations"
              title="One technology partner from ERP core to customer experience."
              copy="We design the layers together so data, users, workflows and customer touchpoints work as one operating model."
            />
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-extrabold text-teal-deep transition hover:gap-3">Explore all services <ArrowRight size={15} className="rtl:rotate-180" /></Link>
          </Reveal>

          <div className="grid gap-5">
            {services.slice(0, 5).map((service, index) => {
              const Icon = service.icon;
              const dark = index === 1;
              return (
                <Reveal key={service.slug} delay={index * 80}>
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[30px] border p-7 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-soft md:min-h-[365px] md:p-8 ${dark ? "border-[#122944] bg-[#09172b] text-white" : "border-[#e5ebf2] bg-white text-ink"}`}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(49,210,181,.14),transparent_70%)] rtl:-left-20 rtl:right-auto" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-extrabold tracking-[.13em] ${dark ? "text-[#6ee2cf]" : "text-teal-deep"}`}>0{index + 1}</span>
                        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? "bg-white/[.07] text-[#6ee2cf]" : "bg-[#edf9f6] text-teal-deep"}`}><Icon size={22}/></span>
                      </div>
                      <h3 className="mt-8 max-w-[560px] font-display text-[clamp(28px,2.7vw,42px)] font-semibold leading-[1.08] tracking-[-.04em] rtl:font-arabic rtl:tracking-normal">{service.title}</h3>
                      <p className={`mt-4 max-w-[600px] text-[15px] leading-7 ${dark ? "text-[#9fb2c7]" : "text-muted"}`}>{service.short}</p>
                    </div>
                    <div className="relative z-10 mt-7 flex flex-wrap gap-2 pe-16">
                      {service.features.slice(0, 4).map((tag) => <span key={tag} className={`rounded-full px-3 py-2 text-[10px] font-extrabold ${dark ? "bg-white/[.07] text-[#bdcddd]" : "bg-slate-100 text-[#496076]"}`}>{tag}</span>)}
                    </div>
                    <span className={`absolute bottom-7 right-7 grid h-12 w-12 place-items-center rounded-full transition duration-300 group-hover:-rotate-45 group-hover:scale-105 rtl:left-7 rtl:right-auto ${dark ? "bg-teal text-[#061710]" : "bg-ink text-white"}`}><ArrowRight size={19} className="rtl:rotate-180"/></span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-[118px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(49,210,181,.08),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(93,140,255,.1),transparent_30%)]" />
        <Container className="relative z-10">
          <Reveal><SectionHeading light kicker="ERP showcase" title="Operational software that feels clear at every level." copy="Dashboards for leadership. Workflows for teams. Integrations for the systems already in place." /></Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <Reveal className="grid min-h-[520px] gap-4 rounded-[30px] border border-[#16304f] bg-[#0b1b31] p-5 md:grid-cols-[210px_1fr]">
              <div className="flex gap-2 overflow-x-auto p-1 md:grid md:content-start md:overflow-visible">
                {['Sales','Finance','Inventory','HR & Payroll','Projects','Support'].map((tab,i)=><span key={tab} className={`whitespace-nowrap rounded-xl px-3 py-3 text-xs font-bold ${i===0?'bg-[#132842] text-white':'text-[#91a6ba]'}`}>{tab}</span>)}
              </div>
              <div className="rounded-[21px] bg-[#f8fafc] p-4 text-ink md:p-5">
                <div className="flex items-center justify-between gap-4"><div><small className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8290a0]">Sales operations</small><h3 className="mt-1 font-display text-xl font-semibold tracking-[-.03em]">Pipeline overview</h3></div><span className="rounded-full bg-[#e9f9f5] px-2.5 py-1.5 text-[9px] font-extrabold text-teal-deep">Synced</span></div>
                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">{[['Open pipeline','SAR 8.2M'],['Win rate','38.6%'],['Avg. cycle','24 days']].map(([l,v])=><div key={l} className="rounded-[13px] border border-[#e4eaf0] bg-white p-3"><small className="text-[9px] text-[#8290a0]">{l}</small><strong className="mt-1 block font-display text-lg">{v}</strong></div>)}</div>
                <div className="mt-3 grid gap-2.5 md:grid-cols-[1.15fr_.85fr]">
                  <div className="rounded-[14px] border border-[#e4eaf0] bg-white p-3">{['Enterprise rollout','Mobile field app','Retail ERP','AI knowledge hub','B2B portal'].map((r,i)=><div className="grid grid-cols-[1.4fr_.7fr_.6fr] gap-2 border-b border-[#eff3f6] py-2 text-[9px] text-[#627083] last:border-0" key={r}><b className="text-[#253449]">{r}</b><span>{['SAR 1.8M','SAR 420K','SAR 980K','SAR 310K','SAR 640K'][i]}</span><em className="not-italic text-teal-deep">Active</em></div>)}</div>
                  <div className="grid place-items-center rounded-[14px] border border-[#e4eaf0] bg-white p-3"><div className="relative h-28 w-28 rounded-full bg-[conic-gradient(#31d2b5_0_42%,#5d8cff_42%_74%,#dfe6ee_74%)] before:absolute before:inset-[20px] before:rounded-full before:bg-white"/><div className="flex gap-3 text-[9px] text-[#778597]"><span>Won 42%</span><span>Pipeline 32%</span></div></div>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Reveal delay={120}><div className="min-h-[190px] rounded-[25px] border border-[#16304f] bg-[#0c1d35] p-7"><span className="grid h-12 w-12 place-items-center rounded-[14px] bg-teal/10 text-teal"><Workflow size={21}/></span><h3 className="mt-4 font-display text-2xl font-semibold">Workflow-first</h3><p className="mt-2 text-sm leading-7 text-[#91a7bc]">We map the real process before configuring the software.</p></div></Reveal>
              <Reveal delay={220}><div className="relative min-h-[240px] overflow-hidden rounded-[25px] border border-[#16304f] bg-gradient-to-br from-[#13324f] to-[#0c1d35] p-7"><div className="pointer-events-none absolute -bottom-28 -right-20 h-60 w-60 rounded-full border border-teal/15 shadow-[0_0_0_35px_rgba(49,210,181,.04),0_0_0_70px_rgba(49,210,181,.025)]"/><span className="grid h-12 w-12 place-items-center rounded-[14px] bg-teal/10 text-teal"><Sparkles size={21}/></span><h3 className="mt-4 font-display text-2xl font-semibold">AI where it helps</h3><p className="mt-2 max-w-[360px] text-sm leading-7 text-[#91a7bc]">Assistants and automations are embedded into the same operational layer.</p></div></Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <Reveal><SectionHeading kicker="Business outcomes" title="Engineering choices tied to operating results." copy="The technology is only useful when it improves speed, clarity, resilience or customer experience." /></Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[300px_280px]">
            <Reveal className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white md:row-span-2"><span className="grid h-12 w-12 place-items-center rounded-[14px] border border-white/[.09] bg-white/[.07] text-teal"><ShieldCheck/></span><h3 className="mt-4 font-display text-[26px] font-semibold">Security by architecture</h3><p className="mt-2 max-w-[420px] text-sm leading-7 text-[#9fb1c3]">Identity, permissions, auditability and safe deployment patterns are designed into the system.</p><div className="absolute -bottom-40 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full border border-blue/20 before:absolute before:inset-12 before:rounded-full before:border before:border-teal/15 after:absolute after:inset-24 after:rounded-full after:border after:border-teal/10"/></Reveal>
            <Reveal delay={90} className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#eefbfa] to-[#eef4ff] p-7 lg:col-span-2"><span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-teal-deep"><Code2 size={17}/> Modern stack</span><h3 className="mt-4 max-w-[460px] font-display text-[28px] font-semibold leading-tight">Built for change, not just launch day.</h3><p className="mt-2 max-w-[460px] text-sm leading-7 text-muted">Modular architecture keeps the product easier to extend as the business grows.</p><div className="absolute bottom-5 right-6 hidden w-[46%] rounded-2xl bg-[#0e1c31] p-4 font-mono text-[10px] leading-5 text-[#97f2d4] shadow-xl md:block rtl:left-6 rtl:right-auto"><span className="block text-[#62758c]">const platform = await almajrah.build({'{'}</span><span className="block">&nbsp;&nbsp;frontend: <b className="text-[#8ab5ff]">"Next.js"</b>,</span><span className="block">&nbsp;&nbsp;backend: <b className="text-[#8ab5ff]">"NestJS"</b>,</span><span className="block">&nbsp;&nbsp;database: <b className="text-[#ffd987]">"PostgreSQL"</b></span><span className="block text-[#62758c]">{'}'});</span></div></Reveal>
            <Reveal delay={160} className="rounded-[28px] border border-slate-200 bg-[#f7f9fb] p-7"><Zap className="text-teal-deep"/><h3 className="mt-4 font-display text-2xl font-semibold">Faster execution</h3><p className="mt-2 text-sm leading-7 text-muted">Automate repetitive handoffs and give teams the information they need at the moment of work.</p></Reveal>
            <Reveal delay={220} className="rounded-[28px] border border-slate-200 bg-[#f7f9fb] p-7"><Workflow className="text-blue"/><h3 className="mt-4 font-display text-2xl font-semibold">Connected data</h3><p className="mt-2 text-sm leading-7 text-muted">Reduce duplication by integrating ERP, applications, portals and services around shared APIs.</p></Reveal>
          </div>
        </Container>
      </section>

      {/* <section className="bg-[#eff3f7] py-20 md:py-[118px]">
        <Container>
          <Reveal><SectionHeading kicker="Industry-focused delivery" title="Software that understands the operation behind the screen." /></Reveal>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{industries.map(({title,copy,icon:Icon},i)=><Reveal key={title} delay={i*60}><div className="group min-h-[280px] rounded-[26px] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-card"><span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#edf9f6] text-teal-deep"><Icon/></span><h3 className="mt-7 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{copy}</p></div></Reveal>)}</div>
        </Container>
      </section> */}
    <IndustriesDeck />
  

      <section className="bg-white py-20 md:py-[118px]">
        <Container>
          <Reveal><SectionHeading kicker="Selected work" title="Products and platforms built around measurable change." /></Reveal>
          <div className="grid gap-4 md:grid-cols-3">{portfolio.slice(0,3).map((p,i)=><Reveal key={p.title} delay={i*80}><Link href="/portfolio" className="group block overflow-hidden rounded-[24px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card"><div className="relative flex h-[210px] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(49,210,181,.18),transparent_25%),radial-gradient(circle_at_30%_70%,rgba(93,140,255,.22),transparent_28%),linear-gradient(145deg,#07111f,#123354)] p-6 text-white"><span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8fe6d6]">{p.type}</span><strong className="font-display text-2xl tracking-[-.03em]">{p.metric}</strong><div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10 shadow-[0_0_0_34px_rgba(255,255,255,.025)]"/></div><div className="p-5"><h3 className="font-display text-xl font-semibold">{p.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{p.copy}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-teal-deep transition group-hover:gap-3">View case study <ArrowRight size={14} className="rtl:rotate-180"/></span></div></Link></Reveal>)}</div>
        </Container>
      </section>

      <CTA />
    </main>
  );
}
