"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";

// Example data - placeholders for now
const EXAMPLES = [
  {
    id: "academic",
    label: "Academic Essay",
    aiText: "Ultimately, creativity is more than a skill; it is a mindset that fosters growth, adaptability, and originality. By nurturing curiosity, embracing experimentation, and collaborating with others, individuals can unlock their creative potential. Creativity enriches life by providing new ways to express ideas, solve problems, and connect with others. Those who cultivate it contribute not only to personal development but also to the advancement of society, making the world more innovative, dynamic, and vibrant.",
    humanizedText: "All in all, creativity is not just a recipe; but it is rather an approach to get people growing.The Three Foci of Creativity: Nurturing curiosity, embracing experimentation with hands on learning experience in order to explore other and in collaboration with other innovation warriors.If you're an individual with creativity, it not only makes your life more colorful and fulfilling but can also in more general and practical terms actually create better solutions for old problems and encourage new ones to emerge: Creativity makes life richer by providing new media to express ideas Creativity enables the most unique solutions to problems Creativity results from connecting people together.Such people benefit their own lives greatly, so it seems reasonable to assume that society as a whole will benefit even more from having them around. They contribute in every way to making the world a far more creative, active and interesting place.",
    aiScore: 100,
    humanScore: 0,
  },
  {
    id: "email",
    label: "Cold Email",
    aiText: "I hope you're doing well and having a smooth, productive day. I wanted to reach out because I've been exploring new ways to help individuals simplify their digital workload and create a more effortless, efficient workflow experience.\n\nI recently developed a tool that automates repetitive tasks, enhances overall productivity, and reduces the amount of time spent on manual processes. It's designed to adapt intelligently to different needs, operate smoothly without complex setup, and provide a more streamlined way of getting things done.",
    humanizedText: "I hope you are doing well, and having a good and productive day. I'm writing because I've been experimenting with new ways to help people reduce the amount of digital weight in their lives and focus on a more effortless way of moving through work.\n\nI recently created an application that automate the things you do on a regular basis, saving you time and helping you become more productive. It's intended to automatically accommodate your needs, flow easily without a ton of setup work, and offer a more streamlined way to get things done.",
    aiScore: 100,
    humanScore: 0,
  },
  {
    id: "blog",
    label: "Blog Post",
    aiText: "Early Earth was extremely hot and covered in molten rock. Over time, its surface cooled, forming a solid crust and oceans. Volcanic activity released gases that formed the early atmosphere. Simple life is believed to have appeared around 3.5 billion years ago, evolving gradually into the complex organisms that inhabit the planet today. Earth became suitable for life because it has liquid water, a stable atmosphere, the right temperature range, and protection from harmful space radiation through its magnetic field.",
    humanizedText: "The early Earth was red hot and bathed in molten rock. It gradually cooled on the surface, and a solid crust and oceans formed. Gasses were released through volcanic activity to make the early atmosphere. Primitive life is thought to have evolved rapidly, perhaps as much 3.5 billion years ago, into a variety of complex forms that share the planet today. Earth is habitable because it contains liquid water, has a stable atmosphere, maintains temperatures that are conducive to life and is shielded from space radiation by the magnetic field.",
    aiScore: 100,
    humanScore: 0,
  },
];

export default function ComparisonSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [viewMode, setViewMode] = useState<"split" | "compare">("split");

  return (
    <section className="py-8 sm:py-12 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            The Only Humanizer That Passes All Detectors
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            See how our humanizer transforms AI text into natural, undetectable writing that beats GPTZero, Turnitin, and more.
           
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => setActiveExample(idx)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeExample === idx
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Card */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* AI Side */}
            <motion.div
              key={`ai-${activeExample}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-red-100 bg-red-50/30 p-6 sm:p-8 transition-all hover:border-red-200 hover:bg-red-50/50 hover:shadow-lg hover:shadow-red-100/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <X className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Before (AI)</span>
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-100/50 px-2 py-1 rounded-md border border-red-100">
                  {EXAMPLES[activeExample]?.aiScore}% AI Detected
                </span>
              </div>
              
              <div className={cn(
                "relative transition-all duration-500 ease-in-out overflow-y-auto",
                viewMode === "split" ? "max-h-[140px]" : "max-h-[500px]"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`ai-text-${activeExample}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="text-slate-600 leading-relaxed text-base sm:text-lg font-serif italic opacity-90"
                  >
                    {EXAMPLES[activeExample]?.aiText?.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                        {idx === 0 && '"'}
                        {paragraph}
                        {idx === (EXAMPLES[activeExample]?.aiText?.split("\n\n").length ?? 1) - 1 && '"'}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
                
                {/* Gradient fade for truncated view */}
                {viewMode === "split" && (
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-red-50/90 to-transparent" />
                )}
              </div>

              <button 
                onClick={() => setViewMode(prev => prev === "split" ? "compare" : "split")}
                className="mt-4 text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                {viewMode === "split" ? "Read full text" : "Show less"} <ArrowRight className={cn("h-3 w-3 transition-transform", viewMode === "compare" && "rotate-180")} />
              </button>

              {/* Overlay effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-red-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Humanized Side */}
            <motion.div
              key={`human-${activeExample}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/30 p-6 sm:p-8 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-xl hover:shadow-emerald-100/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">After (Humanized)</span>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded-md border border-emerald-100">
                  100% Human Score
                </span>
              </div>
              
              <div className={cn(
                "relative transition-all duration-500 ease-in-out overflow-y-auto",
                viewMode === "split" ? "max-h-[140px]" : "max-h-[500px]"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`human-text-${activeExample}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
                    className="text-slate-800 leading-relaxed text-base sm:text-lg font-medium"
                  >
                    {EXAMPLES[activeExample]?.humanizedText?.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                        {idx === 0 && '"'}
                        {paragraph}
                        {idx === (EXAMPLES[activeExample]?.humanizedText?.split("\n\n").length ?? 1) - 1 && '"'}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Gradient fade for truncated view */}
                {viewMode === "split" && (
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-emerald-50/90 to-transparent" />
                )}
              </div>

              <button 
                onClick={() => setViewMode(prev => prev === "split" ? "compare" : "split")}
                className="mt-4 text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                {viewMode === "split" ? "Read full text" : "Show less"} <ArrowRight className={cn("h-3 w-3 transition-transform", viewMode === "compare" && "rotate-180")} />
              </button>

              {/* Shine effect */}
              <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </motion.div>
          </div>

          {/* Mobile Switch Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 md:hidden">
            <RefreshCw className="h-3 w-3" />
            <span>Tap tabs to switch examples</span>
          </div>
        </div>
      </div>
    </section>
  );
}
