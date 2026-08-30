"use client";

import Link from "next/link";
import type { V6PageData } from "~/lib/content/v6-content";

const SECONDARY_HREF: Record<string, string> = {
  "See pricing": "/pricing",
  "Read responsible use": "/responsible-use",
  "Detector overview": "/ai-detector",
  "Lifetime plans": "/pricing#lifetime",
};

function AnswerBox({ data, className }: { data: V6PageData; className?: string }) {
  return (
    <section className={className} id="direct-answer" data-speakable="true">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Direct answer</p>
      <p className="mt-2 text-lg leading-relaxed">{data.directAnswer}</p>
    </section>
  );
}

function CompareTable({ data }: { data: V6PageData }) {
  return (
    <section className="overflow-x-auto">
      <h2 className="mb-3 text-xl font-bold">HumanifyLab vs {data.otherLabel}</h2>
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border px-3 py-2 text-left">Factor</th>
            <th className="border px-3 py-2 text-left">HumanifyLab</th>
            <th className="border px-3 py-2 text-left">{data.otherLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.comparisonRows.map((r) => (
            <tr key={r.feature}>
              <td className="border px-3 py-2 font-medium">{r.feature}</td>
              <td className="border px-3 py-2">{r.humanifylab}</td>
              <td className="border px-3 py-2">{r.other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Guide({ data }: { data: V6PageData }) {
  return (
    <div className="space-y-8">
      {data.paragraphs.map((p) => (
        <section key={p.heading}>
          <h2 className="mb-2 text-xl font-bold">{p.heading}</h2>
          <p className="leading-relaxed opacity-90">{p.body}</p>
        </section>
      ))}
    </div>
  );
}

function Steps({ data }: { data: V6PageData }) {
  return (
    <ol className="space-y-4">
      {data.steps.map((s, i) => (
        <li key={s.title} className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
            {i + 1}
          </span>
          <div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm opacity-80">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Faqs({ data }: { data: V6PageData }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{data.faqTitle}</h2>
      <div className="space-y-3">
        {data.faqs.map((f) => (
          <details key={f.q} className="rounded-xl border px-4 py-3">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Ctas({ data }: { data: V6PageData }) {
  const secondary = SECONDARY_HREF[data.ctaSecondary] ?? "/pricing";
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="/" className="rounded-2xl px-5 py-3 text-center text-sm font-bold">
        {data.ctaPrimary}
      </Link>
      <Link href={secondary} className="rounded-2xl border px-5 py-3 text-center text-sm font-medium">
        {data.ctaSecondary}
      </Link>
      <Link href="/" className="rounded-2xl px-5 py-3 text-center text-sm underline">
        {data.homeAnchor}
      </Link>
    </div>
  );
}

function Stats({ data }: { data: V6PageData }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {data.stats.map((s) => (
        <div key={s.label} className="rounded-xl border p-3 text-center">
          <p className="text-2xl font-black">{s.value}</p>
          <p className="text-xs opacity-60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function V6Template({ data }: { data: V6PageData }) {
  const id = data.layoutId;
  const shells: string[] = [
    "bg-white text-slate-900 font-sans",
    "bg-[#0b1220] text-slate-100 font-sans",
    "bg-[#f4fbf7] text-emerald-950 font-sans",
    "bg-[#fffaf2] text-stone-900 font-serif",
    "bg-violet-50 text-violet-950 font-sans",
    "bg-slate-900 text-amber-50 font-sans",
    "bg-white text-cyan-950 font-sans",
    "bg-[#1a1510] text-[#f3e9d7] font-serif",
    "bg-rose-50 text-rose-950 font-sans",
    "bg-[#0f172a] text-sky-50 font-sans",
    "bg-lime-50 text-lime-950 font-sans",
    "bg-zinc-100 text-zinc-900 font-sans",
    "bg-[#101828] text-teal-50 font-sans",
    "bg-orange-50 text-orange-950 font-sans",
    "bg-[#221122] text-pink-50 font-sans",
    "bg-blue-50 text-blue-950 font-sans",
    "bg-neutral-900 text-neutral-100 font-sans",
    "bg-[#f7f3ee] text-[#2c2416] font-serif",
    "bg-indigo-950 text-indigo-50 font-sans",
    "bg-white text-gray-900 font-sans",
  ];
  const hero: string[] = [
    "mx-auto max-w-3xl px-4 py-16 text-center",
    "grid gap-8 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12",
    "border-b px-6 py-12 md:flex md:items-end md:justify-between",
    "px-4 py-10 md:grid md:grid-cols-12 md:gap-6",
    "bg-black/20 px-4 py-20 text-left",
    "mx-auto max-w-5xl px-4 py-16",
    "flex min-h-[50vh] flex-col justify-end px-6 py-16",
    "relative overflow-hidden px-4 py-24",
    "mx-auto max-w-2xl px-4 py-12",
    "px-4 py-14",
    "border-l-8 px-6 py-12",
    "grid place-items-center px-4 py-20",
    "px-4 py-10 sm:px-16",
    "mx-auto max-w-4xl rounded-3xl border px-6 py-14 shadow-xl",
    "divide-y px-4 py-8",
    "flex flex-col-reverse gap-6 px-4 py-12 md:flex-row",
    "px-4 py-16 text-right",
    "mx-auto max-w-6xl px-4 py-10 md:grid md:grid-cols-3",
    "px-4 py-16",
    "px-4 py-8 md:px-24",
  ];
  const ctaCls: string[] = [
    "[&_a:first-child]:bg-emerald-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-amber-400 [&_a:first-child]:text-black",
    "[&_a:first-child]:bg-emerald-900 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-stone-900 [&_a:first-child]:text-amber-50",
    "[&_a:first-child]:bg-violet-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-amber-500 [&_a:first-child]:text-black",
    "[&_a:first-child]:bg-cyan-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-[#e8c07a] [&_a:first-child]:text-black",
    "[&_a:first-child]:bg-rose-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-sky-400 [&_a:first-child]:text-slate-950",
    "[&_a:first-child]:bg-lime-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-zinc-900 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-teal-400 [&_a:first-child]:text-slate-950",
    "[&_a:first-child]:bg-orange-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-pink-400 [&_a:first-child]:text-black",
    "[&_a:first-child]:bg-blue-700 [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-white [&_a:first-child]:text-black",
    "[&_a:first-child]:bg-[#5c3d2e] [&_a:first-child]:text-white",
    "[&_a:first-child]:bg-indigo-300 [&_a:first-child]:text-indigo-950",
    "[&_a:first-child]:bg-[var(--hl-mint-deep)] [&_a:first-child]:text-white",
  ];

  const order = (id * 7 + 3) % 6;
  const blocks = [
    <AnswerBox key="a" data={data} className="rounded-2xl border p-5" />,
    <Stats key="s" data={data} />,
    <CompareTable key="c" data={data} />,
    <Guide key="g" data={data} />,
    <Steps key="t" data={data} />,
    <Faqs key="f" data={data} />,
  ];
  const rotated = [...blocks.slice(order), ...blocks.slice(0, order)];

  const bodyLayouts = [
    "mx-auto max-w-3xl space-y-12 px-4 py-12",
    "mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[220px_1fr]",
    "mx-auto max-w-5xl space-y-10 px-4 py-10",
    "mx-auto max-w-4xl space-y-16 px-4 py-16",
    "mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-2",
    "mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12",
  ];

  return (
    <main className={`min-h-screen ${shells[id]}`} data-v6-layout={id}>
      <header className={hero[id]}>
        <div className={id === 17 ? "md:col-span-2" : undefined}>
          <span className="mb-3 inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
            {data.badge} / layout {id + 1} of 20
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{data.h1}</h1>
          <p className="mb-6 max-w-2xl text-base opacity-80 sm:text-lg">{data.heroSubtitle}</p>
          <div className={ctaCls[id]}>
            <Ctas data={data} />
          </div>
        </div>
        {id % 4 === 1 && (
          <aside className="rounded-2xl border p-5 text-sm opacity-90">
            <p className="font-semibold">Cluster</p>
            <p>{data.cluster}</p>
            <p className="mt-3 font-semibold">Entity</p>
            <p>{data.entity}</p>
          </aside>
        )}
      </header>

      <div className={bodyLayouts[id % bodyLayouts.length]}>
        {id % 5 === 0 && <p className="text-base leading-relaxed opacity-90">{data.intro}</p>}
        {rotated}
        <p className="text-xs opacity-60">{data.responsibleNote}</p>
        <p className="text-sm">
          <Link href="/responsible-use" className="underline">
            Responsible use policy
          </Link>
          {" / "}
          <Link href="/faq" className="underline">
            Site FAQ
          </Link>
          {" / "}
          <Link href="/" className="underline">
            {data.homeAnchor}
          </Link>
        </p>
      </div>
    </main>
  );
}
