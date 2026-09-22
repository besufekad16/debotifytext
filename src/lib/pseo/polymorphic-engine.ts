import crypto from 'crypto';

/**
 * The PolymorphicEngine is a deterministic PRNG-based engine capable of generating
 * structurally and semantically unique pages at scale via Context-Free Grammars (CFG)
 * and Procedural Data Synthesis.
 */
export class PolymorphicEngine {
  private seed: number;

  constructor(keyword: string) {
    this.seed = this.hashString(keyword);
  }

  // Generate deterministic seed from string
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Mulberry32 PRNG (Deterministic based on seed)
  private random(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public pick<T>(arr: T[]): T {
    return arr[Math.floor(this.random() * arr.length)] as T;
  }

  public pickN<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - this.random());
    return shuffled.slice(0, n);
  }

  /**
   * Generates procedurally synthesized data tailored to the keyword.
   * This provides numerical and statistical uniqueness.
   */
  public synthesizeData(keyword: string) {
    const isAcademic = /essay|paper|thesis|student|academic/i.test(keyword);
    const isProfessional = /marketing|blog|email|resume|cover letter|report/i.test(keyword);
    const isTechnical = /code|documentation|manual|api/i.test(keyword);

    // Baseline metrics generated deterministically
    const initialDetectionRisk = 85 + Math.floor(this.random() * 14); // 85 to 98
    const postHumanizationOriginality = 98 + Number((this.random() * 1.9).toFixed(1)); // 98.0 to 99.9
    const tokensProcessedAvg = Math.floor(500000 + this.random() * 2000000); // 500k to 2.5m
    const semanticPreservationScore = 95 + Number((this.random() * 4.9).toFixed(1)); // 95.0 to 99.9

    let persona = "General User";
    let intent = "Content Optimization";
    if (isAcademic) {
      persona = "Academic Student / Researcher";
      intent = "Essay Humanization & Context Maintenance";
    } else if (isProfessional) {
      persona = "Digital Marketer / SEO Professional";
      intent = "Brand Voice Alignment & Scale";
    } else if (isTechnical) {
      persona = "Technical Writer / Developer";
      intent = "Documentation Fluidity";
    }

    return {
      metrics: {
        initialDetectionRisk,
        postHumanizationOriginality,
        tokensProcessedAvg,
        semanticPreservationScore
      },
      persona,
      intent
    };
  }

  /**
   * The Layout Selector
   * Picks exactly 4-5 unique content modules and orders them.
   */
  public generateLayout(): string[] {
    const availableModules = [
      "MetricsTable",
      "PersonaProfile",
      "TechnicalDeepDive",
      "StepByStep",
      "Glossary",
      "ComparisonMatrix",
      "FAQ"
    ];

    // Always include at least 4 modules, sometimes 5
    const numModules = 4 + Math.floor(this.random() * 2); 
    const selected = this.pickN(availableModules, numModules);
    
    // Always append FAQ at the end for SEO
    if (!selected.includes("FAQ")) {
      selected.push("FAQ");
    } else {
      const idx = selected.indexOf("FAQ");
      selected.splice(idx, 1);
      selected.push("FAQ");
    }

    return selected;
  }

  /**
   * Context-Free Grammar (CFG) Generator
   * Replaces basic spintax with semantic tree generation.
   */
  public generateParagraph(context: 'intro' | 'technical' | 'guide', keyword: string): string {
    const kw = keyword.toLowerCase();

    // CFG Rules
    const grammar = {
      intro: [
        "[Hook] [Explanation] [Benefit].",
        "[Observation] [Hook] [Benefit].",
        "[Explanation] [Benefit] [Hook]."
      ],
      Hook: [
        `When approaching ${kw}, standard AI tools often fail to capture natural human nuance.`,
        `The landscape of ${kw} demands a level of authenticity that basic generative models cannot provide.`,
        `Addressing ${kw} requires more than simple synonym swapping—it requires deep semantic understanding.`
      ],
      Explanation: [
        "Our proprietary bypass engine utilizes advanced adversarial training to dismantle robotic footprints.",
        "By analyzing millions of human-written vectors, our system restructures the grammatical flow natively.",
        "The underlying architecture leverages context-aware phrasing to ensure complete detection evasion."
      ],
      Benefit: [
        "This guarantees your content remains authoritative while completely bypassing Turnitin, GPTZero, and Originality.ai.",
        "The result is a flawless, undetectable document that preserves your original meaning 100%.",
        "Ultimately, this provides unprecedented peace of mind for professionals and creators alike."
      ],
      Observation: [
        "It is a known fact in the industry.",
        "Recent algorithm updates have changed the game.",
        "We've analyzed the data extensively."
      ]
    };

    if (context === 'intro') {
      const pattern = this.pick(grammar.intro);
      return pattern
        .replace("[Hook]", this.pick(grammar.Hook))
        .replace("[Explanation]", this.pick(grammar.Explanation))
        .replace("[Benefit]", this.pick(grammar.Benefit))
        .replace("[Observation]", this.pick(grammar.Observation));
    }

    // Default fallback
    return `Optimizing ${kw} requires professional tools to ensure high-quality output.`;
  }
}
