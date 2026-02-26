"use client";

import { FileText, Zap, ShieldCheck, Sparkles, ArrowRight, MessageSquare, ListChecks } from "lucide-react";
import { cn } from "~/lib/utils";

const steps = [
  {
    step: "01",
    title: "Input Your Content",
    description: "Paste your AI-generated essays, blog posts, or assignments into our secure editor. We support plain text, Word docs, and PDFs.",
    icon: FileText,
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-primary/10",
    borderColor: "border-emerald-100",
  },
  {
    step: "02",
    title: "Choose Your Tone",
    description: "Select from our expert-crafted presets or customize the style to match your natural voice. Whether academic or conversational, we've got you covered.",
    icon: ListChecks,
    color: "from-teal-500 to-teal-600",
    lightColor: "bg-teal-50",
    borderColor: "border-teal-100",
  },
  {
    step: "03",
    title: "Humanize Instantly",
    description: "Our advanced linguistic engine rewrites your text in seconds, removing AI fingerprints while preserving your original meaning and message.",
    icon: Zap,
    color: "from-emerald-600 to-emerald-700",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    step: "04",
    title: "Achieve Quality",
    description: "Download your professionally humanized text. It now reads naturally with authentic human tone and style.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-brand-green/10",
    borderColor: "border-emerald-100",
  },
];

export default function HowToUseSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-card overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-teal-50/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-primary border border-emerald-100 mb-6">
            <Sparkles className="h-4 w-4" />
            Simple Workflow
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6 max-w-4xl">
            Humanize your writing in <span className="text-primary italic">seconds</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The most advanced AI-to-human transformation process, simplified into four effortless steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.step}
                className="group relative flex flex-col h-full rounded-[2rem] border border-border bg-card p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 hover:border-emerald-200"
              >
                {/* Step Number Badge */}
                <div className={cn(
                  "mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white font-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300",
                  step.color
                )}>
                  {step.step}
                </div>

                {/* Icon Circle */}
                <div className={cn(
                  "mb-6 flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 group-hover:bg-card group-hover:shadow-md",
                  step.lightColor,
                  step.borderColor
                )}>
                  <Icon className="h-6 w-6 text-slate-800" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Mobile/Tablet Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 md:hidden">
                    <div className="rounded-full bg-card border border-border p-1.5 shadow-sm">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/70 rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA area */}
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary hover:shadow-[0_12px_40px_-12px_rgba(16,185,129,0.5)]"
          >
            Start Humanizing Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}


