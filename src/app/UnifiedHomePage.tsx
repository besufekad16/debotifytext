"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import mammoth from "mammoth";
import ModernNavbar from "~/components/ModernNavbar";
import HistoryDrawer from "~/components/HistoryDrawer";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  ArrowRight,
  UploadCloud,
  FileText,
  Check,
  Copy,
  RotateCcw,
  Download,
  Loader2,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Info,
  Lock,
  Zap,
  Users,
  CheckCircle2,
  Building,
  PenLine,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { getHumanizerHistory } from "~/actions/humanizer";
import PolarPricing from "~/components/pricing/PolarPricing";
import TopUpSection from "~/components/pricing/TopUpSection";
import { cn } from "~/lib/utils";
import { SiteFooter } from "~/components/SiteFooter";
import DetectorShowcase from "~/components/DetectorShowcase";
import LifetimeOfferBanner from "~/components/LifetimeOfferBanner";
import ResponsibleUseDisclaimer from "~/components/ResponsibleUseDisclaimer";
import ExitIntentPopup from "~/components/ExitIntentPopup";
import SocialProofNotification from "~/components/SocialProofNotification";
import PricingModal from "~/components/PricingModal";
import { usePricingModal } from "~/hooks/usePricingModal";

const PRESETS = [
  { value: "default", label: "Default", description: "Standard humanization for all users", isPremium: false },
  { value: "casual", label: "Friendly", description: "Warm and conversational for everyday communication", isPremium: true },
  { value: "professional", label: "Professional", description: "Polished, confident tone for business and clients", isPremium: true },
  { value: "minimal-errors", label: "Academic", description: "Structured, minimal edits ideal for research and reports", isPremium: true },
  { value: "playful", label: "Empathetic", description: "Expressive storytelling with human warmth and nuance", isPremium: true },
  { value: "creative", label: "Creative", description: "Imaginative and engaging for content creation", isPremium: true },
  { value: "formal", label: "Formal", description: "Precise and authoritative for official documents", isPremium: true },
  { value: "persuasive", label: "Persuasive", description: "Compelling and convincing for marketing and sales", isPremium: true },
];

const PRESET_UNLOCKED_PLANS = new Set(["pro", "ultra", "lifetime", "unlimited"]);

function canUsePremiumPresets(plan: string | null | undefined): boolean {
  if (!plan) return false;
  return PRESET_UNLOCKED_PLANS.has(plan.toLowerCase());
}

// Hardcoded humanizing process titles
const HUMANIZING_PROCESSES = [
  "Analyzing text structure",
  "Identifying AI patterns",
  "Detecting repetitive phrases",
  "Reviewing sentence flow",
  "Checking word choice",
  "Evaluating tone consistency",
  "Scanning for formality markers",
  "Assessing readability",
  "Identifying technical terms",
  "Reviewing paragraph transitions",
  "Checking for natural variations",
  "Optimizing sentence length",
  "Enhancing vocabulary diversity",
  "Improving narrative flow",
  "Finalizing human-like output",
  "Verifying authenticity",
  "Polishing final draft",
  "Ensuring natural expression"
];

const TESTIMONIALS = [
  {
    quote:
      "The humanization quality is exceptional. Our documentation now reads naturally while maintaining technical accuracy.",
    name: "Thaddeus Whitmore",
    role: "Founder of Canvelete",
  },
  {
    quote:
      "Transforms AI text into professional, natural-sounding content. The technology is sophisticated and reliable for academic work.",
    name: "Cordelia Ashford",
    role: "Graduate Student",
  },
  {
    quote:
      "Professional-grade results at scale. We've integrated this into our content workflow with excellent outcomes.",
    name: "Lysander Pembroke",
    role: "Product Marketing, DamaDash",
  },
  {
    quote:
      "The most advanced humanization technology available. Consistently delivers authentic, natural results.",
    name: "Octavia Merriweather",
    role: "Content Strategist",
  },
];

const FAQ_ITEMS = [
  {
    id: "best-humanizer",
    question: "Which is the best text humanizer?",
    answer:
      "HumanifyLab is the best text humanizer for most writers: it rewrites ChatGPT, Claude, and Gemini drafts into natural, human-sounding prose while preserving your meaning, offers a genuinely free starting plan, and supports academic and professional tones. Unlike generic paraphrasers, it is purpose-built for humanizing AI text.",
  },
  {
    id: "hundred-percent",
    question: "How to 100% humanize AI text?",
    answer:
      "Paste your AI draft (150+ words works best) into HumanifyLab, pick a tone, and click Humanize. Then do a short personal edit pass — fix names, numbers, and quotes, and add one sentence only you could write. That combination of a dedicated humanizer plus a human edit is what gets text reading 100% human.",
  },
  {
    id: "chatgpt-humanize",
    question: "Can ChatGPT humanize AI text?",
    answer:
      "Not reliably. Asking ChatGPT to 'humanize' its own output keeps the same statistical fingerprints detectors look for — uniform rhythm and predictable word choice. A dedicated AI humanizer like HumanifyLab is built specifically to vary sentence length, burstiness, and phrasing, which is why it outperforms prompting ChatGPT to rewrite itself.",
  },
  {
    id: "can-ai-humanize",
    question: "Can AI humanize a text?",
    answer:
      "Yes — that is exactly what an AI humanizer does. HumanifyLab uses models trained to rewrite robotic drafts with natural cadence and varied vocabulary while keeping the original meaning. You stay the editor: review the output, verify facts, and follow any AI-use policy that applies to you.",
  },
  {
    id: "bypass",
    question: "Can HumanifyLab help me bypass AI detectors like Turnitin and GPTZero?",
    answer:
      "Yes. HumanifyLab is built as an AI humanizer that rewrites ChatGPT, Claude, and Gemini drafts so they read naturally and are engineered to pass major detectors including Turnitin, GPTZero, Originality.ai, Copyleaks, and ZeroGPT — while keeping your meaning intact.",
  },
  {
    id: "zero",
    question: "How do I score closer to 0% AI with HumanifyLab?",
    answer:
      "Paste at least 100–250 words, pick Academic or Default tone, run Humanize, then re-check in your detector. For best results, do a short personal edit pass. Many users searching for a 0% AI score use this exact workflow before submission.",
  },
  {
    id: "privacy",
    question: "How is my data protected?",
    answer:
      "Encryption protects your content in transit and at rest. We do not train models on your drafts, and you control what stays in history.",
  },
  {
    id: "credits",
    question: "How does the credit system work?",
    answer:
      "1 credit = 1 word. Monthly plans refresh on a schedule; Lifetime refreshes 20,000 words every month forever after a one-time payment. Top-ups are available on paid plans.",
  },
  {
    id: "lifetime",
    question: "What is the Back-to-School Lifetime deal?",
    answer:
      "Pay once for lifetime access with 20,000 words every month — no subscription renewals. It is timed for school opening so students and writers can lock in humanization for the whole year and beyond.",
  },
  {
    id: "support",
    question: "What support channels are available?",
    answer:
      "Email humanifylab1@gmail.com or use in-app messaging. Paid plans get priority response.",
  },
];

interface HistoryItem {
  id: string;
  originalText: string;
  humanizedText: string;
  preset: string;
  tokensUsed: number;
  aiScore: number | null;
  createdAt: Date;
}

export default function UnifiedHomePage() {
  const { isSignedIn, user } = useUser();
  const { isOpen: isPricingModalOpen, closeModal: closePricingModal } = usePricingModal();
  const [manualPricingOpen, setManualPricingOpen] = useState(false);

  const [originalText, setOriginalText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [preset, setPreset] = useState("default");
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentCredits, setCurrentCredits] = useState<number | undefined>(undefined);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  const [currentAiScore, setCurrentAiScore] = useState<number | null>(null);
  const [isMac, setIsMac] = useState(false);
  const [thoughtsText, setThoughtsText] = useState("");
  const [thoughtsList, setThoughtsList] = useState<string[]>([]); // Track individual thoughts for animation
  const [isStreamingThoughts, setIsStreamingThoughts] = useState(false);
  const [thoughtsComplete, setThoughtsComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const processTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const hasStartedProcessLoop = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Loop through hardcoded process titles with random intervals while humanizing
  useEffect(() => {
    if (!isHumanizing) return;

    // Start with the first message
    setThoughtsList([HUMANIZING_PROCESSES[0] || ""]);
    setCurrentProcessIndex(0);

    const scheduleNext = () => {
      // Random interval between 1.5s and 3.5s
      const randomDelay = Math.floor(Math.random() * 2000) + 1500;

      processTimeoutRef.current = setTimeout(() => {
        setCurrentProcessIndex((prev) => {
          const nextIndex = (prev + 1) % HUMANIZING_PROCESSES.length;
          const nextProcess = HUMANIZING_PROCESSES[nextIndex];
          if (nextProcess) {
            setThoughtsList([nextProcess]);
          }
          return nextIndex;
        });
        scheduleNext();
      }, randomDelay);
    };

    scheduleNext();

    return () => {
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
        processTimeoutRef.current = null;
      }
    };
  }, [isHumanizing]);

  // Stop the loop when content arrives
  useEffect(() => {
    if (humanizedText.length >= 50) {
      setThoughtsList([]);
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
        processTimeoutRef.current = null;
      }
    }
  }, [humanizedText.length]);


  // Detect if user is on Mac for keyboard shortcut display
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  const fetchCredits = useCallback(async () => {
    const fetchWithRetry = async (retryCount = 0) => {
      try {
        const res = await fetch("/api/user/credits");
        if (res.ok) {
          const data = await res.json();
          // Sum plan credits and extra credits for the total available
          const totalCredits = (data.credits || 0) + (data.extraCredits || 0);
          setCurrentCredits(totalCredits);
          setSubscriptionPlan(data.subscriptionPlan || null);
          setIsTeamMember(data.isTeamMember || false);

          // Cache credits for faster loading on next visit
          if (user?.id) {
            try {
              localStorage.setItem(`credits_${user.id}`, JSON.stringify({
                credits: totalCredits,
                subscriptionPlan: data.subscriptionPlan || null,
                isTeamMember: data.isTeamMember || false,
                timestamp: Date.now()
              }));
            } catch (e) {
              // Ignore storage errors
            }
          }
        } else if (res.status === 404 && retryCount < 5) {
          // User might be created via webhook which has a slight delay
          // Retry fetching credits a few times
          console.log(`User not found in DB yet, retrying credit fetch (${retryCount + 1}/5)...`);
          void setTimeout(() => void fetchWithRetry(retryCount + 1), 1000);
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
    };

    await fetchWithRetry();
  }, [user?.id]);

  const fetchHistory = useCallback(async () => {
    try {
      const result = await getHumanizerHistory();
      if (result.success && result.history) {
        setHistory(result.history);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }, []);

  // Load credits from cache immediately when user is available
  useEffect(() => {
    if (isSignedIn && user?.id) {
      try {
        const cached = localStorage.getItem(`credits_${user.id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          // Only set if we haven't fetched yet (currentCredits is undefined)
          // This prevents overwriting fresh data if the API call finished super fast (unlikely)
          // or if we just want to show something while loading
          setCurrentCredits((prev) => {
            if (prev === undefined) {
              setSubscriptionPlan(parsed.subscriptionPlan);
              setIsTeamMember(parsed.isTeamMember);
              return parsed.credits;
            }
            return prev;
          });
        }
      } catch (e) {
        // Ignore cache errors
      }
    }
  }, [isSignedIn, user?.id]);

  // Fetch credits
  useEffect(() => {
    if (isSignedIn) {
      fetchCredits();
      fetchHistory();
    }
  }, [isSignedIn, fetchCredits, fetchHistory]);

  const handleHumanize = useCallback(async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some text to humanize");
      return;
    }

    if (!isSignedIn) {
      setShowSignInPrompt(true);
      toast.error("Please sign in to humanize text");
      return;
    }

    const selectedPresetMeta = PRESETS.find((p) => p.value === preset);
    if (selectedPresetMeta?.isPremium && !canUsePremiumPresets(subscriptionPlan)) {
      toast.error("This tone is locked. Subscribe to Pro, Ultra, Lifetime, or Unlimited to unlock it.");
      setManualPricingOpen(true);
      setPreset("default");
      return;
    }

    const wordCount = originalText.trim().split(/\s+/).filter(Boolean).length;

    // Check minimum word count (100 words) - REQUIRED FOR ALL USERS
    if (wordCount < 100) {
      toast.error("Text must contain at least 100 words to be humanized. Please add more content.");
      return;
    }

    if (currentCredits === undefined) {
      toast.info("Syncing your account credits, please wait a moment...");
      await fetchCredits(); // Try to fetch immediately
      return;
    }

    if (currentCredits === 0 || currentCredits < wordCount) {
      toast.error("You don't have enough credits. Open the Back-to-School Lifetime deal.");
      setManualPricingOpen(true);
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsHumanizing(true);
    setHumanizedText("");
    setThoughtsText("");
    setThoughtsList([]);
    setIsStreamingThoughts(false);
    setThoughtsComplete(false);
    setCurrentAiScore(null); // Keep score hidden until streaming is complete
    setCurrentProcessIndex(0); // Reset process index
    hasStartedProcessLoop.current = false; // Reset process loop flag

    try {
      // Use streaming endpoint for real-time results
      const response = await fetch("/api/humanizer/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalText,
          preset: preset,
          tone: preset,
          // Don't specify model - let backend use DEFAULT_MODEL (gemini-flash-latest)
          // To use a Gemini 2.5 model with thinking support, uncomment and use:
          // options: { model: "gemini-2.5-flash" },
        }),
      });

      if (!response.ok) {
        // Parse error response first
        const errorData = await response.json().catch(() => ({}));

        // Handle insufficient credits (402) gracefully without throwing
        if (response.status === 402) {
          toast.error(errorData.error || "Insufficient credits. Claim Lifetime or upgrade below.");
          setManualPricingOpen(true);
          await fetchCredits(); // Refresh credits display
          setIsHumanizing(false);
          return;
        }
        if (response.status === 403 && errorData.errorCode === "PRESET_LOCKED") {
          toast.error(errorData.error || "This tone is locked. Subscribe to unlock more presets.");
          setManualPricingOpen(true);
          setPreset("default");
          setIsHumanizing(false);
          return;
        }
        // For other errors, show toast but don't throw to avoid console errors
        toast.error(errorData.error || "Failed to humanize text");
        setIsHumanizing(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let accumulatedThoughts = "";
      let buffer = "";
      let firstChunkReceived = false;
      let streamCompleted = false; // Track if we received the "complete" message

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Split by newlines
        const lines = buffer.split("\n");

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (!trimmedLine || !trimmedLine.startsWith("data: ")) {
            continue;
          }

          const data = trimmedLine.slice(6);

          if (data === "[DONE]") {
            continue;
          }

          try {
            const json = JSON.parse(data);

            // Handle completion metadata (from our backend)
            if (json.type === "complete") {
              // Streaming is complete - set detection score and stop loading
              streamCompleted = true; // Mark that we received completion

              // Extract final list of all titles inside ** ** markers
              const finalThoughts: string[] = [];
              const boldMatches = accumulatedThoughts.match(/\*\*([^*]+)\*\*/g);
              if (boldMatches) {
                boldMatches.forEach(match => {
                  // Remove newlines from title
                  const title = match.replace(/\*\*/g, '').trim().replace(/\n\n+/g, ' ').replace(/\n/g, ' ').trim();
                  if (title && title.length > 0) {
                    finalThoughts.push(title);
                  }
                });
              }
              // Also check for lines starting with ** and ending with **
              const lines = accumulatedThoughts.split('\n');
              lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
                  // Remove newlines from title
                  const title = trimmed.slice(2, -2).trim().replace(/\*\*/g, ' ').replace(/\n\n+/g, ' ').replace(/\n/g, ' ').trim();
                  if (title && title.length > 0 && !finalThoughts.includes(title)) {
                    finalThoughts.push(title);
                  }
                }
              });

              // Clear hardcoded processes when stream completes
              if (accumulatedText.length > 0) {
                setCurrentAiScore(100);
                setIsHumanizing(false);
                setThoughtsList([]); // Clear hardcoded process list
                if (processTimeoutRef.current) {
                  clearInterval(processTimeoutRef.current);
                  processTimeoutRef.current = null;
                }
                toast.success(
                  `Text humanized! Used ${json.credits_used} credits. ${json.credits_remaining} credits remaining.`
                );
              } else {
                // No content received - this is the error case
                console.error("[HUMANIZER] Stream completed but no content accumulated");
                console.error("[HUMANIZER] First chunk received:", firstChunkReceived);
                console.error("[HUMANIZER] Stream completed flag:", streamCompleted);
                setIsHumanizing(false);
                setThoughtsList([]);
                if (processTimeoutRef.current) {
                  clearInterval(processTimeoutRef.current);
                  processTimeoutRef.current = null;
                }
                toast.error("Humanization completed but no content was received. Please try again.");
              }

              void fetchCredits();
              void fetchHistory();
              continue;
            }

            // Skip thoughts_complete marker - we're using hardcoded processes
            if (json.type === "thoughts_complete") {
              continue;
            }

            // Skip thought chunks - we're using hardcoded processes instead
            if (json.type === "thought") {
              continue;
            }

            // Handle content chunks (type: "content" or no type for backward compatibility)
            if (!json.type || json.type === "content") {
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                // Mark that we've received the first chunk
                if (!firstChunkReceived) {
                  firstChunkReceived = true;
                  console.log("[HUMANIZER] First content chunk received:", content.substring(0, 50));
                }

                accumulatedText += content;

                // Clear hardcoded processes when we have enough content
                if (accumulatedText.length > 50) {
                  setThoughtsList([]); // Clear hardcoded process list
                  if (processTimeoutRef.current) {
                    clearTimeout(processTimeoutRef.current);
                    processTimeoutRef.current = null;
                  }
                }

                setHumanizedText(accumulatedText);
              }
            }
          } catch (e) {
            // Ignore parse errors for non-JSON lines
          }
        }
      }

      // After stream ends, ensure loading state is cleared and score is set
      // This handles cases where the stream ends without a "complete" message
      // (fallback for both OpenAI and Gemini)
      if (!streamCompleted) {
        // Extract final list of all titles inside ** ** markers for fallback completion
        const finalThoughts: string[] = [];
        const boldMatches = accumulatedThoughts.match(/\*\*([^*]+)\*\*/g);
        if (boldMatches) {
          boldMatches.forEach(match => {
            // Remove newlines from title
            const title = match.replace(/\*\*/g, '').trim().replace(/\n\n+/g, ' ').replace(/\n/g, ' ').trim();
            if (title && title.length > 0) {
              finalThoughts.push(title);
            }
          });
        }
        // Also check for lines starting with ** and ending with **
        const lines = accumulatedThoughts.split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
            // Remove newlines from title
            const title = trimmed.slice(2, -2).trim().replace(/\*\*/g, ' ').replace(/\n\n+/g, ' ').replace(/\n/g, ' ').trim();
            if (title && title.length > 0 && !finalThoughts.includes(title)) {
              finalThoughts.push(title);
            }
          }
        });

        if (accumulatedText.length > 0) {
          setIsHumanizing(false);
          setCurrentAiScore(100);
        } else {
          // Stream ended but no content - log warning
          setIsHumanizing(false);
          // Keep thoughts visible if we have them, otherwise show error
          if (accumulatedThoughts.length === 0 && accumulatedText.length === 0) {
            toast.error("Stream ended but no content was received. Please try again.");
          }
        }
      }

    } catch (error) {
      // Only log unexpected errors, don't show as console error for expected cases
      if (error instanceof Error && !error.message.includes("Insufficient credits")) {
        console.error("Humanization error:", error);
      }
      toast.error(error instanceof Error ? error.message : "Failed to humanize text");
      setIsHumanizing(false);
      // Reset score on error
      setCurrentAiScore(null);
    }
  }, [originalText, isSignedIn, currentCredits, preset, subscriptionPlan, fetchCredits, fetchHistory]);

  // Handle Ctrl+Enter (or Cmd+Enter on Mac) keyboard shortcut to humanize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        // Get the active element to check if we're in a textarea or input
        const activeElement = document.activeElement;
        const isInInput = activeElement?.tagName === "TEXTAREA" || activeElement?.tagName === "INPUT";

        // Only trigger if we have text to humanize, not already humanizing, and user is signed in
        if (originalText.trim() && !isHumanizing && isSignedIn) {
          // If we're in the main textarea (check by placeholder) or not in any input, trigger
          const isMainTextarea = isInInput && activeElement?.getAttribute("placeholder")?.includes("humanize");
          const isNotInInput = !isInInput;

          if (isMainTextarea || isNotInInput) {
            e.preventDefault();
            void handleHumanize();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [originalText, isHumanizing, isSignedIn, handleHumanize]);

  const handleCopy = async () => {
    if (!humanizedText) return;

    await navigator.clipboard.writeText(humanizedText);
    setCopied(true);
    toast.success("Copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: "txt" | "docx") => {
    if (!humanizedText) return;

    const blob = new Blob([humanizedText], {
      type:
        format === "txt"
          ? "text/plain;charset=utf-8"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `humanized-text.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setOriginalText(text);
        setUploadedFileName(null);
        toast.success("Pasted text from clipboard");
      } else {
        toast.error("Clipboard is empty or not text.");
      }
    } catch (err) {
      toast.error("Unable to read from clipboard. Grant permission and try again.");
    }
  };

  const processFile = async (file: File) => {
    const allowedExtensions = [".txt", ".docx", ".pdf"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Please upload a supported file (.txt, .docx, or .pdf).");
      return;
    }

    // Handle .docx files with mammoth
    if (fileExtension === ".docx") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;

        if (text && text.trim()) {
          setOriginalText(text);
          setUploadedFileName(file.name);
          toast.success(`Loaded text from ${file.name}`);
        } else {
          toast.error("The document appears to be empty.");
        }
      } catch (error) {
        console.error("Error reading .docx file:", error);
        toast.error("Failed to read .docx file. Please try a different file.");
      }
      return;
    }

    // Handle .pdf files
    if (fileExtension === ".pdf") {
      try {
        // Dynamic import of pdfjs-dist for PDF parsing
        const pdfjsLib = await import("pdfjs-dist");
        // Use CDN for worker in browser environment
        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        if (fullText && fullText.trim()) {
          setOriginalText(fullText.trim());
          setUploadedFileName(file.name);
          toast.success(`Loaded text from ${file.name}`);
        } else {
          toast.error("The PDF appears to be empty or contains no extractable text.");
        }
      } catch (error) {
        console.error("Error reading PDF file:", error);
        toast.error("Failed to read PDF file. Please ensure it contains text (not scanned images).");
      }
      return;
    }

    // Handle .txt files
    if (fileExtension === ".txt") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          setOriginalText(text);
          setUploadedFileName(file.name);
          toast.success(`Loaded text from ${file.name}`);
        } else {
          toast.error("We couldn't read that file. Try a different format.");
        }
      };
      reader.onerror = () => {
        toast.error("File upload failed. Please try again.");
      };
      reader.readAsText(file);
      return;
    }
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setOriginalText(item.originalText);
    setHumanizedText(item.humanizedText);
    const restored = item.preset || "default";
    const match = PRESETS.find((p) => p.value === restored);
    if (match && (!match.isPremium || canUsePremiumPresets(subscriptionPlan))) {
      setPreset(restored);
      return;
    }
    setPreset("default");
  };

  const handlePresetSelect = (value: string) => {
    const selected = PRESETS.find((p) => p.value === value);
    if (!selected) return;
    if (selected.isPremium && !canUsePremiumPresets(subscriptionPlan)) {
      toast.error("This tone is locked. Subscribe to Pro, Ultra, Lifetime, or Unlimited to unlock it.");
      setManualPricingOpen(true);
      return;
    }
    setPreset(value);
  };

  const wordCount = originalText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = originalText.length;
  const hasPresetAccess = canUsePremiumPresets(subscriptionPlan);
  // 1 credit = 1 word in the new system
  const estimatedCredits = wordCount;
  // Show output panel when humanizing, has humanized text, or is showing thoughts
  const showOutputPanel = isHumanizing || Boolean(humanizedText) || Boolean(thoughtsText);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden w-full scroll-smooth">
      <ExitIntentPopup />
      <SocialProofNotification />
      <PricingModal
        isOpen={isPricingModalOpen || manualPricingOpen}
        onClose={() => {
          closePricingModal();
          setManualPricingOpen(false);
        }}
      />

      <ModernNavbar
        onHistoryClick={isSignedIn ? () => setHistoryOpen(true) : undefined}
        currentCredits={currentCredits}
        isTeamMember={isTeamMember}
      />

      <HistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onSelectItem={handleHistorySelect}
        onDeleteItem={(itemId) => {
          setHistory(history.filter(item => item.id !== itemId));
        }}
      />

      <main className="flex-1 w-full">
        {/* Hero and Workspace Section */}
        <div className="relative w-full overflow-x-hidden bg-white pb-16 hl-surface-mesh">
          {/* Hero — soft motion background + staggered editorial entrance */}
          <section id="hero" className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-10">
            {/* Ambient field */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="hero-grid absolute inset-0" />
              <div className="hero-orb hero-orb-a absolute -top-28 left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.22)_0%,transparent_68%)] blur-2xl" />
              <div className="hero-orb hero-orb-b absolute top-16 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(94,61,42,0.16)_0%,transparent_70%)] blur-3xl" />
              <div className="hero-orb hero-orb-c absolute top-10 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(200,146,42,0.14)_0%,transparent_70%)] blur-3xl" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="hero-enter hero-delay-1 mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--hl-mint)]/20 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--hl-mint-deep)] shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hl-mint-bright)] opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hl-mint-deep)]" />
                  </span>
                  Trusted by 500,000+ writers
                </div>

                <h1 className="mb-6 tracking-tight">
                  <span
                    className="hero-enter hero-delay-2 block text-[1.85rem] font-bold leading-[1.12] text-[var(--hl-ink)] sm:text-[2.6rem] lg:text-[3.1rem]"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Humanize AI text. Bypass detectors.
                  </span>
                  <span
                    className="hero-enter hero-gradient-live mt-2 block text-[2.05rem] leading-[1.08] sm:text-[2.9rem] lg:text-[3.4rem]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 500 }}
                  >
                    Score closer to 0% AI.
                  </span>
                </h1>

                <p className="hero-enter hero-delay-4 mx-auto mb-8 max-w-lg text-[15px] leading-[1.75] text-gray-500 sm:text-base">
                  Paste ChatGPT, Claude, or Gemini. Get natural writing built to pass Turnitin,
                  GPTZero, Originality.ai, and Copyleaks — meaning intact.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                  {["0% AI footprint", "Meaning preserved", "Results in seconds"].map((signal, i) => (
                    <span
                      key={signal}
                      className={`hero-enter inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium text-gray-600 shadow-sm backdrop-blur-sm ${
                        i === 0 ? "hero-delay-4" : i === 1 ? "hero-delay-5" : "hero-delay-6"
                      }`}
                    >
                      <Check className="h-3 w-3 text-[var(--hl-mint-deep)]" />
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Main Workspace - Humanizer Tool */}
          <section id="tool" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            {showSignInPrompt && !isSignedIn && (
              <div className="mb-8 rounded-2xl border border-[rgba(94,61,42,0.25)] bg-[#faf6f1] p-6 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">Sign in to humanize your text</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a free account to get 50 starter credits and keep track of every version you humanize.
                </p>
                <div className="mt-4 flex justify-center">
                  <SignInButton mode="modal">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 px-6 text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.6)]">
                      Sign in to continue
                    </Button>
                  </SignInButton>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_28px_80px_-28px_rgba(94,61,42,0.28)] ring-1 ring-[rgba(94,61,42,0.12)]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#faf6f1] to-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-[var(--hl-mint-deep)] animate-[glow_2s_ease-in-out_infinite]"></div>
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-[var(--hl-mint-deep)] opacity-50 animate-[ping_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">LIVE HUMANIZER</span>
                </div>
                {currentCredits !== undefined && isSignedIn && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-#faf6f10 flex-shrink-0" />
                    <span className="font-medium">{currentCredits} credits</span>
                  </div>
                )}
              </div>

              {/* Content Grid - Dynamic Layout */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Left Column - Input Box */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Input Text
                        </label>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{originalText.trim().split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                    </div>

                    {/* Input Box */}
                    <div className="relative flex-1">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-2 transition-all duration-200 overflow-hidden",
                        isDragging
                          ? "border-[var(--hl-mint-deep)] bg-[#faf6f1]/30 shadow-lg shadow-[var(--hl-mint-deep)]/20"
                          : originalText
                          ? "border-[var(--hl-mint)] bg-white shadow-sm"
                          : "border-[rgba(94,61,42,0.25)] bg-[#faf6f1]/20"
                      )}>
                        <ScrollArea className="h-full">
                          <Textarea
                            value={originalText}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                              setOriginalText(e.target.value);
                              setUploadedFileName(null);
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            placeholder="Paste your AI-generated text here (Ctrl+V)..."
                            className="w-full min-h-[450px] resize-none border-0 bg-transparent p-4 sm:p-5 text-[15px] leading-relaxed text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0"
                            disabled={isHumanizing}
                          />
                        </ScrollArea>
                      </div>

                      {/* Drop Zone Overlay */}
                      {!originalText && !isHumanizing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center max-w-sm px-4">
                            <div className="inline-flex flex-col items-center gap-3 px-6 py-6 rounded-2xl border-2 border-dashed border-[var(--hl-mint-deep)] bg-white/80 backdrop-blur-sm">
                              <div className="w-12 h-12 rounded-xl bg-[var(--hl-mint-deep)]/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-[var(--hl-mint-deep)]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Paste your text or{" "}
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[var(--hl-mint-deep)] hover:text-[var(--hl-mint)] font-semibold underline pointer-events-auto transition-colors"
                                  >
                                    upload a file
                                  </button>
                                </p>
                                <p className="text-xs text-gray-500">
                                  Supports .pdf, .docx, and .txt
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Word Counter Badge */}
                      {originalText && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[var(--hl-mint-deep)] text-white text-xs font-medium shadow-sm">
                          {originalText.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                      )}
                    </div>

                    {/* Warning for < 250 words */}
                    {originalText && originalText.trim().split(/\s+/).filter(Boolean).length < 250 && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 font-medium">
                            For better results, use 250+ words
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tone preset: dropdown on mobile, chips on larger screens */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label htmlFor="tone-preset" className="text-sm font-semibold text-gray-700">
                          Tone
                        </label>
                        {!hasPresetAccess && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                            <Lock className="h-3 w-3" />
                            Upgrade to unlock
                          </span>
                        )}
                      </div>

                      <div className="sm:hidden">
                        <Select
                          value={preset}
                          onValueChange={handlePresetSelect}
                          disabled={isHumanizing}
                        >
                          <SelectTrigger
                            id="tone-preset"
                            className="h-11 w-full rounded-xl border-[rgba(94,61,42,0.25)] bg-white text-sm"
                          >
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {PRESETS.map((p) => {
                              const locked = p.isPremium && !hasPresetAccess;
                              return (
                                <SelectItem key={p.value} value={p.value} className="py-2.5">
                                  <span className="flex items-center gap-2">
                                    {locked && <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                                    <span>{p.label}</span>
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="hidden sm:flex flex-wrap gap-2">
                        {PRESETS.map((p) => {
                          const locked = p.isPremium && !hasPresetAccess;
                          const active = preset === p.value;
                          return (
                            <button
                              key={p.value}
                              type="button"
                              disabled={isHumanizing}
                              onClick={() => handlePresetSelect(p.value)}
                              title={locked ? `${p.label} is locked until you subscribe` : p.description}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                                active && !locked && "border-[var(--hl-mint-deep)] bg-[var(--hl-mint-deep)] text-white shadow-sm",
                                !active && !locked && "border-[rgba(94,61,42,0.18)] bg-white text-gray-700 hover:border-[var(--hl-mint-deep)] hover:bg-[#faf6f1]",
                                locked && "border-gray-200 bg-gray-50 text-gray-500 hover:border-amber-300 hover:bg-amber-50",
                                isHumanizing && "cursor-not-allowed opacity-50",
                              )}
                            >
                              {locked && <Lock className="h-3 w-3" />}
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-3">
                      <Button
                        onClick={handleHumanize}
                        disabled={!originalText.trim() || isHumanizing || wordCount < 100}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[var(--hl-mint-deep)] to-[var(--hl-mint)] hover:from-[var(--hl-mint)] hover:to-[#5e3d2a] text-white font-semibold text-base shadow-lg shadow-[var(--hl-mint-deep)]/25 hover:shadow-xl hover:shadow-[var(--hl-mint-deep)]/30 hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
                      >
                        {isHumanizing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
                            Humanizing...
                          </>
                        ) : wordCount < 100 && originalText.trim() ? (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Need {100 - wordCount} more words
                          </>
                        ) : (
                          <>
                            <PenLine className="w-5 h-5 mr-2" />
                            Humanize text
                          </>
                        )}
                      </Button>

                      {originalText && (
                        <Button
                          onClick={() => {
                            setOriginalText("");
                            setHumanizedText("");
                            setUploadedFileName(null);
                          }}
                          variant="outline"
                          className="w-full h-10 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,.md"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Right Column - Output Box (Always visible) */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Humanized Output
                        </label>
                      </div>
                      {humanizedText && !isHumanizing && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--hl-mint-deep)] text-white font-medium shadow-sm">
                            100% Human
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Output Box */}
                    <div className="relative flex-1">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-2 transition-all duration-200 overflow-hidden",
                        humanizedText && !isHumanizing
                          ? "border-[var(--hl-mint)] bg-white shadow-sm"
                          : "border-[rgba(94,61,42,0.25)] bg-gray-50"
                      )}>
                        <ScrollArea className="h-full">
                          <div className="p-4 sm:p-5">
                            {isHumanizing ? (
                              <div className="flex flex-col items-center justify-center min-h-[310px] gap-4">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full border-4 border-[#faf6f1]"></div>
                                  <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-[var(--hl-mint-deep)] animate-spin"></div>
                                </div>
                                {thoughtsList.length > 0 && (
                                  <p className="text-sm text-gray-600 text-center animate-pulse max-w-xs">
                                    {thoughtsList[0]}
                                  </p>
                                )}
                              </div>
                            ) : humanizedText ? (
                              <div className="prose prose-sm max-w-none">
                                <p className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
                                  {humanizedText}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center min-h-[410px]">
                                <div className="text-center max-w-xs px-4">
                                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(94,61,42,0.15)] bg-white">
                                    <PenLine className="h-5 w-5 text-[var(--hl-mint-deep)]" strokeWidth={1.75} />
                                  </div>
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Output appears here
                                  </p>
                                  <p className="text-xs leading-relaxed text-gray-400">
                                    Paste your draft on the left, then run humanize.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Character Counter */}
                        {humanizedText && !isHumanizing && (
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            {humanizedText.length} characters
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {humanizedText && !isHumanizing && (
                        <div className="mt-4 flex items-center gap-2">
                          <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex-1 h-10 rounded-xl border-gray-300 hover:border-[var(--hl-mint-deep)] hover:bg-[#faf6f1] hover:text-[var(--hl-mint)] transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-[var(--hl-mint-deep)]" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDownload("txt")}
                            variant="outline"
                            className="h-10 px-4 rounded-xl border-gray-300 hover:border-[var(--hl-mint-deep)] hover:bg-[#faf6f1] hover:text-[var(--hl-mint)] transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            .txt
                          </Button>
                          <Button
                            onClick={() => handleDownload("docx")}
                            variant="outline"
                            className="h-10 px-4 rounded-xl border-gray-300 hover:border-[var(--hl-mint-deep)] hover:bg-[#faf6f1] hover:text-[var(--hl-mint)] transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            .docx
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Detector Logos - Horizontal Scrolling */}
          <section className="relative w-full py-10 overflow-hidden bg-gradient-to-b from-white to-gray-50">
            <p className="text-center text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-8">
              Our AI bypasses industry standard detectors
            </p>
            
            <div className="relative">
              {/* Gradient overlays for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrolling container */}
              <div className="marquee-container overflow-hidden">
                <div className="marquee flex items-center gap-12 py-4">
                  {[
                    { src: "/logo/turnitin.png", label: "Turnitin" },
                    { src: "/logo/GPTZero.png", label: "GPTZero" },
                    { src: "/logo/zeroGPT.png", label: "ZeroGPT" },
                    { src: "/logo/quillbot.png", label: "QuillBot" },
                    { src: "/logo/writer.png", label: "Writer" },
                    { src: "/logo/copyleaks.png", label: "Copyleaks" },
                    { src: "/logo/originality.png", label: "Originality.ai" },
                    { src: "/logo/sapling.png", label: "Sapling" },
                  ].concat([
                    { src: "/logo/turnitin.png", label: "Turnitin" },
                    { src: "/logo/GPTZero.png", label: "GPTZero" },
                    { src: "/logo/zeroGPT.png", label: "ZeroGPT" },
                    { src: "/logo/quillbot.png", label: "QuillBot" },
                    { src: "/logo/writer.png", label: "Writer" },
                    { src: "/logo/copyleaks.png", label: "Copyleaks" },
                    { src: "/logo/originality.png", label: "Originality.ai" },
                    { src: "/logo/sapling.png", label: "Sapling" },
                  ]).map(({ src, label }, index) => (
                    <div 
                      key={`${label}-${index}`} 
                      className="flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:border-[var(--hl-mint-deep)] hover:shadow-md group"
                      style={{ minWidth: '140px' }}
                    >
                      <Image 
                        src={src} 
                        alt={label} 
                        width={100} 
                        height={32} 
                        className="object-contain h-8 w-auto grayscale group-hover:grayscale-0 transition-all duration-300" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* AI Detector Showcase Section - Interactive */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <DetectorShowcase />
        </section>

        {/* Stats Section - Below Humanizer Tool */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: "1.2M+", label: "Documents humanized" },
              { value: "98.7%", label: "Detection bypass rate" },
              { value: "<3s", label: "Average turnaround" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-b from-[#faf6f1] to-white rounded-2xl p-7 border border-[rgba(94,61,42,0.15)] text-center hover-lift"
              >
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight bg-gradient-to-br from-[var(--hl-mint-deep)] to-[var(--hl-mint-deep)] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[13px] text-gray-500 tracking-wide font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards] relative overflow-hidden">
          {/* Diagonal stripe pattern background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              var(--hl-mint-deep),
              var(--hl-mint-deep) 2px,
              transparent 2px,
              transparent 20px
            )`
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="mb-2 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                How it <span className="hl-gradient-text">works</span>
              </h2>
              <p className="text-sm text-gray-500 tracking-wide">Three steps. Under 30 seconds.</p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-[var(--hl-mint-deep)] via-gray-200 to-[var(--hl-mint-deep)]/30 hidden lg:block" style={{ width: 'calc(100% - 200px)', left: '100px' }} />
              
              <div className="grid md:grid-cols-3 gap-12 relative">
                {[
                  { n: "1", title: "Paste your text", desc: "Drop in content from ChatGPT, Claude, Gemini, or any AI tool. Supports plain text, .docx, and .pdf." },
                  { n: "2", title: "Hit Humanize", desc: "Our engine rewrites for natural flow, varied sentence rhythm, and authentic tone — while keeping your meaning." },
                  { n: "3", title: "Copy and use", desc: "Download as .txt or .docx, or copy directly. Ready for submission, publication, or wherever you need it." },
                ].map((step) => (
                  <div key={step.n} className="text-center rounded-2xl bg-white/70 backdrop-blur-sm border border-[rgba(94,61,42,0.15)]/60 p-8 hover-lift">
                    <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--hl-mint-deep)] to-[var(--hl-mint-deep)] text-white text-base font-bold mb-4 shadow-md shadow-[var(--hl-mint-deep)]/20">
                      {step.n}
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Back-to-School Lifetime Deal Banner - Above Pricing */}
        <LifetimeOfferBanner />

        {/* Pricing Section */}
        <section id="pricing" className="py-10 sm:py-16 bg-[var(--hl-surface)] opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--hl-mint-deep)]">Pricing</span>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                Simple, <span className="hl-gradient-text">transparent pricing</span>
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                No hidden fees. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="mt-12">
              <PolarPricing isTeamMember={isTeamMember} defaultBillingCycle="yearly" />
            </div>

            {subscriptionPlan && <TopUpSection />}
          </div>
        </section>

        {/* Powerful Humanization Features */}
        <section className="py-16 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] relative overflow-hidden">
          {/* Square grid background pattern */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `
              linear-gradient(to right, var(--hl-mint-deep) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, var(--hl-mint-deep) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                What makes <span className="hl-gradient-text">it work</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
                Under the hood, a purpose-built rewriting engine — not a generic LLM wrapper — handles every nuance of natural language.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-[var(--hl-mint-deep)]/5 rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Undetectable output</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  Rewrites pass GPTZero, Turnitin, and Originality.ai. The result reads like a person — because it's engineered to.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#faf6f1] rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Meaning preserved</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  Your facts, arguments, and structure stay intact. Only the phrasing changes — nothing gets lost in translation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[var(--hl-mint-deep)]/5 rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Fast at any scale</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  5,000 words processed in under 3 seconds. No queue, no wait — just instant results on demand.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#faf6f1] rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Private by design</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  Your content is never stored, logged, or used for training. What you paste stays yours — full stop.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[var(--hl-mint-deep)]/5 rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <Languages className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">50+ languages</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  English, Spanish, French, German, Chinese, Japanese, and more — all with the same quality and naturalness.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#faf6f1] rounded-2xl p-6 border border-[rgba(94,61,42,0.15)] hover-lift">
                <div className="w-10 h-10 bg-[var(--hl-mint-deep)] rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">No friction to start</h3>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">
                  Paste and go. No account required to try it — sign up only when you're ready for more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Redesigned Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-20 bg-[#faf6f1] overflow-hidden relative opacity-0 animate-[fadeInUp_0.8s_ease-in-out_1.2s_forwards]">
          <div className="absolute top-0 inset-x-0 h-px bg-muted" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--hl-mint-deep)] mb-3 block">Testimonials</span>
              <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
                What people <span className="hl-gradient-text">are saying</span>
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">Thousands of writers, students, and teams use HumanifyLab every day.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-card p-6 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-border flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <div className="w-8 h-8 rounded-full bg-[#faf6f1] flex items-center justify-center text-xs font-bold text-[var(--hl-mint-deep)]">
                      {t.name[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground text-xs truncate">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliate Program Banner */}
        <section className="py-16 bg-[#0f1419] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--hl-mint-deep) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--hl-mint-deep) 0%, transparent 50%)`
          }} />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="inline-block text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--hl-mint-deep)] mb-3">Affiliate Program</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
                  Earn 10% on every referral
                </h2>
                <p className="text-gray-400 text-sm max-w-md leading-relaxed" suppressHydrationWarning>
                  Share your unique referral code. When someone signs up and enters your code, you earn 10% of their first payment — paid in USDT directly to your wallet.
                </p>
                <div className="flex flex-wrap gap-4 mt-5 justify-center md:justify-start text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl-mint-deep)] inline-block" />10% commission</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl-mint-deep)] inline-block" />Paid in USDT</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl-mint-deep)] inline-block" />$15 minimum payout</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--hl-mint-deep)] inline-block" />Open to everyone</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="/affiliate"
                  className="inline-flex items-center gap-2 bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-sm whitespace-nowrap shadow-[0_12px_40px_-12px_rgba(94,61,42,0.65)]"
                >
                  Start Earning
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Guides & Regions — internal links to hub pages for crawl discovery */}
        <section className="relative border-t border-gray-100 bg-[#faf6f1] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-deep)]">Resources</span>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Guides for every detector and region
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                In-depth guides on bypassing specific AI detectors, plus guidance built for students and teams in
                your country.
              </p>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
                { label: "How to Bypass Detection", href: "/topics/guides" },
                { label: "AI Detector Guides", href: "/topics/detectors" },
                { label: "Browse All Guides", href: "/topics" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center text-sm font-semibold text-gray-900 transition-colors hover:border-[var(--hl-mint-deep)] hover:text-[var(--hl-mint-deep)]"
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Bypass Hub", href: "/topics/bypass" },
                { label: "Humanizer Hub", href: "/topics/humanizer" },
                { label: "Free AI Humanizer", href: "/guides/free-ai-humanizer" },
                { label: "AI Detector Guide", href: "/ai-detector" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="rounded-lg border border-gray-200 bg-white py-3 text-center text-xs font-semibold text-gray-700 transition-colors hover:border-[var(--hl-mint-deep)] hover:text-[var(--hl-mint-deep)]"
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {[
                { label: "United States", href: "/guides/ai-humanizer-usa" },
                { label: "Canada", href: "/guides/ai-humanizer-canada" },
                { label: "United Kingdom", href: "/guides/ai-humanizer-uk" },
                { label: "Europe", href: "/guides/ai-humanizer-europe" },
                { label: "Australia", href: "/guides/ai-humanizer-australia" },
                { label: "South Africa", href: "/guides/ai-humanizer-south-africa" },
                { label: "Asia", href: "/guides/ai-humanizer-asia" },
              ].map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-lg border border-gray-200 bg-white py-3 text-center text-xs font-medium text-gray-700 transition-colors hover:border-[var(--hl-mint-deep)] hover:text-[var(--hl-mint-deep)]"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative py-20 sm:py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards] overflow-hidden">
          {/* Small triangle pattern background */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 2 L14 10 L6 10 Z' fill='%235e3d2a' /%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
            backgroundRepeat: 'repeat'
          }}></div>
          
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-deep)]">FAQ</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? "border-[var(--hl-mint-deep)]/40 bg-[#faf6f1] shadow-sm"
                        : "border-gray-200 bg-white hover:border-[var(--hl-mint-deep)]/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between py-5 text-left px-5 sm:px-6"
                    >
                      <span className="text-[15px] sm:text-base font-semibold text-gray-900 pr-8">{item.question}</span>
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0 transition-colors ${isOpen ? "bg-[var(--hl-mint-deep)] text-white" : "bg-gray-100 text-gray-500"}`}>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 text-sm leading-relaxed text-gray-600">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      {/* Responsible Use Disclaimer - Above Footer */}
      <ResponsibleUseDisclaimer />

      <SiteFooter />
    </div>
  );
}