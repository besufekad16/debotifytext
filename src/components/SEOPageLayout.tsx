"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import type { SEOContent } from "~/lib/pseo-content";
import { 
  Zap, Target, Users, Lock, DollarSign, Star,
  CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";

interface SEOPageLayoutProps {
  content: SEOContent;
  keyword: string;
}

export default function SEOPageLayout({ content, keyword }: SEOPageLayoutProps) {
  const iconMap: Record<string, React.ReactNode> = {
    zap: <Zap className="h-6 w-6" />,
    target: <Target className="h-6 w-6" />,
    users: <Users className="h-6 w-6" />,
    lock: <Lock className="h-6 w-6" />,
    'dollar-sign': <DollarSign className="h-6 w-6" />,
    star: <Star className="h-6 w-6" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f0f9ff] to-[#e0f2fe]">
      <PageNavbar />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-[#6D5635]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{keyword}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-[#8B6F47]/10 via-[#6D5635]/10 to-[#1d4ed8]/10 px-6 py-2.5 text-sm font-semibold text-[#6D5635] shadow-sm border border-[#8B6F47]/20">
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            AI Humanization Technology
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            {content.h1}
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            {content.heroText}
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">4.9/5</span> Rating
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#6D5635]" />
              <span className="font-semibold">450,000+</span> Users
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-#8B6F47" />
              <span className="font-semibold">99.9%</span> Success Rate
            </div>
          </div>

          {/* CTA #1: Hero */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#1d4ed8] hover:from-[#6D5635] hover:via-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Start Humanizing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#6D5635] text-[#6D5635] hover:bg-[#6D5635] hover:text-white font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Choose HumanifyLab?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8B6F47]/10 to-[#6D5635]/10 text-[#6D5635]">
                  {iconMap[feature.icon] || <Star className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            HumanifyLab vs Competitors
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6D5635]">HumanifyLab</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {content.comparison.map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-4 px-4 font-medium text-foreground">{row.feature}</td>
                    <td className="py-4 px-4 text-[#6D5635] font-semibold">
                      <CheckCircle2 className="inline-block h-5 w-5 mr-2" />
                      {row.humanifylab}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{row.competitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA #2: Mid-Content */}
        <div className="mb-16 rounded-3xl bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#1d4ed8] p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            💡 Ready to Experience the Difference?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Transform your AI content into natural, human-like text in seconds. Join 450,000+ satisfied users.
          </p>
          <Link href="/">
            <Button 
              size="lg"
              className="bg-card text-[#6D5635] hover:bg-slate-100 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Humanizing Now - It&apos;s Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {content.faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6 last:border-0">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA #3: Final */}
        <div className="rounded-3xl border-2 border-[#6D5635] bg-gradient-to-br from-white to-[#f0f9ff] p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            🎉 Join 450,000+ Happy Users
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Transform Your AI Content Today
          </p>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the most advanced AI humanization technology. achieve professional quality with 99.9% success rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#1d4ed8] hover:from-[#6D5635] hover:via-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🚀 Start Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#6D5635] text-[#6D5635] hover:bg-[#6D5635] hover:text-white font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

