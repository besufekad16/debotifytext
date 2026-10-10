import Link from "next/link";
import { ShieldCheck, BookOpen, PenLine, Scale } from "lucide-react";
import MarketingShell from "~/components/marketing/MarketingShell";
import { Section, Container, SectionHeading } from "~/components/marketing/primitives";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.debotifytext.com" },
    { "@type": "ListItem", position: 2, name: "Responsible Use", item: "https://www.debotifytext.com/responsible-use" },
  ],
};

const RESPONSIBLE_PRACTICES = [
  {
    icon: PenLine,
    title: "Enhance, don't replace",
    desc: "Use DebotifyText to refine your work, not to generate content from scratch.",
  },
  {
    icon: ShieldCheck,
    title: "Maintain your voice",
    desc: "Ensure the humanized output reflects your original thoughts and style.",
  },
  {
    icon: BookOpen,
    title: "Respect policies",
    desc: "Follow your institution's guidelines on AI-assisted writing.",
  },
  {
    icon: Scale,
    title: "Be transparent",
    desc: "When required, disclose your use of writing assistance tools.",
  },
];

export default function ResponsibleUsePage() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Section tone="dark" compact>
        <Container width="narrow" className="text-center">
          <SectionHeading
            as="h1"
            dark
            eyebrow="Ethical Guidelines"
            title="Responsible use of DebotifyText"
            description="DebotifyText is designed to help you create content that sounds natural and authentic — not to bypass integrity systems or replace your own effort."
          />
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <div className="space-y-8">
            {/* Important notice */}
            <div className="rounded-2xl border-l-4 border-green-700 bg-green-50 p-6 sm:p-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-700">Important notice</p>
              <p className="text-[15px] leading-relaxed text-gray-700">
                DebotifyText is <strong className="text-slate-900">not a tool for academic dishonesty or cheating</strong>.
                We encourage responsible use that enhances your work while respecting academic integrity and
                institutional policies.
              </p>
            </div>

            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">What DebotifyText does</h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-500">
                DebotifyText helps you refine and improve how your content reads — making it more natural, clear, and
                engaging. Our platform uses advanced AI to enhance the flow and readability of your writing while
                preserving your original ideas and voice. Many users leverage DebotifyText to:
              </p>
              <ul className="space-y-2">
                {[
                  "Polish and refine their drafts",
                  "Rephrase ideas for better clarity",
                  "Improve sentence structure and flow",
                  "Ensure their writing sounds authentic and natural",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-500">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                Academic integrity and educational use
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed text-slate-500">
                Every educational institution has its own policies regarding AI-assisted writing. It&apos;s essential to
                understand and comply with your school&apos;s or university&apos;s guidelines. When in doubt, consult with your
                instructor, advisor, or academic integrity office.
              </p>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="mb-3 text-[15px] font-semibold text-slate-900">We do not condone:</p>
                <ul className="space-y-2">
                  {[
                    "Using DebotifyText to circumvent AI detection systems",
                    "Submitting humanized content as entirely original academic work without proper attribution",
                    "Using our tool in ways that violate your institution's academic integrity policies",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                Using DebotifyText responsibly
              </h2>
              <p className="mb-5 text-[15px] leading-relaxed text-slate-500">
                When used ethically, DebotifyText can be a powerful writing companion that helps you express your ideas
                more effectively.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {RESPONSIBLE_PRACTICES.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-slate-100 bg-white p-5 transition-colors hover:border-green-700/40"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-700">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">Quality content creation</h2>
              <p className="text-[15px] leading-relaxed text-slate-500">
                Beyond academic writing, DebotifyText helps you create trustworthy, people-first content that aligns with
                modern content quality standards. By ensuring your writing feels authentic and natural, you build trust
                with readers and improve how your content is received — whether for marketing, blogging, or professional
                communication.
              </p>
            </section>

            <div className="rounded-2xl border border-slate-100 bg-green-50 p-6 sm:p-8">
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-slate-900">
                Questions about responsible use?
              </h2>
              <p className="text-[15px] leading-relaxed text-slate-500">
                If you have concerns or questions about how to use DebotifyText ethically in your context, please reach
                out to us at{" "}
                <Link
                  href="mailto:debotifytext@gmail.com"
                  className="font-semibold text-green-700 underline underline-offset-4"
                >
                  debotifytext@gmail.com
                </Link>{" "}
                or consult with your academic advisor or institution&apos;s integrity office.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
