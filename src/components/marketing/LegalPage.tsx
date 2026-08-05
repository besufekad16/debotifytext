import MarketingShell from "~/components/marketing/MarketingShell";
import { Section, Container } from "~/components/marketing/primitives";

export interface LegalSection {
  heading: string;
  paragraphs?: React.ReactNode[];
  bullets?: React.ReactNode[];
}

/**
 * Shared, professional layout for legal / policy pages (Terms, Privacy, etc.)
 * so they read cleanly and consistently instead of as dense walls of text.
 */
export default function LegalPage({
  title,
  intro,
  lastUpdated,
  sections,
  breadcrumbSchema,
}: {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
  breadcrumbSchema?: object;
}) {
  return (
    <MarketingShell>
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}

      <Section tone="dark" compact>
        <Container width="narrow" className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a67c52]">Legal</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">{intro}</p>
          <p className="mt-5 text-xs text-gray-500">Last updated: {lastUpdated}</p>
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={i} className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900">{section.heading}</h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="mb-3 text-[15px] leading-relaxed text-gray-600">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-600">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--hl-mint-deep)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
