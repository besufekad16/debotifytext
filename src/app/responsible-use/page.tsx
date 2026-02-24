"use client";

import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import Link from "next/link";

export default function ResponsibleUsePage() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.humanifylab.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Responsible Use",
                "item": "https://www.humanifylab.com/responsible-use"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <PageNavbar />
            <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block rounded-full bg-blue-50 px-6 py-2.5 text-sm font-semibold text-[#2563eb] mb-6 shadow-sm border border-[#3b82f6]/20">
                        Ethical Guidelines
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                        Responsible Use of HumanifyLab
                    </h1>
                    <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        HumanifyLab is designed to help you create content that sounds natural and authentic — not to bypass integrity systems or replace your own effort.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Important Notice Card - Prominent */}
                    <div className="relative rounded-3xl border-2 border-[#3b82f6]/30 bg-white p-8 shadow-2xl overflow-hidden">

                        <div className="relative">
                            <div className="inline-block mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-3 py-1.5 rounded-full">Important</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Important Notice</h3>
                            <p className="text-base text-slate-700 leading-relaxed">
                                HumanifyLab is <strong className="text-slate-900">not a tool for academic dishonesty or cheating</strong>. We encourage responsible use that enhances your work while respecting academic integrity and institutional policies.
                            </p>
                        </div>
                    </div>

                    {/* What HumanifyLab Does Card */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            What HumanifyLab Does
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed mb-6">
                            HumanifyLab helps you refine and improve how your content reads — making it more natural, clear, and engaging. Our platform uses advanced AI to enhance the flow and readability of your writing while preserving your original ideas and voice.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4 font-semibold">
                            Many users leverage HumanifyLab to:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Polish and refine their drafts",
                                "Rephrase ideas for better clarity",
                                "Improve sentence structure and flow",
                                "Ensure their writing sounds authentic and natural"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-base text-slate-600 pl-1">
                                    <div className="flex-shrink-0 mt-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                    </div>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Academic Integrity Card */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Academic Integrity & Educational Use
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed mb-6">
                            Every educational institution has its own policies regarding AI-assisted writing. It&apos;s essential to understand and comply with your school&apos;s or university&apos;s guidelines. When in doubt, consult with your instructor, advisor, or academic integrity office.
                        </p>
                        <div className="rounded-2xl bg-red-50 p-6 border border-[#fecaca]/30">
                            <p className="text-base font-semibold text-slate-900 mb-4">
                                We do not condone:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Using HumanifyLab to circumvent AI detection systems",
                                    "Submitting humanized content as entirely original academic work without proper attribution",
                                    "Using our tool in ways that violate your institution's academic integrity policies"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-base text-slate-700 pl-1">
                                        <span className="text-[#dc2626] font-bold mt-1">•</span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Using HumanifyLab Responsibly Card */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Using HumanifyLab Responsibly
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed mb-6">
                            When used ethically, HumanifyLab can be a powerful writing companion that helps you express your ideas more effectively. Here&apos;s how to use it responsibly:
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { title: "Enhance, don&apos;t replace", desc: "Use HumanifyLab to refine your work, not to generate content from scratch" },
                                { title: "Maintain your voice", desc: "Ensure the humanized output reflects your original thoughts and style" },
                                { title: "Respect policies", desc: "Follow your institution&apos;s guidelines on AI-assisted writing" },
                                { title: "Be transparent", desc: "When required, disclose your use of writing assistance tools" }
                            ].map((item, index) => (
                                <div key={index} className="rounded-2xl bg-white p-5 border border-slate-200/60 hover:border-[#3b82f6]/30 transition-colors">
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quality Content Creation Card */}
                    <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Quality Content Creation
                        </h2>
                        <p className="text-base text-slate-600 leading-relaxed">
                            Beyond academic writing, HumanifyLab helps you create trustworthy, people-first content that aligns with modern content quality standards. By ensuring your writing feels authentic and natural, you build trust with readers and improve how your content is received — whether for marketing, blogging, or professional communication.
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="rounded-3xl border-2 border-[#3b82f6]/20 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Questions about responsible use?
                        </h3>
                        <p className="text-base text-slate-600 leading-relaxed">
                            If you have concerns or questions about how to use HumanifyLab ethically in your context, please reach out to us at{" "}
                            <Link href="mailto:humanifylab1@gmail.com" className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-semibold transition-colors">
                                humanifylab1@gmail.com
                            </Link>
                            {" "}or consult with your academic advisor or institution&apos;s integrity office.
                        </p>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

