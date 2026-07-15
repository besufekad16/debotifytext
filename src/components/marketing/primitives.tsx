import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

export function Section({
  children,
  className,
  tone = "white",
  id,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "white" | "muted" | "dark";
  id?: string;
  compact?: boolean;
}) {
  const toneClass =
    tone === "dark" ? "bg-[#0f1419] text-white" : tone === "muted" ? "bg-[#faf7f4]" : "bg-white";
  return (
    <section id={id} className={cn(compact ? "section-y-sm" : "section-y", toneClass, className)}>
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-7xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.18em]",
        dark ? "text-[#c9a97f]" : "text-[#8b6f47]",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <div className="mb-3">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </div>
      )}
      <Tag
        className={cn(
          "text-3xl font-semibold leading-tight tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-gray-400" : "text-gray-600")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className,
  withArrow = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl bg-[#5e3d2a] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4a2f1f] hover:shadow-md",
        className,
      )}
    >
      {children}
      {withArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </Link>
  );
}

export function SecondaryButton({
  href,
  children,
  className,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold transition-colors",
        dark
          ? "border-white/20 text-white hover:bg-white/10"
          : "border-gray-300 text-gray-800 hover:border-[#8b6f47] hover:text-[#5e3d2a]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-6",
        hover && "hover-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatBlock({ value, label, dark = false }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold tracking-tight sm:text-3xl", dark ? "text-[#c9a97f]" : "text-[#5e3d2a]")}>
        {value}
      </div>
      <div className={cn("mt-1 text-xs uppercase tracking-wide", dark ? "text-gray-400" : "text-gray-500")}>
        {label}
      </div>
    </div>
  );
}

export function CTASection({
  title,
  subtitle,
  href = "/",
  cta = "Get Started Free",
}: {
  title: string;
  subtitle: string;
  href?: string;
  cta?: string;
}) {
  return (
    <Section tone="dark">
      <Container width="narrow" className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-400">{subtitle}</p>
        <div className="mt-8">
          <PrimaryButton href={href} className="bg-[#8b6f47] hover:bg-[#7a6040]">
            {cta}
          </PrimaryButton>
        </div>
      </Container>
    </Section>
  );
}
