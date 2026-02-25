/**
 * Professional SEO Keyword Generator
 * Generates 40,000 high-quality, SEO-optimized keywords
 * Focus: Single words and hyphenated phrases for better crawlability
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Core brand and product terms
const coreTerms = [
  'humanizer',
  'humanifylab',
  'humanify',
  'ai-humanizer',
  'text-humanizer',
  'content-humanizer',
];

// AI Detection Tools (competitors and related)
const aiDetectors = [
  'turnitin',
  'gptzero',
  'zerogpt',
  'originality',
  'copyleaks',
  'sapling',
  'writer',
  'quillbot',
  'grammarly',
  'claritybubble',
  'winston',
  'crossplag',
  'scribbr',
  'contentdetector',
];

// Action verbs for SEO
const actionVerbs = [
  'bypass',
  'avoid',
  'beat',
  'evade',
  'remove',
  'hide',
  'mask',
  'convert',
  'transform',
  'rewrite',
  'paraphrase',
  'humanize',
  'undetect',
  'make-undetectable',
];

// Content types
const contentTypes = [
  'essay',
  'article',
  'blog',
  'content',
  'text',
  'writing',
  'paper',
  'document',
  'thesis',
  'dissertation',
  'assignment',
  'homework',
  'report',
  'research',
  'academic',
];

// Qualifiers
const qualifiers = [
  'free',
  'best',
  'top',
  'online',
  'tool',
  'software',
  'app',
  'platform',
  'service',
  'website',
  'generator',
  'converter',
  'detector',
  'checker',
];

// Use cases
const useCases = [
  'students',
  'writers',
  'bloggers',
  'marketers',
  'researchers',
  'academics',
  'professionals',
  'business',
  'education',
  'university',
  'college',
  'school',
];

// How-to phrases
const howToPhrases = [
  'how-to-humanize-ai-text',
  'how-to-bypass-ai-detection',
  'how-to-make-ai-undetectable',
  'how-to-avoid-turnitin',
  'how-to-beat-gptzero',
  'how-to-remove-ai-detection',
  'how-to-convert-ai-to-human',
  'how-to-rewrite-ai-content',
  'how-to-paraphrase-ai-text',
  'how-to-humanize-chatgpt',
];

// Comparison phrases
const comparisonPhrases = [
  'vs',
  'versus',
  'alternative',
  'compared',
  'comparison',
  'better-than',
  'instead-of',
  'replace',
];

// Year and time-based
const years = ['2024', '2025', '2026'];
const timeQualifiers = ['new', 'latest', 'updated', 'modern', 'advanced'];

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateKeywords(): string[] {
  const keywords = new Set<string>();

  // 1. Core brand terms (6 keywords)
  coreTerms.forEach(term => keywords.add(term));

  // 2. AI Detector names (14 keywords)
  aiDetectors.forEach(detector => keywords.add(detector));

  // 3. Single action verbs (14 keywords)
  actionVerbs.forEach(verb => keywords.add(verb));

  // 4. Content types (15 keywords)
  contentTypes.forEach(type => keywords.add(type));

  // 5. Qualifiers (14 keywords)
  qualifiers.forEach(qual => keywords.add(qual));

  // 6. Use cases (12 keywords)
  useCases.forEach(useCase => keywords.add(useCase));

  // 7. How-to phrases (10 keywords)
  howToPhrases.forEach(phrase => keywords.add(phrase));

  // 8. Action + AI Detector combinations (196 keywords)
  // e.g., "bypass-turnitin", "avoid-gptzero"
  actionVerbs.forEach(verb => {
    aiDetectors.forEach(detector => {
      keywords.add(`${verb}-${detector}`);
    });
  });

  // 9. Qualifier + Core Term combinations (36 keywords)
  // e.g., "free-humanizer", "best-ai-humanizer"
  qualifiers.slice(0, 6).forEach(qual => {
    coreTerms.forEach(term => {
      keywords.add(`${qual}-${term}`);
    });
  });

  // 10. Action + Content Type combinations (210 keywords)
  // e.g., "humanize-essay", "rewrite-article"
  actionVerbs.forEach(verb => {
    contentTypes.forEach(type => {
      keywords.add(`${verb}-${type}`);
    });
  });

  // 11. Qualifier + Content Type combinations (210 keywords)
  // e.g., "free-essay-humanizer", "best-article-rewriter"
  qualifiers.forEach(qual => {
    contentTypes.forEach(type => {
      keywords.add(`${qual}-${type}-humanizer`);
    });
  });

  // 12. AI Detector + Content Type combinations (210 keywords)
  // e.g., "turnitin-essay", "gptzero-article"
  aiDetectors.forEach(detector => {
    contentTypes.forEach(type => {
      keywords.add(`${detector}-${type}`);
    });
  });

  // 13. Use Case + Core Term combinations (72 keywords)
  // e.g., "student-humanizer", "writer-ai-tool"
  useCases.forEach(useCase => {
    coreTerms.forEach(term => {
      keywords.add(`${useCase}-${term}`);
    });
  });

  // 14. Three-word combinations: Qualifier + Action + Content (3,150 keywords)
  // e.g., "free-humanize-essay", "best-rewrite-article"
  qualifiers.slice(0, 10).forEach(qual => {
    actionVerbs.slice(0, 10).forEach(verb => {
      contentTypes.forEach(type => {
        keywords.add(`${qual}-${verb}-${type}`);
      });
    });
  });

  // 15. Three-word combinations: Action + AI Detector + Content (2,940 keywords)
  // e.g., "bypass-turnitin-essay", "avoid-gptzero-article"
  actionVerbs.forEach(verb => {
    aiDetectors.forEach(detector => {
      contentTypes.forEach(type => {
        keywords.add(`${verb}-${detector}-${type}`);
      });
    });
  });

  // 16. Detector comparisons (91 keywords)
  // e.g., "turnitin-vs-gptzero", "quillbot-alternative"
  aiDetectors.forEach((detector1, i) => {
    aiDetectors.slice(i + 1).forEach(detector2 => {
      keywords.add(`${detector1}-vs-${detector2}`);
    });
    comparisonPhrases.slice(2, 5).forEach(comp => {
      keywords.add(`${detector1}-${comp}`);
    });
  });

  // 17. Year-based keywords (1,260 keywords)
  // e.g., "ai-humanizer-2025", "bypass-turnitin-2025"
  years.forEach(year => {
    coreTerms.forEach(term => keywords.add(`${term}-${year}`));
    aiDetectors.forEach(detector => keywords.add(`bypass-${detector}-${year}`));
    actionVerbs.slice(0, 10).forEach(verb => keywords.add(`${verb}-ai-${year}`));
    contentTypes.forEach(type => keywords.add(`humanize-${type}-${year}`));
  });

  // 18. Time qualifiers (420 keywords)
  // e.g., "new-ai-humanizer", "latest-bypass-tool"
  timeQualifiers.forEach(time => {
    coreTerms.forEach(term => keywords.add(`${time}-${term}`));
    aiDetectors.forEach(detector => keywords.add(`${time}-${detector}-bypass`));
    contentTypes.forEach(type => keywords.add(`${time}-${type}-humanizer`));
  });

  // 19. Four-word long-tail keywords (14,700 keywords)
  // e.g., "free-bypass-turnitin-essay", "best-humanize-chatgpt-article"
  qualifiers.slice(0, 7).forEach(qual => {
    actionVerbs.slice(0, 10).forEach(verb => {
      aiDetectors.slice(0, 10).forEach(detector => {
        contentTypes.slice(0, 10).forEach(type => {
          keywords.add(`${qual}-${verb}-${detector}-${type}`);
        });
      });
    });
  });

  // 20. Use case specific long-tail (5,040 keywords)
  // e.g., "student-bypass-turnitin-essay", "writer-humanize-article"
  useCases.forEach(useCase => {
    actionVerbs.slice(0, 10).forEach(verb => {
      aiDetectors.slice(0, 7).forEach(detector => {
        contentTypes.slice(0, 6).forEach(type => {
          keywords.add(`${useCase}-${verb}-${detector}-${type}`);
        });
      });
    });
  });

  // 21. Additional specific combinations to reach 40k (remaining ~19,500)
  // Platform-specific keywords
  const platforms = ['chatgpt', 'claude', 'gemini', 'bard', 'copilot', 'jasper', 'writesonic', 'rytr', 'copy-ai'];
  platforms.forEach(platform => {
    keywords.add(platform);
    keywords.add(`${platform}-humanizer`);
    keywords.add(`humanize-${platform}`);
    keywords.add(`${platform}-detector`);
    keywords.add(`bypass-${platform}-detection`);
    keywords.add(`${platform}-text-converter`);
    keywords.add(`${platform}-to-human`);
    
    actionVerbs.forEach(verb => {
      keywords.add(`${verb}-${platform}`);
      keywords.add(`${verb}-${platform}-text`);
      contentTypes.forEach(type => {
        keywords.add(`${verb}-${platform}-${type}`);
      });
    });
    
    qualifiers.forEach(qual => {
      keywords.add(`${qual}-${platform}-humanizer`);
      keywords.add(`${qual}-${platform}-tool`);
      contentTypes.forEach(type => {
        keywords.add(`${qual}-${platform}-${type}`);
      });
    });
  });

  // Educational institution keywords
  const institutions = ['university', 'college', 'school', 'academic', 'education', 'student', 'teacher', 'professor'];
  institutions.forEach(inst => {
    keywords.add(`${inst}-humanizer`);
    keywords.add(`${inst}-ai-tool`);
    actionVerbs.forEach(verb => {
      keywords.add(`${inst}-${verb}`);
      contentTypes.forEach(type => {
        keywords.add(`${inst}-${verb}-${type}`);
        keywords.add(`${verb}-${inst}-${type}`);
      });
    });
    aiDetectors.forEach(detector => {
      keywords.add(`${inst}-bypass-${detector}`);
      keywords.add(`${detector}-for-${inst}`);
    });
  });

  // Feature-based keywords
  const features = ['undetectable', 'invisible', 'stealth', 'hidden', 'secure', 'safe', 'reliable', 'accurate', 'professional', 'premium', 'advanced', 'smart'];
  features.forEach(feature => {
    keywords.add(`${feature}-ai`);
    keywords.add(`${feature}-humanizer`);
    keywords.add(`${feature}-tool`);
    keywords.add(`${feature}-converter`);
    contentTypes.forEach(type => {
      keywords.add(`${feature}-${type}`);
      keywords.add(`make-${type}-${feature}`);
      keywords.add(`${feature}-${type}-humanizer`);
    });
    aiDetectors.forEach(detector => {
      keywords.add(`${feature}-${detector}-bypass`);
    });
  });

  // Language-specific keywords
  const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic', 'portuguese', 'russian', 'hindi'];
  languages.forEach(lang => {
    keywords.add(`${lang}-humanizer`);
    keywords.add(`${lang}-ai-humanizer`);
    keywords.add(`humanize-${lang}-text`);
    contentTypes.slice(0, 10).forEach(type => {
      keywords.add(`${lang}-${type}-humanizer`);
      keywords.add(`humanize-${lang}-${type}`);
    });
  });

  // Industry-specific keywords
  const industries = ['marketing', 'seo', 'copywriting', 'blogging', 'journalism', 'technical-writing', 'creative-writing', 'business-writing'];
  industries.forEach(industry => {
    keywords.add(`${industry}-humanizer`);
    keywords.add(`${industry}-ai-tool`);
    keywords.add(`ai-for-${industry}`);
    contentTypes.slice(0, 10).forEach(type => {
      keywords.add(`${industry}-${type}-humanizer`);
      keywords.add(`${industry}-${type}-tool`);
    });
    actionVerbs.slice(0, 10).forEach(verb => {
      keywords.add(`${industry}-${verb}-tool`);
    });
  });

  // Problem-solution keywords
  const problems = ['detected', 'flagged', 'caught', 'identified', 'marked', 'rejected', 'failed'];
  problems.forEach(problem => {
    keywords.add(`ai-${problem}`);
    keywords.add(`${problem}-by-turnitin`);
    keywords.add(`${problem}-by-gptzero`);
    keywords.add(`fix-${problem}-ai`);
    keywords.add(`avoid-getting-${problem}`);
    contentTypes.slice(0, 10).forEach(type => {
      keywords.add(`${type}-${problem}-as-ai`);
      keywords.add(`fix-${problem}-${type}`);
    });
  });

  // Benefit-focused keywords
  const benefits = ['fast', 'instant', 'quick', 'easy', 'simple', 'powerful', 'effective', 'guaranteed', 'proven', 'tested'];
  benefits.forEach(benefit => {
    keywords.add(`${benefit}-humanizer`);
    keywords.add(`${benefit}-ai-humanizer`);
    keywords.add(`${benefit}-bypass-tool`);
    contentTypes.slice(0, 10).forEach(type => {
      keywords.add(`${benefit}-${type}-humanizer`);
      keywords.add(`${benefit}-humanize-${type}`);
    });
    aiDetectors.slice(0, 10).forEach(detector => {
      keywords.add(`${benefit}-bypass-${detector}`);
    });
  });

  // Price-point keywords
  const pricePoints = ['free', 'cheap', 'affordable', 'budget', 'premium', 'pro', 'unlimited'];
  pricePoints.forEach(price => {
    keywords.add(`${price}-humanizer`);
    keywords.add(`${price}-ai-humanizer`);
    keywords.add(`${price}-bypass-tool`);
    contentTypes.forEach(type => {
      keywords.add(`${price}-${type}-humanizer`);
      keywords.add(`${price}-humanize-${type}`);
    });
    aiDetectors.forEach(detector => {
      keywords.add(`${price}-bypass-${detector}`);
      keywords.add(`${price}-${detector}-alternative`);
    });
  });

  // Format-specific keywords
  const formats = ['pdf', 'docx', 'txt', 'doc', 'markdown', 'html'];
  formats.forEach(format => {
    keywords.add(`${format}-humanizer`);
    keywords.add(`humanize-${format}`);
    keywords.add(`${format}-to-human-text`);
    keywords.add(`convert-${format}-to-human`);
    contentTypes.slice(0, 10).forEach(type => {
      keywords.add(`${format}-${type}-humanizer`);
    });
  });

  // Technique-based keywords
  const techniques = ['paraphrase', 'rewrite', 'rephrase', 'restructure', 'modify', 'edit', 'improve', 'enhance', 'optimize'];
  techniques.forEach(tech => {
    keywords.add(`${tech}-ai-text`);
    keywords.add(`${tech}-tool`);
    keywords.add(`ai-${tech}-tool`);
    contentTypes.forEach(type => {
      keywords.add(`${tech}-${type}`);
      keywords.add(`${tech}-${type}-tool`);
      keywords.add(`ai-${tech}-${type}`);
    });
  });

  // Comparison and alternative keywords
  aiDetectors.forEach(detector => {
    keywords.add(`${detector}-alternative`);
    keywords.add(`${detector}-competitor`);
    keywords.add(`better-than-${detector}`);
    keywords.add(`${detector}-replacement`);
    keywords.add(`instead-of-${detector}`);
  });

  // Question-based keywords (high search intent)
  const questionWords = ['what-is', 'how-does', 'why-use', 'when-to-use', 'where-to-find', 'which-is-best'];
  questionWords.forEach(q => {
    keywords.add(`${q}-ai-humanizer`);
    keywords.add(`${q}-humanifylab`);
    aiDetectors.slice(0, 10).forEach(detector => {
      keywords.add(`${q}-${detector}`);
    });
  });

  // Review and rating keywords
  const reviewTerms = ['review', 'reviews', 'rating', 'ratings', 'testimonial', 'feedback'];
  reviewTerms.forEach(term => {
    keywords.add(`humanifylab-${term}`);
    keywords.add(`ai-humanizer-${term}`);
    aiDetectors.slice(0, 10).forEach(detector => {
      keywords.add(`${detector}-${term}`);
    });
  });

  // Additional combinations to reach 40,000
  // Five-word ultra long-tail keywords (11,365+ keywords)
  qualifiers.slice(0, 5).forEach(qual => {
    actionVerbs.slice(0, 7).forEach(verb => {
      aiDetectors.slice(0, 13).forEach(detector => {
        contentTypes.slice(0, 5).forEach(type => {
          useCases.slice(0, 5).forEach(useCase => {
            keywords.add(`${qual}-${verb}-${detector}-${type}-${useCase}`);
          });
        });
      });
    });
  });

  return Array.from(keywords);
}

// Generate and save keywords
console.log('🚀 Generating 40,000 professional SEO keywords...\n');

const keywords = generateKeywords();

console.log(`✓ Generated ${keywords.length.toLocaleString()} unique keywords\n`);

// Trim to exactly 40,000 if we have more
const finalKeywords = keywords.slice(0, 40000);

console.log(`📊 Final count: ${finalKeywords.length.toLocaleString()} keywords\n`);

// Save to JSON
const outputPath = join(process.cwd(), 'public', 'data', 'keywords.json');
writeFileSync(outputPath, JSON.stringify(finalKeywords, null, 0), 'utf-8');

console.log(`✅ Saved to: ${outputPath}`);
console.log(`📦 File size: ${(JSON.stringify(finalKeywords).length / 1024 / 1024).toFixed(2)} MB\n`);

// Show sample keywords
console.log('📝 Sample keywords:');
console.log('   ' + finalKeywords.slice(0, 20).join('\n   '));
console.log('   ...\n');

console.log('✅ Keyword generation complete!');
