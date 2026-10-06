"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  questions: FaqItem[];
}

export default function FaqAccordionClient({ faqs }: { faqs: FaqCategory[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-16">
      {faqs.map((cat, catIndex) => (
        <div key={catIndex} className="relative">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {cat.category}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-green-100 to-transparent" />
          </div>
          
          <div className="space-y-4">
            {cat.questions.map((faq, faqIndex) => {
              const id = `${catIndex}-${faqIndex}`;
              const isOpen = openId === id;
              
              return (
                <div
                  key={faqIndex}
                  className={`group rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-green-200 bg-white shadow-[0_8px_30px_-10px_rgba(34,197,94,0.12)] -translate-y-0.5"
                      : "border-slate-100 bg-white/60 backdrop-blur-sm hover:border-green-100 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="flex w-full items-center justify-between py-6 text-left px-6 sm:px-8"
                  >
                    <span className={`text-[16px] sm:text-[17px] font-bold pr-8 transition-colors ${isOpen ? "text-green-950" : "text-slate-800"}`}>
                      {faq.question}
                    </span>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-green-100 text-green-700 rotate-180 shadow-inner" : "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600"}`}>
                      <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-6 sm:px-8 pb-7 text-[15px] leading-relaxed text-slate-500 font-medium">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
