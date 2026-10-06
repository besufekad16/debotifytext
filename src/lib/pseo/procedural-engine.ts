/**
 * Procedural Generation Engine for PSEO
 * Generates deterministic, 10000% unique content for 40,000 pages based on a string seed (keyword).
 */

// Simple 32-bit string hashing
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

// Mulberry32 PRNG
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export class ProceduralEngine {
  private prng: () => number;

  constructor(seedString: string) {
    const seed = xmur3(seedString)();
    this.prng = mulberry32(seed);
  }

  // Returns a random number between 0 and 1
  public random(): number {
    return this.prng();
  }

  // Pick random element from array
  public pick<T>(arr: T[]): T {
    return arr[Math.floor(this.random() * arr.length)] as T;
  }

  // Pick N unique elements from array
  public pickN<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - this.random());
    return shuffled.slice(0, n);
  }

  // Basic Spintax parser: {A|B|C}
  public spintax(text: string): string {
    const regex = /{([^{}]*)}/g;
    let result = text;
    while (regex.test(result)) {
      result = result.replace(regex, (match, contents) => {
        const parts = contents.split('|');
        return this.pick(parts);
      });
    }
    return result;
  }

  // Generates a Trust Rating
  public generateTrustRating() {
    const rating = (4.7 + this.random() * 0.3).toFixed(1); // 4.7 to 5.0
    const reviews = Math.floor(1000 + this.random() * 50000).toLocaleString();
    return { rating, reviews };
  }

  // Generate Comparison Table Data
  public generateComparisonData(keyword: string) {
    return [
      {
        feature: "AI Detection Bypass Rate",
        us: this.pick(["99.9%", "100%", "99.8%", "99.99%"]),
        them: this.pick(["~60%", "Varies", "< 50%", "~75%"])
      },
      {
        feature: "Context Preservation",
        us: this.pick(["Flawless", "Native Level", "Perfect", "Human-grade"]),
        them: this.pick(["Robotic", "Often broken", "Inconsistent", "Poor"])
      },
      {
        feature: "Processing Speed",
        us: this.pick(["< 2 seconds", "Instant", "Ultra-fast", "< 1 second"]),
        them: this.pick(["10-30 seconds", "Slow", "Delayed", "Requires queue"])
      },
      {
        feature: "Plagiarism Free",
        us: "Yes (100% Original)",
        them: this.pick(["Sometimes flags", "Risky", "Unknown", "Requires manual check"])
      }
    ];
  }

  // Generate exactly 20 unique FAQs
  public generateFAQs(keyword: string): { question: string; answer: string }[] {
    const kw = keyword.toLowerCase();
    
    const templates = [
      {
        q: "What makes this the best {tool|solution|platform|system} for {kw}?",
        a: "Our proprietary algorithm is specifically tuned for {kw}, ensuring that every output is {100% undetectable|completely original|flawless} while maintaining your original meaning. {Unlike generic tools, we focus on semantic accuracy.|We utilize advanced NLP to bypass detectors naturally.|Our system is built specifically to address the nuances of this exact topic.}"
      },
      {
        q: "How fast is the {kw} process?",
        a: "The entire process is {virtually instant|incredibly fast|completed in seconds}. Once you submit your text, our engine processes the {kw} parameters {in under 2 seconds|instantly|in real-time}, delivering high-quality results without the wait."
      },
      {
        q: "Will my content still sound natural after using {kw}?",
        a: "{Absolutely.|Yes, 100%.|Without a doubt.} The core feature of our {kw} engine is that it preserves {human-like flow|the original context|your unique voice}. It {doesn't just swap synonyms|goes beyond simple rewriting}—it restructures sentences exactly how a {professional writer|human|native speaker} would."
      },
      {
        q: "Can I use this {kw} tool for academic writing?",
        a: "While our {kw} technology is {highly advanced|incredibly powerful}, we always recommend using it {ethically|responsibly} and checking your institution's guidelines. It is perfect for {drafting|structuring ideas|overcoming writer's block} but should not be used to bypass academic integrity policies."
      },
      {
        q: "Does {kw} bypass Turnitin and GPTZero?",
        a: "{Yes!|Indeed.|That is our main feature.} Our {kw} system is specifically trained against {the most aggressive detectors|Turnitin, GPTZero, and Originality.ai|all major AI detection systems} to ensure your text reads as 100% human-written."
      },
      {
        q: "Is there a free trial for the {kw} features?",
        a: "Yes, you can try our {kw} capabilities {for free|at no cost} when you sign up. We provide {free credits|a generous free tier|initial free usage} so you can see the {quality|effectiveness|power} for yourself before upgrading."
      },
      {
        q: "How does {kw} handle technical or niche jargon?",
        a: "Our {kw} engine is {context-aware|highly sophisticated}. It recognizes {industry terms|technical jargon|specialized vocabulary} and leaves them intact while humanizing the surrounding sentence structure, ensuring {complete accuracy|expert-level quality}."
      },
      {
        q: "What is the maximum word count for {kw}?",
        a: "Our premium plans allow up to {5,000|10,000|unlimited} words per request for {kw}, making it {ideal|perfect} for long-form essays, reports, and massive content batches."
      },
      {
        q: "Is the {kw} output plagiarism-free?",
        a: "{100%.|Absolutely.|Yes, guaranteed.} We do not scrape or copy existing articles. The {kw} generation produces {completely original|fresh|unique} text that will easily pass Copyscape and other plagiarism checkers."
      },
      {
        q: "Why is {kw} better than ChatGPT?",
        a: "ChatGPT writes with predictable AI patterns. Our {kw} engine {removes these patterns|adds human variability|breaks down AI watermarks}, making the text {undetectable|natural|human-like} and ready for professional publishing."
      },
      {
        q: "Who is the primary audience for {kw}?",
        a: "Our {kw} features are built for {marketers, students, and professionals|agencies and content creators|anyone who needs high-quality, human-like text} who demand {perfection|reliability|stealth}."
      },
      {
        q: "Does {kw} support multiple languages?",
        a: "{Yes, we support over 30 languages!|Our system is highly multilingual.|We currently support English and are expanding rapidly.} The {kw} engine adapts its semantic restructuring based on the target language's natural grammar."
      },
      {
        q: "How secure is my data when I process {kw}?",
        a: "We take privacy {seriously|to the highest level}. All data processed for {kw} is {encrypted|securely handled} and we do not store or claim ownership of your inputs."
      },
      {
        q: "Can I use {kw} for commercial purposes?",
        a: "{Absolutely.|Yes, you own the output.|Of course.} The {kw} results are {yours to use|fully yours} for blogs, client work, marketing copy, or any commercial endeavor."
      },
      {
        q: "How often is the {kw} algorithm updated?",
        a: "We update our {kw} models {weekly|constantly|on a daily basis} to stay ahead of the latest AI detection algorithms and ensure the {highest possible bypass rates|best quality}."
      },
      {
        q: "Does {kw} work on mobile?",
        a: "{Yes!|Absolutely.} Our web application is {fully responsive|mobile-first}, allowing you to use the {kw} features {on the go|from any device, anywhere}."
      },
      {
        q: "Can {kw} help with SEO?",
        a: "Yes, heavily. By using {kw}, you ensure your content reads naturally, which {reduces bounce rates|improves user engagement|satisfies Google's helpful content update} and helps you rank higher."
      },
      {
        q: "Is {kw} difficult to use?",
        a: "Not at all. The {kw} interface is {incredibly intuitive|designed for simplicity|user-friendly}. Just paste your text and click a button—the {AI handles the rest|engine does all the heavy lifting}."
      },
      {
        q: "What formatting does {kw} preserve?",
        a: "Our {kw} engine {maintains|preserves|respects} your original paragraphs, lists, and bolding where possible, making it {easy|simple} to copy and paste back into your editor."
      },
      {
        q: "What if I'm not satisfied with the {kw} output?",
        a: "You can simply {click humanize again|rerun the tool|regenerate the text} for a {completely new variation|fresh rewrite|different angle}. The {kw} engine always produces unique results on every run."
      },
      {
        q: "Does {kw} alter the length of my text?",
        a: "Generally, the {kw} output remains {similar in length|very close to the original length}. It may expand or compress slightly to {ensure human-like flow|remove AI patterns|fix sentence variability}."
      },
      {
        q: "Can {kw} rewrite code or just text?",
        a: "Currently, our {kw} engine is optimized for {natural language and text|articles and essays}. We recommend against using it for {raw code|programming scripts} as it might alter syntax."
      },
      {
        q: "How does {kw} compare to Quillbot?",
        a: "While Quillbot is a basic paraphraser, our {kw} engine is a {purpose-built AI detection bypasser|sophisticated humanizer}. It {fundamentally alters AI signatures|removes robotic predictability} rather than just swapping words."
      }
    ];

    // Pick 20 unique templates based on the PRNG (We have exactly 23 templates, so picking 20 is safe)
    const selected = this.pickN(templates, 20);

    return selected.map(t => ({
      question: this.spintax(t.q.replace(/{kw}/g, kw)),
      answer: this.spintax(t.a.replace(/{kw}/g, kw))
    }));
  }

  // Generate 5 key takeaways (Quick Summary)
  public generateTakeaways(keyword: string): string[] {
    const kw = keyword.toLowerCase();
    const bullets = [
      "Instantly converts robotic AI text into natural, {human-like|engaging} content.",
      "Specifically optimized for {kw} to ensure perfect semantic meaning.",
      "Guaranteed to bypass Turnitin, GPTZero, and Originality.ai.",
      "100% {plagiarism-free|original} outputs with no risk of duplication.",
      "Maintains your {unique voice|professional tone|context} flawlessly.",
      "Trusted by {thousands|over 50,000} content creators and professionals.",
      "Lightning-fast processing speeds for {kw} at scale."
    ];
    return this.pickN(bullets, 5).map(b => this.spintax(b.replace(/{kw}/g, kw)));
  }

  // Generate Buying Guide content
  public generateBuyingGuide(keyword: string, secondaryKeywords: string[]): string {
    const kw = keyword.toLowerCase();
    let guide = `### Understanding the Importance of ${kw}\n\n`;
    
    guide += this.spintax(`When evaluating solutions for {**${kw}**|${kw}}, {it's critical to look beyond basic features|you must consider the underlying technology|the most important factor is reliability}. {Our engine|DebotifyText} is {built|engineered|designed} from the ground up to address the {specific nuances|unique challenges} of this field. `);
    
    if (secondaryKeywords.length > 0) {
      guide += `\n\n### Exploring Related Concepts\n\n`;
      guide += `Many users who search for ${kw} are also interested in `;
      guide += secondaryKeywords.map(k => `**${k}**`).join(", ");
      guide += `. ${this.spintax(`{Our platform seamlessly integrates these concepts|We cover all these bases|Our tool handles these requirements perfectly}, ensuring a {comprehensive|complete|holistic} approach.`)}`;
    }

    guide += `\n\n### Why Quality Matters\n\n`;
    guide += this.spintax(`{In today's digital landscape|As AI detection becomes more advanced}, {using generic tools is no longer enough|you need a specialized solution}. That is why our approach to ${kw} focuses on {semantic preservation|deep contextual understanding|true human-like flow} rather than just basic word-swapping.`);

    return guide;
  }
}
