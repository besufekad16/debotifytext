import type { KeywordData } from './pseo-keywords';

export interface SEOContent {
  title: string;
  description: string;
  h1: string;
  heroText: string;
  introText: string; // New: Longer introduction
  features: Array<{ title: string; description: string; icon: string }>;
  comparison: Array<{ feature: string; humanifylab: string; competitors: string }>;
  faqs: Array<{ question: string; answer: string }>;
  testimonials: Array<{ name: string; role: string; text: string; rating: number }>;
  relatedKeywords: string[];
  howToSteps: Array<{ step: number; title: string; description: string }>; // New
  benefits: Array<{ title: string; description: string }>; // New
}

export function generateSEOContent(keywordData: KeywordData): SEOContent {
  const { keyword, category } = keywordData;
  const capitalizedKeyword = keyword
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: generateTitle(keyword, category),
    description: generateDescription(keyword, category),
    h1: generateH1(keyword, category),
    heroText: generateHeroText(keyword, category),
    introText: generateIntroText(keyword, category),
    features: generateFeatures(category),
    comparison: generateComparison(),
    faqs: generateFAQs(keyword, category),
    testimonials: generateTestimonials(),
    relatedKeywords: [],
    howToSteps: generateHowToSteps(keyword, category),
    benefits: generateBenefits(keyword, category)
  };
}

function generateTitle(keyword: string, category: KeywordData['category']): string {
  const templates = {
    humanizer: `${keyword} - HumanifyLab | 99.9% AI Detection Bypass`,
    'ai-tool': `${keyword} - Professional AI Humanization Tool | HumanifyLab`,
    brand: `${keyword} Alternative - Better AI Humanization | HumanifyLab`,
    'how-to': `${keyword} - Complete Guide 2025 | HumanifyLab`
  };
  
  return templates[category];
}

function generateDescription(keyword: string, category: KeywordData['category']): string {
  const templates = {
    humanizer: `Transform AI text with ${keyword}. Bypass all AI detectors with 99.9% success rate. Trusted by 450,000+ users. Free trial available.`,
    'ai-tool': `Professional ${keyword} for content creators. Advanced AI humanization technology. 3x faster than competitors. Try free today.`,
    brand: `Looking for ${keyword}? HumanifyLab offers superior AI detection bypass, faster processing, and better results. Join 450,000+ users.`,
    'how-to': `Learn ${keyword} with our comprehensive guide. Step-by-step instructions, expert tips, and proven strategies. Start humanizing today.`
  };
  
  return templates[category];
}

function generateH1(keyword: string, category: KeywordData['category']): string {
  const capitalizedKeyword = keyword
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const templates = {
    humanizer: `${capitalizedKeyword}: Transform AI Text Into Undetectable Human Writing`,
    'ai-tool': `Professional ${capitalizedKeyword} - Advanced AI Humanization`,
    brand: `${capitalizedKeyword} - The Superior Alternative for AI Humanization`,
    'how-to': `${capitalizedKeyword}: Complete Guide for 2025`
  };
  
  return templates[category];
}

function generateHeroText(keyword: string, category: KeywordData['category']): string {
  const templates = {
    humanizer: `Experience the most advanced AI humanization technology. Transform your AI-generated content into natural, undetectable human writing that bypasses all AI detectors with 99.9% success rate.`,
    'ai-tool': `Professional-grade AI humanization tool trusted by content creators, students, and businesses worldwide. Fast, reliable, and incredibly effective.`,
    brand: `Discover why 450,000+ users choose HumanifyLab over competitors. Superior AI detection bypass, 3x faster processing, and unmatched quality.`,
    'how-to': `Master the art of AI content humanization with our comprehensive guide. Learn proven techniques, best practices, and expert strategies.`
  };
  
  return templates[category];
}

function generateFeatures(category: KeywordData['category']) {
  return [
    {
      title: '⚡ Lightning Fast',
      description: '3x faster than competitors. Process thousands of words in seconds with our optimized AI engine.',
      icon: 'zap'
    },
    {
      title: '🎯 99.9% Success Rate',
      description: 'Bypass all major AI detectors including GPTZero, Turnitin, Originality.ai, and more.',
      icon: 'target'
    },
    {
      title: '👥 450,000+ Users',
      description: 'Trusted by students, writers, marketers, and businesses worldwide.',
      icon: 'users'
    },
    {
      title: '🔒 100% Secure',
      description: 'Your content is encrypted and never stored. Complete privacy guaranteed.',
      icon: 'lock'
    },
    {
      title: '💰 Best Value',
      description: 'Competitive pricing with generous free tier. No hidden fees or surprises.',
      icon: 'dollar-sign'
    },
    {
      title: '🌟 Premium Quality',
      description: 'Natural, human-like writing that maintains your original meaning and tone.',
      icon: 'star'
    }
  ];
}

function generateComparison() {
  return [
    {
      feature: 'AI Detection Bypass',
      humanifylab: '99.9% success rate',
      competitors: '85-90% success rate'
    },
    {
      feature: 'Processing Speed',
      humanifylab: '3x faster',
      competitors: 'Standard speed'
    },
    {
      feature: 'Natural Writing Quality',
      humanifylab: 'Premium quality',
      competitors: 'Good quality'
    },
    {
      feature: 'User Base',
      humanifylab: '450,000+ users',
      competitors: '50,000-100,000 users'
    },
    {
      feature: 'Customer Support',
      humanifylab: '24/7 support',
      competitors: 'Limited support'
    },
    {
      feature: 'Pricing',
      humanifylab: 'Best value',
      competitors: 'Higher prices'
    },
    {
      feature: 'Free Trial',
      humanifylab: 'Generous free tier',
      competitors: 'Limited or no free tier'
    }
  ];
}

function generateFAQs(keyword: string, category: KeywordData['category']) {
  return [
    {
      question: `What is ${keyword}?`,
      answer: `${keyword} refers to the process of transforming AI-generated text into natural, human-like writing that bypasses AI detection systems. HumanifyLab uses advanced algorithms to make your content undetectable while maintaining quality and meaning.`
    },
    {
      question: 'How does HumanifyLab work?',
      answer: 'Our AI humanization technology analyzes your text and applies sophisticated transformations to make it appear naturally written by humans. We use multiple techniques including sentence restructuring, vocabulary variation, and natural language patterns.'
    },
    {
      question: 'Is it really undetectable?',
      answer: 'Yes! Our 99.9% success rate means your humanized content will bypass all major AI detectors including GPTZero, Turnitin, Originality.ai, Copyleaks, and more. We continuously update our algorithms to stay ahead of detection systems.'
    },
    {
      question: 'How long does it take?',
      answer: 'Processing is incredibly fast - typically just a few seconds for most documents. Our optimized engine is 3x faster than competitors, allowing you to humanize large volumes of content quickly.'
    },
    {
      question: 'Is my content secure?',
      answer: 'Absolutely. Your content is encrypted during processing and never stored on our servers. We take privacy seriously and ensure complete confidentiality of your work.'
    }
  ];
}

function generateTestimonials() {
  return [
    {
      name: 'Sarah Johnson',
      role: 'Content Writer',
      text: 'HumanifyLab has been a game-changer for my workflow. The quality is outstanding and it saves me hours every week.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      text: 'We tested multiple AI humanizers and HumanifyLab consistently delivered the best results. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Graduate Student',
      text: 'Perfect for academic writing. The humanized text is natural and passes all detection checks. Worth every penny!',
      rating: 5
    }
  ];
}


function generateIntroText(keyword: string, category: KeywordData['category']): string {
  const templates = {
    humanizer: `Welcome to the ultimate guide on ${keyword}. In today's digital landscape, AI-generated content is everywhere, but it often lacks the natural flow and authenticity of human writing. That's where HumanifyLab comes in. Our advanced AI humanization technology transforms robotic, AI-generated text into natural, engaging content that reads like it was written by a human expert. Whether you're a student, content creator, marketer, or business professional, our tool helps you create content that bypasses all AI detectors while maintaining quality and meaning. With over 450,000 satisfied users worldwide and a 99.9% success rate, we're the trusted choice for AI content humanization.`,
    'ai-tool': `Discover the power of ${keyword} with HumanifyLab. Our professional-grade AI humanization platform is designed for serious content creators who demand the best. Unlike basic paraphrasing tools, we use sophisticated algorithms that understand context, tone, and style to produce genuinely human-like writing. Our technology has been tested against all major AI detectors including GPTZero, Turnitin, Originality.ai, and more, consistently achieving undetectable results. Join thousands of professionals who trust HumanifyLab for their content humanization needs.`,
    brand: `Looking for ${keyword}? You've come to the right place. HumanifyLab offers everything you need and more. While other tools may promise results, we deliver them consistently with our proven 99.9% success rate. Our platform is faster, more reliable, and produces higher quality output than any competitor. We've invested heavily in research and development to create the most advanced AI humanization technology available. Don't settle for less when you can have the best. Try HumanifyLab today and experience the difference.`,
    'how-to': `Learn ${keyword} with our comprehensive, step-by-step guide. AI content humanization doesn't have to be complicated. In this guide, we'll walk you through everything you need to know about transforming AI-generated text into natural, human-like writing. Whether you're new to AI humanization or looking to improve your results, you'll find valuable insights, practical tips, and proven strategies. Our approach is based on years of experience and feedback from over 450,000 users. Let's get started on your journey to creating undetectable, high-quality content.`
  };
  
  return templates[category];
}

function generateHowToSteps(keyword: string, category: KeywordData['category']) {
  return [
    {
      step: 1,
      title: 'Paste Your AI-Generated Text',
      description: 'Copy your AI-generated content from ChatGPT, Claude, Gemini, or any other AI tool and paste it into our editor. Our system accepts text of any length, from short paragraphs to full documents.'
    },
    {
      step: 2,
      title: 'Click the Humanize Button',
      description: 'Simply click the "Humanize" button and let our advanced AI technology work its magic. Our algorithms analyze your text and apply sophisticated transformations to make it sound naturally human.'
    },
    {
      step: 3,
      title: 'Review and Download',
      description: 'Review your humanized content and make any final adjustments. Once satisfied, download or copy your text. It\'s now ready to use and will bypass all AI detectors with 99.9% success rate.'
    },
    {
      step: 4,
      title: 'Use Your Content Confidently',
      description: 'Use your humanized content anywhere without worry. Whether for academic papers, blog posts, marketing copy, or business documents, your content will appear naturally written by a human.'
    }
  ];
}

function generateBenefits(keyword: string, category: KeywordData['category']) {
  return [
    {
      title: 'Save Time and Effort',
      description: 'Stop spending hours manually rewriting AI content. Our tool does it instantly, saving you valuable time that you can spend on more important tasks.'
    },
    {
      title: 'Maintain Quality and Meaning',
      description: 'Unlike simple paraphrasing tools, we preserve your original message and intent while making the text sound naturally human. No loss of meaning or context.'
    },
    {
      title: 'Bypass All AI Detectors',
      description: 'Our 99.9% success rate means your content will pass GPTZero, Turnitin, Originality.ai, Copyleaks, and all other major AI detection systems.'
    },
    {
      title: 'Improve Content Engagement',
      description: 'Human-like writing is more engaging and relatable. Your audience will connect better with content that sounds natural and authentic.'
    },
    {
      title: 'Boost SEO Rankings',
      description: 'Search engines favor natural, human-written content. Our humanized text helps improve your SEO performance and search rankings.'
    },
    {
      title: 'Risk-Free Usage',
      description: 'Your content is encrypted and never stored. We take privacy seriously and ensure complete confidentiality of your work.'
    }
  ];
}
