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

      <Section className="bg-gradient-to-b from-green-50/50 to-white pt-24 pb-16 border-b border-slate-100">
        <Container width="narrow" className="text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100/50 border border-green-200/50 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-6">
            Legal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-slate-500 font-medium">{intro}</p>
          <p className="mt-6 text-sm font-semibold text-slate-400">Last updated: {lastUpdated}</p>
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={i} className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">{section.heading}</h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="mb-3 text-[15px] leading-relaxed text-slate-500">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-500">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
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
