"use client";

import { Zap, ShieldCheck, Fingerprint } from "lucide-react";

export default function FactsSection() {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Why It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI engine doesn't just swap words. It rewrites entire structures to mimic natural human writing patterns.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/60 hover:border-var(--hl-mint)/50 hover:shadow-xl hover:shadow-#faf6f10/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Professional-Grade Quality</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-foreground tracking-tight">100%</span>
              <span className="text-sm text-muted-foreground font-medium ml-2">Human Score</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We ensure your writing meets the highest professional standards with natural, authentic human tone and style.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/60 hover:border-var(--hl-mint)/50 hover:shadow-xl hover:shadow-#faf6f10/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Fingerprint className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Natural Flow</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-foreground tracking-tight">0%</span>
              <span className="text-sm text-muted-foreground font-medium ml-2">Plagiarism</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Maintains your original meaning and tone while ensuring the text reads completely naturally.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/60 hover:border-var(--hl-mint)/50 hover:shadow-xl hover:shadow-#faf6f10/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-#faf6f1 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-var(--hl-mint)" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Lightning Fast</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-foreground tracking-tight">&lt;10s</span>
              <span className="text-sm text-muted-foreground font-medium ml-2">Processing</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get humanized results instantly. No waiting in queues, perfect for deadlines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

