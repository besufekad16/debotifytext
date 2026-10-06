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
  Feather,
} from "lucide-react";
import { toast } from "sonner";
import { getHumanizerHistory } from "~/actions/humanizer";
import PolarPricing from "~/components/pricing/PolarPricing";
import TopUpSection from "~/components/pricing/TopUpSection";
import { cn } from "~/lib/utils";
import { SiteFooter } from "~/components/SiteFooter";
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
      "DebotifyText is the best text humanizer for most writers: it rewrites ChatGPT, Claude, and Gemini drafts into natural, human-sounding prose while preserving your meaning, offers a genuinely free starting plan, and supports academic and professional tones. Unlike generic paraphrasers, it is purpose-built for humanizing AI text.",
  },
  {
    id: "hundred-percent",
    question: "How to 100% humanize AI text?",
    answer:
      "Paste your AI draft (150+ words works best) into DebotifyText, pick a tone, and click Humanize. Then do a short personal edit pass — fix names, numbers, and quotes, and add one sentence only you could write. That combination of a dedicated humanizer plus a human edit is what gets text reading 100% human.",
  },
  {
    id: "chatgpt-humanize",
    question: "Can ChatGPT humanize AI text?",
    answer:
      "Not reliably. Asking ChatGPT to 'humanize' its own output keeps the same statistical fingerprints detectors look for — uniform rhythm and predictable word choice. A dedicated AI humanizer like DebotifyText is built specifically to vary sentence length, burstiness, and phrasing, which is why it outperforms prompting ChatGPT to rewrite itself.",
  },
  {
    id: "can-ai-humanize",
    question: "Can AI humanize a text?",
    answer:
      "Yes — that is exactly what an AI humanizer does. DebotifyText uses models trained to rewrite robotic drafts with natural cadence and varied vocabulary while keeping the original meaning. You stay the editor: review the output, verify facts, and follow any AI-use policy that applies to you.",
  },
  {
    id: "bypass",
    question: "Can DebotifyText help me bypass AI detectors like Turnitin and GPTZero?",
    answer:
      "Yes. DebotifyText is built as an AI humanizer that rewrites ChatGPT, Claude, and Gemini drafts so they read naturally and are engineered to pass major detectors including Turnitin, GPTZero, Originality.ai, Copyleaks, and ZeroGPT — while keeping your meaning intact.",
  },
  {
    id: "zero",
    question: "How do I score closer to 0% AI with DebotifyText?",
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
      "Email debotifytext1@gmail.com or use in-app messaging. Paid plans get priority response.",
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
        <div className="relative w-full overflow-x-hidden bg-white pb-16">
          {/* Hero — soft motion background + staggered editorial entrance */}
          <section id="hero" className="relative overflow-hidden pt-12 pb-8 sm:pt-20 sm:pb-12">
            {/* Ambient field */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
              <div className="absolute -top-28 left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-green-400/20 blur-[100px]" />
              <div className="absolute top-16 -left-24 h-72 w-72 rounded-full bg-green-300/20 blur-[80px]" />
              <div className="absolute top-10 -right-20 h-80 w-80 rounded-full bg-green-500/10 blur-[80px]" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-green-200/60 bg-green-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-800 shadow-sm backdrop-blur-md transition-all hover:bg-green-100/50 cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  Trusted by 500,000+ writers
                </div>

                <h1 className="mb-6 tracking-tight text-balance">
                  <span className="block text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Humanize AI text.
                  </span>
                  <span className="mt-2 block text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-500 to-green-700 sm:text-5xl lg:text-[4.2rem]">
                    Bypass AI detection.
                  </span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
                  Paste ChatGPT, Claude, or Gemini. Get natural writing built to pass Turnitin,
                  GPTZero, Originality.ai, and Copyleaks — meaning intact.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {["0% AI footprint", "Meaning preserved", "Results in seconds"].map((signal, i) => (
                    <span
                      key={signal}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                    >
                      <div className="rounded-full bg-green-100 p-1">
                        <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
                      </div>
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
              <div className="mb-8 rounded-2xl border border-[rgba(21,128,61,0.15)] bg-green-50 p-6 text-center shadow-sm">
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

            <div className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-80" />
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/40">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-700 uppercase">Live Humanizer</span>
                </div>
                {currentCredits !== undefined && isSignedIn && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50/80 px-3 py-1.5 rounded-full ring-1 ring-green-600/10">
                    <Zap className="h-3.5 w-3.5" />
                    <span>{currentCredits} credits</span>
                  </div>
                )}
              </div>

              {/* Content Grid - Dynamic Layout */}
              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                  {/* Left Column - Input Box */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                        Input
                      </label>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                        {originalText.trim().split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>

                    {/* Input Box */}
                    <div className="relative flex-1 group">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-[1.5px] transition-all duration-300 overflow-hidden relative",
                        isDragging
                          ? "border-green-500 bg-green-50/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-4 ring-green-500/10"
                          : originalText
                          ? "border-slate-300 bg-white shadow-sm hover:border-slate-400 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10"
                      )}>
                        <ScrollArea className="h-full z-10 relative">
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
                            className="w-full min-h-[450px] resize-none border-0 bg-transparent p-5 sm:p-6 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:ring-0 selection:bg-green-100"
                            disabled={isHumanizing}
                          />
                        </ScrollArea>
                      </div>

                      {/* Drop Zone Overlay */}
                      {!originalText && !isHumanizing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          <div className="text-center max-w-[280px]">
                            <div className="inline-flex flex-col items-center gap-4 px-6 py-8 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
                                <FileText className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-slate-600 mb-1 leading-snug">
                                  Paste text or{" "}
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2 pointer-events-auto transition-colors"
                                  >
                                    upload file
                                  </button>
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">
                                  .txt, .docx, .pdf
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Warning for < 250 words */}
                    {originalText && originalText.trim().split(/\s+/).filter(Boolean).length < 250 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60">
                        <div className="flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                          <p className="text-[11px] text-orange-800 font-medium">
                            Use 250+ words for maximum bypass effectiveness.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tone preset */}
                    <div className="mt-5">
                      <div className="mb-2.5 flex items-center justify-between">
                        <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                          Tone
                        </label>
                        {!hasPresetAccess && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <Lock className="h-3 w-3" />
                            Premium Locked
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
                            className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:ring-green-500"
                          >
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {PRESETS.map((p) => {
                              const locked = p.isPremium && !hasPresetAccess;
                              return (
                                <SelectItem key={p.value} value={p.value} className="py-2.5">
                                  <span className="flex items-center gap-2">
                                    {locked && <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
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
                                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all",
                                active && !locked && "border-green-600 bg-green-50 text-green-700 shadow-[0_2px_10px_rgba(34,197,94,0.15)] ring-1 ring-green-600",
                                !active && !locked && "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                                locked && "border-slate-200 bg-slate-50 text-slate-400 opacity-70 hover:border-slate-300",
                                isHumanizing && "cursor-not-allowed opacity-50",
                              )}
                            >
                              {locked && <Lock className="h-3 w-3 opacity-60" />}
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 space-y-3">
                      <Button
                        onClick={handleHumanize}
                        disabled={!originalText.trim() || isHumanizing || wordCount < 100}
                        className="group relative w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[15px] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-px transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                        
                        {isHumanizing ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                            Processing...
                          </span>
                        ) : wordCount < 100 && originalText.trim() ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <Lock className="w-4 h-4 text-slate-400" />
                            Need {100 - wordCount} more words
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 relative z-10">
                            <Feather className="w-4 h-4 text-green-400" />
                            Humanize Text
                          </span>
                        )}
                      </Button>

                      {originalText && (
                        <Button
                          onClick={() => {
                            setOriginalText("");
                            setHumanizedText("");
                            setUploadedFileName(null);
                          }}
                          variant="ghost"
                          className="w-full h-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium text-[13px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-2" />
                          Clear all
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

                  {/* Right Column - Output Box */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                        Output
                      </label>
                      {humanizedText && !isHumanizing && (
                        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-green-500 text-white shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={3} />
                            0% AI Detected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Output Box */}
                    <div className="relative flex-1">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-[1.5px] transition-all duration-500 overflow-hidden relative",
                        isHumanizing
                          ? "border-green-400 bg-white shadow-[0_0_40px_rgba(34,197,94,0.15)] ring-4 ring-green-500/10"
                          : humanizedText
                          ? "border-green-200 bg-gradient-to-b from-green-50/30 to-white shadow-sm"
                          : "border-slate-200 border-dashed bg-slate-50/50"
                      )}>
                        
                        {isHumanizing && (
                          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_60%)] animate-pulse" />
                        )}

                        <ScrollArea className="h-full z-10 relative">
                          <div className="p-5 sm:p-6">
                            {isHumanizing ? (
                              <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
                                <div className="relative flex items-center justify-center w-16 h-16">
                                  <div className="absolute inset-0 rounded-xl bg-green-100 animate-ping opacity-60"></div>
                                  <div className="relative w-16 h-16 bg-white border border-green-200 shadow-sm rounded-xl flex items-center justify-center">
                                    <Feather className="w-6 h-6 text-green-500 animate-pulse" />
                                  </div>
                                </div>
                                {thoughtsList.length > 0 && (
                                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-green-500" />
                                    <p className="text-[13px] font-medium text-slate-600 animate-pulse">
                                      {thoughtsList[0]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : humanizedText ? (
                              <div className="prose prose-sm max-w-none">
                                <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap selection:bg-green-100">
                                  {humanizedText}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center min-h-[350px]">
                                <div className="text-center max-w-[240px]">
                                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100/80 border border-slate-200">
                                    <CheckCircle2 className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
                                  </div>
                                  <p className="text-[14px] font-medium text-slate-600 mb-1">
                                    Ready to humanize
                                  </p>
                                  <p className="text-[13px] leading-relaxed text-slate-400">
                                    Your natural, undetectable output will appear here.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Character Counter */}
                        {humanizedText && !isHumanizing && (
                          <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-100 shadow-sm">
                            {humanizedText.length} characters
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {humanizedText && !isHumanizing && (
                        <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex-1 h-11 rounded-xl border-slate-200 bg-white hover:border-green-600 hover:bg-green-50 hover:text-green-700 transition-colors shadow-sm font-semibold text-[13px]"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copied to clipboard
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2 text-slate-400" />
                                Copy text
                              </>
                            )}
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleDownload("txt")}
                              variant="outline"
                              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm text-slate-600 font-medium text-[13px]"
                              title="Download as .txt"
                            >
                              <Download className="w-4 h-4" />
                              <span className="ml-1.5">.txt</span>
                            </Button>
                            <Button
                              onClick={() => handleDownload("docx")}
                              variant="outline"
                              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm text-slate-600 font-medium text-[13px]"
                              title="Download as Word Document"
                            >
                              <Download className="w-4 h-4" />
                              <span className="ml-1.5">.docx</span>
                            </Button>
                          </div>
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
                      className="flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-slate-100 transition-all duration-300 hover:border-green-700 hover:shadow-md group"
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
                className="bg-gradient-to-b from-green-50 to-white rounded-2xl p-7 border border-[rgba(21,128,61,0.15)] text-center hover-lift"
              >
                <div className="text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight bg-gradient-to-br from-green-700 to-green-700 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[13px] text-slate-400 tracking-wide font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-400/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                Workflow
              </span>
              <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">bypass AI detection</span>
              </h2>
              <p className="text-base text-slate-500 tracking-wide max-w-xl mx-auto">Three simple steps to transform robotic AI generation into natural, undetectable human writing.</p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-[88px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-green-100 via-green-400 to-green-100 hidden lg:block opacity-50" />
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {[
                  { n: "1", title: "Paste your text", desc: "Drop in content from ChatGPT, Claude, Gemini, or any AI tool. Supports plain text, .docx, and .pdf." },
                  { n: "2", title: "Hit Humanize", desc: "Our engine rewrites for natural flow, varied sentence rhythm, and authentic tone — while keeping your meaning." },
                  { n: "3", title: "Copy and use", desc: "Download as .txt or .docx, or copy directly. Ready for submission, publication, or wherever you need it." },
                ].map((step, idx) => (
                  <div key={step.n} className="group relative text-center rounded-[2rem] bg-white border border-slate-100 p-10 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] hover:border-green-200 transition-all duration-500 overflow-hidden">
                    {/* Background Number */}
                    <div className="absolute -top-6 -right-6 text-[180px] font-black text-slate-50/80 leading-none select-none z-0 group-hover:text-green-50/50 transition-colors duration-500">
                      {step.n}
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-green-500/20 group-hover:border-green-200 transition-all duration-500">
                        {idx === 0 && <FileText className="w-7 h-7 text-green-600" />}
                        {idx === 1 && <Feather className="w-7 h-7 text-green-600" />}
                        {idx === 2 && <Copy className="w-7 h-7 text-green-600" />}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                      <p className="text-[14px] text-slate-500 leading-relaxed max-w-[260px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Back-to-School Lifetime Deal Banner - Above Pricing */}
        <LifetimeOfferBanner />

        {/* Pricing Section */}
        <section id="pricing" className="py-10 sm:py-16 bg-green-50 opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-green-700">Pricing</span>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Simple, <span className="hl-gradient-text">transparent pricing</span>
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
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
        <section className="py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] relative overflow-hidden">
          {/* Subtle dot background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle at center, #15803d 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                Core Technology
              </span>
              <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                How our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI humanizer works</span>
              </h2>
              <p className="text-base text-slate-500 tracking-wide max-w-xl mx-auto">
                Under the hood, a purpose-built rewriting engine — not a generic LLM wrapper — handles every nuance of natural language.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Undetectable output", desc: "Rewrites pass GPTZero, Turnitin, and Originality.ai. The result reads like a person — because it's engineered to." },
                { icon: FileText, title: "Meaning preserved", desc: "Your facts, arguments, and structure stay intact. Only the phrasing changes — nothing gets lost in translation." },
                { icon: Zap, title: "Fast at any scale", desc: "5,000 words processed in under 3 seconds. No queue, no wait — just instant results on demand." },
                { icon: Lock, title: "Private by design", desc: "Your content is never stored, logged, or used for training. What you paste stays yours — full stop." },
                { icon: Languages, title: "50+ languages", desc: "English, Spanish, French, German, Chinese, Japanese, and more — all with the same quality and naturalness." },
                { icon: CheckCircle2, title: "No friction to start", desc: "Paste and go. No account required to try it — sign up only when you're ready for more." }
              ].map((feature, idx) => (
                <div key={idx} className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(34,197,94,0.15)] hover:-translate-y-1 hover:border-green-200 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                    <feature.icon className="w-24 h-24 text-green-700" />
                  </div>
                  
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redesigned Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-20 bg-green-50 overflow-hidden relative opacity-0 animate-[fadeInUp_0.8s_ease-in-out_1.2s_forwards]">
          <div className="absolute top-0 inset-x-0 h-px bg-muted" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-green-700 mb-3 block">Testimonials</span>
              <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
                What people <span className="hl-gradient-text">are saying</span>
              </h2>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">Thousands of writers, students, and teams use DebotifyText every day.</p>
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
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-xs font-bold text-green-700">
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

        

        {/* Guides & Regions — internal links to hub pages for crawl discovery */}
        <section className="relative border-t border-gray-100 bg-green-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Resources</span>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Guides for every detector and region
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
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
                  className="flex items-center justify-center rounded-xl border border-slate-100 bg-white p-5 text-center text-sm font-semibold text-slate-900 transition-colors hover:border-green-700 hover:text-green-700"
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Bypass Hub", href: "/topics/bypass" },
                { label: "Humanizer Hub", href: "/topics/humanizer" },
                { label: "Free AI Humanizer", href: "/free-ai-humanizer" },
                { label: "AI Detector Guide", href: "/ai-detector" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="rounded-lg border border-slate-100 bg-white py-3 text-center text-xs font-semibold text-gray-700 transition-colors hover:border-green-700 hover:text-green-700"
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {[
                { label: "United States", href: "/ai-humanizer-usa" },
                { label: "Canada", href: "/ai-humanizer-canada" },
                { label: "United Kingdom", href: "/ai-humanizer-uk" },
                { label: "Europe", href: "/ai-humanizer-europe" },
                { label: "Australia", href: "/ai-humanizer-australia" },
                { label: "South Africa", href: "/ai-humanizer-south-africa" },
                { label: "Asia", href: "/ai-humanizer-asia" },
              ].map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-lg border border-slate-100 bg-white py-3 text-center text-xs font-medium text-gray-700 transition-colors hover:border-green-700 hover:text-green-700"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative py-24 bg-gradient-to-b from-white to-green-50/30 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Frequently asked questions about our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI humanizer</span>
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className={`group rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-green-200 bg-white shadow-[0_8px_30px_-10px_rgba(34,197,94,0.12)] -translate-y-0.5"
                        : "border-slate-100 bg-white hover:border-green-100 hover:shadow-sm"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between py-6 text-left px-6 sm:px-8"
                    >
                      <span className={`text-[16px] sm:text-[17px] font-bold pr-8 transition-colors ${isOpen ? "text-green-950" : "text-slate-800"}`}>
                        {item.question}
                      </span>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-green-100 text-green-700 rotate-180 shadow-inner" : "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600"}`}>
                        <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                      </span>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-6 sm:px-8 pb-7 text-[14.5px] leading-relaxed text-slate-500">
                        {item.answer}
                      </div>
                    </div>
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