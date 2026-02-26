"use client";

import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

export default function TermsPage() {
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
                "name": "Terms of Service",
                "item": "https://www.humanifylab.com/terms"
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
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block rounded-full bg-blue-50 px-6 py-2.5 text-sm font-semibold text-[#2563eb] mb-6 shadow-sm border border-[#3b82f6]/20">
                        Terms & Conditions
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using HumanifyLab. By using our service, you agree to these terms.
                    </p>
                    <div className="mt-4 text-xs sm:text-sm text-slate-500 bg-white/60 rounded-full px-4 py-2 w-fit mx-auto border border-slate-200/50">
                        Last updated: November 4, 2025
                    </div>
                </div>

                {/* Terms Content */}
                <div className="rounded-3xl border border-slate-200/60 bg-white p-8 md:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="space-y-8">
                        <div className="text-base text-slate-600 leading-relaxed mb-6">
                            <p>
                                These Terms of Service govern your use of HumanifyLab and provide information about the HumanifyLab Service. By using our services, you agree to these terms.
                            </p>
                        </div>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                By accessing and using HumanifyLab, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                2. Age Requirement
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                You must be at least 18 years of age to use HumanifyLab. By using our service, you represent and warrant that you are 18 years of age or older. If you are under 18, you are not permitted to use this service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                3. Description of Service
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                HumanifyLab provides an AI-powered text humanization service that transforms AI-generated content into natural, human-like writing with professional quality and authentic tone. Our service includes:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li>Text humanization with multiple style presets</li>
                                <li>Natural writing enhancement capabilities</li>
                                <li>Credit-based usage system</li>
                                <li>API access for ULTRA plan subscribers</li>
                                <li>History tracking and management</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                4. User Accounts
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                To use certain features of our service, you must register for an account. You are responsible for:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized use</li>
                                <li>Ensuring your account information is accurate and up-to-date</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                5. Acceptable Use
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                You agree not to use HumanifyLab to:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li>Violate any laws or regulations</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Transmit harmful or malicious content</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Use the service for any illegal or unethical purposes</li>
                                <li>Resell or redistribute our service without permission</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                6. Payment and Subscriptions
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                HumanifyLab offers both free and paid plans:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li><strong className="text-slate-900">Free Plan:</strong> Limited credits provided at signup</li>
                                <li><strong className="text-slate-900">Paid Plans:</strong> Subscription-based with monthly or yearly billing</li>
                                <li><strong className="text-slate-900">Credits:</strong> One credit typically equals processing of 1 word</li>
                                <li><strong className="text-slate-900">Refunds:</strong> We&apos;re confident in the quality of our AI humanizer. If you&apos;re not satisfied with the results, please contact our support team within 7 days of purchase, and we&apos;ll work with you to find a solution.</li>
                                <li><strong className="text-slate-900">Cancellation:</strong> You may cancel your subscription at any time</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                7. Intellectual Property
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                The service and its original content, features, and functionality are owned by HumanifyLab and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="text-base text-slate-600 leading-relaxed">
                                Content you create using our service remains yours, but you grant us a license to process and humanize your text to provide the service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                8. API Usage (ULTRA Plan)
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                ULTRA plan subscribers with API access must:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li>Keep API keys confidential and secure</li>
                                <li>Not exceed rate limits or abuse the API</li>
                                <li>Not share API keys with unauthorized parties</li>
                                <li>Monitor API key usage and deactivate if compromised</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                9. Disclaimer of Warranties
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                The service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc list-outside text-base text-slate-600">
                                <li>The service will be uninterrupted or error-free</li>
                                <li>The humanized text will meet all your specific requirements</li>
                                <li>The service will produce perfect results in every case</li>
                                <li>All errors will be corrected</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                10. Limitation of Liability
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                To the maximum extent permitted by law, HumanifyLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                11. Changes to Terms
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                12. Termination
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                We may terminate or suspend your account and access to the service immediately, without prior notice, for any breach of these Terms of Service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                13. Governing Law
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 pt-4 border-t border-slate-200">
                                14. Contact Information
                            </h2>
                            <p className="text-base text-slate-600 leading-relaxed mb-4">
                                For questions about these Terms of Service, please contact us:
                            </p>
                            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-sm text-slate-600 font-medium mb-1">Email us at</p>
                                <p className="font-semibold text-slate-900 text-lg mb-4">humanifylab1@gmail.com</p>
                                <p className="text-sm text-slate-600 pt-4 border-t border-slate-200">
                                    We typically respond within 24 hours
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
