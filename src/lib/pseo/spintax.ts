export function seededRandom(seed: number): number {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function spin(text: string, seed: number): string {
  let currentSeed = seed;
  const regex = /\{([^{}]+)\}/g;
  
  let result = text;
  while (regex.test(result)) {
    result = result.replace(regex, (match, contents) => {
      const options = contents.split('|');
      const choice = options[Math.floor(seededRandom(currentSeed++) * options.length)];
      return choice;
    });
  }
  return result;
}

export const PAIN_POINTS = {
  academic: [
    "{fear of academic probation|anxiety over being expelled|stress of facing an academic integrity panel|the nightmare of an academic misconduct hearing}",
    "{failing a crucial class|getting a zero on the assignment|ruining your GPA|losing your scholarship over a false positive}",
    "{Turnitin false positives|getting flagged unfairly|professors trusting AI checkers too much|the burden of proving you wrote your own work}"
  ],
  seo: [
    "{Google algorithm penalties|losing your SERP rankings|traffic dropping to zero overnight|a manual action from Google}",
    "{clients rejecting your articles|getting fired by freelance clients|ruining your agency's reputation|losing contracts because of Originality.ai}",
    "{Google's Helpful Content Update|Originality.ai flagging your hard work|thin content penalties|the frustration of de-indexing}"
  ],
  general: [
    "{the frustration of sounding robotic|wasting hours rewriting by hand|the anxiety of being falsely accused|the dread of a false positive}",
    "{AI detectors guessing incorrectly|the stress of proving you wrote it|losing your authentic voice|relying on checkers that hallucinate scores}"
  ]
};

export function getPainPoint(roleContext: string, seed: number): string {
  let category = PAIN_POINTS.general;
  const ctx = roleContext.toLowerCase();
  if (ctx.includes("student") || ctx.includes("essay") || ctx.includes("teacher") || ctx.includes("academic") || ctx.includes("university")) {
    category = PAIN_POINTS.academic;
  } else if (ctx.includes("seo") || ctx.includes("writer") || ctx.includes("agency") || ctx.includes("blog") || ctx.includes("marketer")) {
    category = PAIN_POINTS.seo;
  }
  const idx = Math.floor(seededRandom(seed) * category.length);
  return category[idx]!;
}
