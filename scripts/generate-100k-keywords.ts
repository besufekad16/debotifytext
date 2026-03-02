/**
 * Generate 500,000+ SEO Keywords for Programmatic SEO
 * 
 * This script generates a massive keyword list by combining:
 * - Actions (humanize, bypass, convert, etc.)
 * - Content types (essay, article, blog, etc.)
 * - Modifiers (free, best, online, etc.)
 * - Use cases (students, writers, businesses, etc.)
 * - AI detectors (turnitin, gptzero, etc.)
 * - And many more combinations!
 */

// Base actions - EXPANDED
const actions = [
  'humanize', 'bypass', 'convert', 'transform', 'rewrite', 'paraphrase',
  'make undetectable', 'hide', 'disguise', 'modify', 'change', 'improve',
  'enhance', 'optimize', 'fix', 'edit', 'adjust', 'refine', 'polish',
  'rephrase', 'revise', 'alter', 'adapt', 'upgrade', 'perfect', 'correct',
  'update', 'regenerate', 'recreate', 'remake', 'redo', 'rework', 'revamp'
];

// Content types - EXPANDED
const contentTypes = [
  'ai text', 'chatgpt text', 'ai content', 'ai writing', 'ai essay',
  'ai article', 'ai blog', 'ai copy', 'ai report', 'ai assignment',
  'ai paper', 'ai document', 'ai paragraph', 'ai sentence', 'ai words',
  'gpt text', 'gpt content', 'gpt writing', 'claude text', 'gemini text',
  'essay', 'article', 'blog post', 'content', 'writing', 'copy',
  'report', 'assignment', 'paper', 'document', 'thesis', 'dissertation',
  'research paper', 'term paper', 'case study', 'white paper', 'ebook',
  'manuscript', 'proposal', 'presentation', 'speech', 'script', 'story',
  'novel', 'book', 'chapter', 'section', 'page', 'post', 'comment',
  'review', 'description', 'summary', 'abstract', 'introduction', 'conclusion'
];

// Modifiers - EXPANDED
const modifiers = [
  'free', 'online', 'best', 'top', 'professional', 'advanced',
  'simple', 'easy', 'quick', 'fast', 'instant', 'automatic',
  'powerful', 'effective', 'reliable', 'accurate', 'premium',
  'unlimited', 'no signup', 'no registration', 'anonymous',
  'cheap', 'affordable', 'budget', 'quality', 'high quality',
  'trusted', 'verified', 'certified', 'recommended', 'popular',
  'trending', 'new', 'latest', 'modern', 'smart', 'intelligent'
];

// Use cases / audiences - EXPANDED
const useCases = [
  'for students', 'for writers', 'for bloggers', 'for businesses',
  'for marketers', 'for content creators', 'for academics', 'for researchers',
  'for professionals', 'for freelancers', 'for agencies', 'for seo',
  'for essays', 'for articles', 'for blogs', 'for websites',
  'for assignments', 'for homework', 'for papers', 'for reports',
  'for college', 'for university', 'for school', 'for teachers',
  'for professors', 'for authors', 'for journalists', 'for copywriters',
  'for entrepreneurs', 'for startups', 'for enterprises', 'for teams'
];

// AI Detectors - EXPANDED
const detectors = [
  'turnitin', 'gptzero', 'originality.ai', 'copyleaks', 'zerogpt',
  'writer', 'sapling', 'crossplag', 'contentatscale', 'quillbot',
  'ai detector', 'ai detection', 'plagiarism checker', 'ai checker',
  'winston ai', 'scribbr', 'grammarly', 'copyscape', 'plagscan',
  'unicheck', 'compilatio', 'ephorus', 'viper', 'duplichecker'
];

// Question words
const questions = [
  'how to', 'what is', 'why use', 'when to use', 'where to find',
  'can i', 'should i', 'will it', 'does it', 'is it possible to'
];

// Comparison keywords
const comparisons = [
  'vs', 'versus', 'compared to', 'better than', 'alternative to',
  'instead of', 'replacement for', 'similar to'
];

// Generate keywords
function generateKeywords(): string[] {
  const keywords: string[] = [];
  
  console.log('Generating 500,000+ keywords...\n');
  
  // 1. Action + Content Type (18 * 32 = 576)
  for (const action of actions) {
    for (const content of contentTypes) {
      keywords.push(`${action} ${content}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} action + content keywords`);
  
  // 2. Modifier + Action + Content Type (20 * 18 * 32 = 11,520)
  for (const modifier of modifiers) {
    for (const action of actions) {
      for (const content of contentTypes.slice(0, 16)) { // Use half to avoid too many
        keywords.push(`${modifier} ${action} ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 3. Action + Content Type + Use Case (18 * 32 * 20 = 11,520)
  for (const action of actions) {
    for (const content of contentTypes.slice(0, 16)) {
      for (const useCase of useCases) {
        keywords.push(`${action} ${content} ${useCase}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 4. Action + Detector (18 * 14 = 252)
  for (const action of actions) {
    for (const detector of detectors) {
      keywords.push(`${action} ${detector}`);
      keywords.push(`${action} ${detector} detector`);
      keywords.push(`bypass ${detector}`);
      keywords.push(`pass ${detector}`);
      keywords.push(`beat ${detector}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 5. Question + Action + Content (6 * 18 * 16 = 1,728)
  for (const question of questions) {
    for (const action of actions) {
      for (const content of contentTypes.slice(0, 16)) {
        keywords.push(`${question} ${action} ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 6. Detector-specific keywords (14 * 100 = 1,400)
  for (const detector of detectors) {
    keywords.push(`${detector} bypass`);
    keywords.push(`${detector} bypass tool`);
    keywords.push(`${detector} bypass free`);
    keywords.push(`${detector} humanizer`);
    keywords.push(`${detector} ai humanizer`);
    keywords.push(`how to bypass ${detector}`);
    keywords.push(`how to pass ${detector}`);
    keywords.push(`how to beat ${detector}`);
    keywords.push(`${detector} detection bypass`);
    keywords.push(`${detector} ai detection bypass`);
    
    for (const content of contentTypes.slice(0, 10)) {
      keywords.push(`${detector} ${content}`);
      keywords.push(`bypass ${detector} with ${content}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 7. Long-tail combinations (Modifier + Action + Content + Use Case)
  for (const modifier of modifiers.slice(0, 10)) {
    for (const action of actions.slice(0, 10)) {
      for (const content of contentTypes.slice(0, 10)) {
        for (const useCase of useCases.slice(0, 10)) {
          keywords.push(`${modifier} ${action} ${content} ${useCase}`);
        }
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 8. Tool-specific keywords
  const toolKeywords = [
    'ai humanizer tool',
    'ai text humanizer',
    'chatgpt humanizer',
    'ai content humanizer',
    'ai writing humanizer',
    'ai detector bypass tool',
    'undetectable ai tool',
    'ai to human converter',
    'ai text converter',
    'make ai text human',
    'humanize ai generated text',
    'convert ai to human text',
    'ai paraphrasing tool',
    'ai rewriting tool',
    'ai text transformer'
  ];
  
  // Expand tool keywords with modifiers and use cases
  for (const tool of toolKeywords) {
    keywords.push(tool);
    for (const modifier of modifiers) {
      keywords.push(`${modifier} ${tool}`);
    }
    for (const useCase of useCases) {
      keywords.push(`${tool} ${useCase}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 9. Comparison keywords
  const competitors = [
    'quillbot', 'grammarly', 'wordtune', 'jasper', 'copy.ai',
    'writesonic', 'rytr', 'anyword', 'peppertype', 'shortly.ai'
  ];
  
  for (const competitor of competitors) {
    for (const comparison of comparisons) {
      keywords.push(`unrobotic text ${comparison} ${competitor}`);
      keywords.push(`ai humanizer ${comparison} ${competitor}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 10. Location-based keywords (for local SEO)
  const locations = [
    'usa', 'uk', 'canada', 'australia', 'india', 'germany', 'france',
    'spain', 'italy', 'netherlands', 'sweden', 'norway', 'denmark'
  ];
  
  for (const location of locations) {
    keywords.push(`ai humanizer ${location}`);
    keywords.push(`ai humanizer in ${location}`);
    keywords.push(`best ai humanizer ${location}`);
    keywords.push(`free ai humanizer ${location}`);
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 11. Year-based keywords (2024-2030)
  const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  for (const year of years) {
    for (const action of actions.slice(0, 10)) {
      for (const content of contentTypes.slice(0, 10)) {
        keywords.push(`${action} ${content} ${year}`);
        keywords.push(`best ${action} ${content} ${year}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 12. Industry-specific keywords
  const industries = [
    'education', 'marketing', 'business', 'academic', 'professional',
    'ecommerce', 'blogging', 'journalism', 'copywriting', 'seo',
    'content marketing', 'social media', 'email marketing', 'advertising'
  ];
  
  for (const industry of industries) {
    for (const action of actions.slice(0, 10)) {
      keywords.push(`${action} ai text for ${industry}`);
      keywords.push(`ai humanizer for ${industry}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 13. Feature-based keywords
  const features = [
    'bulk', 'batch', 'api', 'chrome extension', 'wordpress plugin',
    'unlimited', 'no limit', 'fast', 'instant', 'real-time',
    'advanced', 'premium', 'pro', 'enterprise', 'team'
  ];
  
  for (const feature of features) {
    keywords.push(`${feature} ai humanizer`);
    keywords.push(`ai humanizer with ${feature}`);
    keywords.push(`${feature} ai text converter`);
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 14. Problem-solution keywords
  const problems = [
    'detected by turnitin', 'detected by gptzero', 'flagged as ai',
    'caught by ai detector', 'rejected by professor', 'failed ai check',
    'marked as ai', 'identified as ai', 'spotted as ai'
  ];
  
  for (const problem of problems) {
    keywords.push(`fix ${problem}`);
    keywords.push(`solve ${problem}`);
    keywords.push(`avoid ${problem}`);
    keywords.push(`prevent ${problem}`);
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 15. Massive expansion with all combinations
  const shortActions = ['humanize', 'bypass', 'convert', 'rewrite', 'fix'];
  const shortContent = ['ai text', 'chatgpt', 'ai content', 'ai writing', 'essay'];
  const shortModifiers = ['free', 'best', 'online', 'fast', 'easy'];
  
  for (const mod1 of shortModifiers) {
    for (const act of shortActions) {
      for (const cont of shortContent) {
        for (const mod2 of shortModifiers) {
          if (mod1 !== mod2) {
            keywords.push(`${mod1} ${mod2} ${act} ${cont}`);
          }
        }
        for (const useCase of useCases.slice(0, 10)) {
          keywords.push(`${mod1} ${act} ${cont} ${useCase}`);
        }
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 16. Expand with all action + content + modifier + use case combinations
  for (const action of actions) {
    for (const content of contentTypes) {
      for (const modifier of modifiers) {
        keywords.push(`${modifier} ${action} ${content}`);
        keywords.push(`${action} ${modifier} ${content}`);
        keywords.push(`${action} ${content} ${modifier}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 17. Triple combinations (action + content + detector)
  for (const action of actions) {
    for (const content of contentTypes) {
      for (const detector of detectors) {
        keywords.push(`${action} ${content} ${detector}`);
        keywords.push(`${action} ${content} to bypass ${detector}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 18. Question-based long-tail keywords
  for (const question of questions) {
    for (const action of actions) {
      for (const detector of detectors) {
        keywords.push(`${question} ${action} ${detector}`);
        keywords.push(`${question} bypass ${detector}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 19. Add more content type variations
  const additionalContent = [
    'text', 'content', 'writing', 'copy', 'words', 'sentences', 'paragraphs',
    'document', 'file', 'manuscript', 'draft', 'script', 'post', 'message'
  ];
  
  for (const action of actions) {
    for (const content of additionalContent) {
      for (const modifier of modifiers) {
        keywords.push(`${action} ${content}`);
        keywords.push(`${modifier} ${action} ${content}`);
        keywords.push(`${action} ${content} ${modifier}`);
        keywords.push(`${action} ai ${content}`);
        keywords.push(`${action} chatgpt ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 20. Final expansion - all possible 2-word combinations
  const allTerms = [
    ...actions.slice(0, 15),
    ...contentTypes.slice(0, 20),
    ...modifiers.slice(0, 15),
    ...detectors.slice(0, 10),
    'tool', 'software', 'app', 'platform', 'service', 'solution',
    'generator', 'maker', 'creator', 'builder', 'helper', 'assistant'
  ];
  
  for (let i = 0; i < allTerms.length; i++) {
    for (let j = i + 1; j < allTerms.length; j++) {
      keywords.push(`${allTerms[i]} ${allTerms[j]}`);
      keywords.push(`${allTerms[j]} ${allTerms[i]}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 21. Add branded variations
  const brandTerms = ['unrobotic', 'unrobotic text', 'ai humanizer', 'humanizer'];
  const actionWords = ['use', 'try', 'download', 'get', 'access', 'start', 'begin'];
  
  for (const brand of brandTerms) {
    for (const action of actionWords) {
      keywords.push(`${action} ${brand}`);
      keywords.push(`${brand} ${action}`);
      keywords.push(`how to ${action} ${brand}`);
    }
    for (const modifier of modifiers.slice(0, 10)) {
      keywords.push(`${modifier} ${brand}`);
      keywords.push(`${brand} ${modifier}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 22. Add more detector-specific long-tail keywords
  for (const detector of detectors) {
    for (const content of contentTypes.slice(0, 15)) {
      for (const modifier of modifiers.slice(0, 10)) {
        keywords.push(`${modifier} ${detector} bypass for ${content}`);
        keywords.push(`${detector} ${content} bypass`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // Remove duplicates and clean
  const uniqueKeywords = [...new Set(keywords)]
    .map(k => k.toLowerCase().trim())
    .filter(k => k.length > 5 && k.length < 100);
  
  console.log(`\n✅ Final count: ${uniqueKeywords.length} unique keywords`);
  
  return uniqueKeywords;
}

// Generate and save
const keywords = generateKeywords();

// Export as TypeScript array
const tsContent = `// Auto-generated SEO keywords - ${new Date().toISOString()}
// Total: ${keywords.length} keywords

const seoKeywords = ${JSON.stringify(keywords, null, 2)};

export default seoKeywords;
`;

// Save to file
import { writeFileSync } from 'fs';
writeFileSync('src/seo-keywords-100k.ts', tsContent);

console.log('\n✅ Keywords saved to: src/seo-keywords-100k.ts');
console.log(`📊 Total keywords generated: ${keywords.length}`);

  // 23. Add suffix variations to reach 100k+
  const suffixes = ['2024', '2025', '2026', 'online', 'free', 'tool', 'app'];
  const baseTerms = ['ai humanizer', 'humanize ai', 'bypass ai', 'ai detector', 'ai text'];
  
  for (const base of baseTerms) {
    for (const suffix of suffixes) {
      for (const modifier of modifiers.slice(0, 10)) {
        keywords.push(`${base} ${suffix}`);
        keywords.push(`${modifier} ${base} ${suffix}`);
        keywords.push(`${base} ${modifier} ${suffix}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 24. MASSIVE EXPANSION - All action + all content combinations
  for (const action of actions) {
    for (const content of contentTypes) {
      keywords.push(`${action} ${content}`);
      keywords.push(`${content} ${action}`);
      keywords.push(`how to ${action} ${content}`);
      keywords.push(`${action} ${content} online`);
      keywords.push(`${action} ${content} free`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 25. Triple modifier combinations
  for (const mod1 of modifiers) {
    for (const mod2 of modifiers) {
      for (const action of actions.slice(0, 15)) {
        if (mod1 !== mod2) {
          keywords.push(`${mod1} ${mod2} ${action}`);
          keywords.push(`${mod1} ${mod2} ai humanizer`);
          keywords.push(`${mod1} ${mod2} ai text converter`);
        }
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 26. All detectors with all actions
  for (const detector of detectors) {
    for (const action of actions) {
      keywords.push(`${action} ${detector}`);
      keywords.push(`${detector} ${action}`);
      keywords.push(`${action} to bypass ${detector}`);
      keywords.push(`${action} to pass ${detector}`);
      keywords.push(`${action} to beat ${detector}`);
      keywords.push(`${action} to avoid ${detector}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 27. All use cases with all modifiers
  for (const useCase of useCases) {
    for (const modifier of modifiers) {
      keywords.push(`${modifier} ai humanizer ${useCase}`);
      keywords.push(`${modifier} humanize ai ${useCase}`);
      keywords.push(`${modifier} bypass ai ${useCase}`);
      keywords.push(`ai humanizer ${modifier} ${useCase}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 28. Location + Action + Content combinations
  const locations = [
    'usa', 'uk', 'canada', 'australia', 'india', 'germany', 'france',
    'spain', 'italy', 'netherlands', 'sweden', 'norway', 'denmark',
    'new york', 'london', 'toronto', 'sydney', 'mumbai', 'berlin',
    'paris', 'madrid', 'rome', 'amsterdam', 'stockholm', 'oslo'
  ];
  
  for (const location of locations) {
    for (const action of actions.slice(0, 15)) {
      for (const content of contentTypes.slice(0, 20)) {
        keywords.push(`${action} ${content} ${location}`);
        keywords.push(`${action} ${content} in ${location}`);
        keywords.push(`${location} ${action} ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 29. Year + Action + Content + Modifier combinations
  const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  for (const year of years) {
    for (const action of actions) {
      for (const content of contentTypes.slice(0, 20)) {
        for (const modifier of modifiers.slice(0, 15)) {
          keywords.push(`${modifier} ${action} ${content} ${year}`);
          keywords.push(`${action} ${content} ${year}`);
          keywords.push(`${year} ${action} ${content}`);
        }
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 30. Industry + Action + Content combinations
  const industries = [
    'education', 'marketing', 'business', 'academic', 'professional',
    'ecommerce', 'blogging', 'journalism', 'copywriting', 'seo',
    'content marketing', 'social media', 'email marketing', 'advertising',
    'healthcare', 'finance', 'legal', 'technology', 'real estate',
    'travel', 'food', 'fashion', 'sports', 'entertainment', 'gaming'
  ];
  
  for (const industry of industries) {
    for (const action of actions) {
      for (const content of contentTypes.slice(0, 20)) {
        keywords.push(`${action} ${content} for ${industry}`);
        keywords.push(`${industry} ${action} ${content}`);
        keywords.push(`${industry} ai humanizer`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 31. Platform-specific keywords
  const platforms = [
    'wordpress', 'shopify', 'wix', 'squarespace', 'medium', 'substack',
    'ghost', 'blogger', 'tumblr', 'linkedin', 'facebook', 'twitter',
    'instagram', 'tiktok', 'youtube', 'reddit', 'quora', 'pinterest'
  ];
  
  for (const platform of platforms) {
    for (const action of actions.slice(0, 15)) {
      keywords.push(`${action} ai text for ${platform}`);
      keywords.push(`${platform} ai humanizer`);
      keywords.push(`ai humanizer for ${platform}`);
      keywords.push(`${platform} ${action} ai content`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 32. Language-specific keywords
  const languages = [
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
    'dutch', 'russian', 'chinese', 'japanese', 'korean', 'arabic',
    'hindi', 'bengali', 'urdu', 'indonesian', 'vietnamese', 'thai'
  ];
  
  for (const language of languages) {
    for (const action of actions.slice(0, 15)) {
      keywords.push(`${action} ai text in ${language}`);
      keywords.push(`${language} ai humanizer`);
      keywords.push(`ai humanizer ${language}`);
      keywords.push(`humanize ai ${language}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 33. Price-point keywords
  const pricePoints = [
    'free', 'cheap', 'affordable', 'budget', 'premium', 'pro',
    'enterprise', 'unlimited', 'pay as you go', 'subscription',
    'one time payment', 'lifetime deal', 'discount', 'trial'
  ];
  
  for (const price of pricePoints) {
    for (const action of actions.slice(0, 15)) {
      for (const content of contentTypes.slice(0, 15)) {
        keywords.push(`${price} ${action} ${content}`);
        keywords.push(`${price} ai humanizer`);
        keywords.push(`${action} ${content} ${price}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 34. Feature combinations
  const features = [
    'bulk', 'batch', 'api', 'chrome extension', 'wordpress plugin',
    'unlimited', 'no limit', 'fast', 'instant', 'real-time',
    'advanced', 'premium', 'pro', 'enterprise', 'team',
    'collaborative', 'cloud based', 'offline', 'mobile', 'desktop'
  ];
  
  for (const feature of features) {
    for (const action of actions.slice(0, 15)) {
      for (const content of contentTypes.slice(0, 15)) {
        keywords.push(`${feature} ${action} ${content}`);
        keywords.push(`${action} ${content} ${feature}`);
        keywords.push(`${feature} ai humanizer`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 35. Problem + Solution combinations
  const problems = [
    'detected by turnitin', 'detected by gptzero', 'flagged as ai',
    'caught by ai detector', 'rejected by professor', 'failed ai check',
    'marked as ai', 'identified as ai', 'spotted as ai',
    'ai score too high', 'looks like ai', 'sounds robotic',
    'not human enough', 'too perfect', 'lacks personality'
  ];
  
  for (const problem of problems) {
    for (const action of actions.slice(0, 10)) {
      keywords.push(`fix ${problem}`);
      keywords.push(`solve ${problem}`);
      keywords.push(`avoid ${problem}`);
      keywords.push(`prevent ${problem}`);
      keywords.push(`${action} text ${problem}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);

  
  // 36. AI Model-specific keywords
  const aiModels = [
    'chatgpt', 'gpt-4', 'gpt-3.5', 'claude', 'claude 3', 'gemini',
    'bard', 'llama', 'mistral', 'palm', 'copilot', 'jasper',
    'writesonic', 'copy.ai', 'rytr', 'anyword', 'shortly.ai'
  ];
  
  for (const model of aiModels) {
    for (const action of actions) {
      for (const content of contentTypes.slice(0, 20)) {
        keywords.push(`${action} ${model} ${content}`);
        keywords.push(`${model} ${content} ${action}`);
        keywords.push(`${action} ${model} generated ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 37. Comparison keywords - all competitors
  const competitors = [
    'quillbot', 'grammarly', 'wordtune', 'jasper', 'copy.ai',
    'writesonic', 'rytr', 'anyword', 'peppertype', 'shortly.ai',
    'undetectable.ai', 'hix bypass', 'stealthwriter', 'humbot',
    'paraphraser', 'spinbot', 'article rewriter', 'text spinner'
  ];
  
  for (const competitor of competitors) {
    for (const comparison of comparisons) {
      for (const modifier of modifiers.slice(0, 10)) {
        keywords.push(`unrobotic text ${comparison} ${competitor}`);
        keywords.push(`ai humanizer ${comparison} ${competitor}`);
        keywords.push(`${modifier} ${competitor} alternative`);
        keywords.push(`${competitor} ${comparison} unrobotic text`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 38. Intent-based keywords
  const intents = [
    'review', 'tutorial', 'guide', 'comparison', 'alternative',
    'vs', 'pricing', 'features', 'benefits', 'pros and cons',
    'how it works', 'demo', 'example', 'case study', 'testimonial'
  ];
  
  for (const intent of intents) {
    for (const action of actions.slice(0, 15)) {
      for (const content of contentTypes.slice(0, 15)) {
        keywords.push(`${action} ${content} ${intent}`);
        keywords.push(`ai humanizer ${intent}`);
        keywords.push(`${intent} ${action} ${content}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 39. Quality descriptors
  const qualities = [
    'high quality', 'best quality', 'premium quality', 'professional quality',
    'natural', 'authentic', 'genuine', 'original', 'unique',
    'undetectable', 'invisible', 'hidden', 'disguised', 'masked',
    'perfect', 'flawless', 'seamless', 'smooth', 'polished'
  ];
  
  for (const quality of qualities) {
    for (const action of actions.slice(0, 15)) {
      for (const content of contentTypes.slice(0, 15)) {
        keywords.push(`${quality} ${action} ${content}`);
        keywords.push(`${action} ${content} ${quality}`);
        keywords.push(`${quality} ai humanizer`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 40. Time-based keywords
  const timeframes = [
    'instant', 'quick', 'fast', 'rapid', 'immediate', 'real-time',
    '1 minute', '5 minutes', '10 minutes', 'same day', 'overnight',
    '24 hours', '48 hours', 'within seconds', 'in minutes'
  ];
  
  for (const time of timeframes) {
    for (const action of actions.slice(0, 15)) {
      keywords.push(`${time} ${action} ai text`);
      keywords.push(`${action} ai text ${time}`);
      keywords.push(`${time} ai humanizer`);
      keywords.push(`ai humanizer ${time}`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 41. Device-specific keywords
  const devices = [
    'mobile', 'desktop', 'tablet', 'iphone', 'android',
    'ipad', 'mac', 'windows', 'linux', 'chromebook'
  ];
  
  for (const device of devices) {
    for (const action of actions.slice(0, 15)) {
      keywords.push(`${action} ai text on ${device}`);
      keywords.push(`${device} ai humanizer`);
      keywords.push(`ai humanizer for ${device}`);
      keywords.push(`${device} ${action} ai content`);
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 42. Massive 4-word combinations
  for (const mod1 of modifiers.slice(0, 10)) {
    for (const mod2 of modifiers.slice(0, 10)) {
      for (const action of actions.slice(0, 10)) {
        for (const content of contentTypes.slice(0, 10)) {
          if (mod1 !== mod2) {
            keywords.push(`${mod1} ${mod2} ${action} ${content}`);
          }
        }
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
  
  // 43. All possible detector + content + action combinations
  for (const detector of detectors) {
    for (const content of contentTypes) {
      for (const action of actions.slice(0, 15)) {
        keywords.push(`${action} ${content} to bypass ${detector}`);
        keywords.push(`bypass ${detector} with ${content}`);
        keywords.push(`${detector} ${content} ${action}`);
      }
    }
  }
  console.log(`✓ Generated ${keywords.length} total keywords`);
