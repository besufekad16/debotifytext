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
  Sparkles,
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
  GraduationCap,
  CheckCircle2,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { getHumanizerHistory } from "~/actions/humanizer";
import PolarPricing from "~/components/pricing/PolarPricing";
import TopUpSection from "~/components/pricing/TopUpSection";
import { cn } from "~/lib/utils";
import { SiteFooter } from "~/components/SiteFooter";
import HowToUseSection from "~/components/HowToUseSection";
import FactsSection from "~/components/FactsSection";

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

const DETECTOR_BADGES = [
  {
    name: "Turnitin",
    accent: "bg-[#f7faff]", // softer red tint
    logoSrc: "/logo/turnitin.png",
  },
  {
    name: "GPTZero",
    accent: "bg-[#f5faff]", // soft green tint
    logoSrc: "/logo/GPTZero.png",
  },
  {
    name: "Copyleaks",
    accent: "bg-[#f5faff]", // soft blue tint
    logoSrc: "/logo/copyleaks.png",
  },
  {
    name: "ZeroGPT",
    accent: "bg-[#f4fdfa]", // gentle purple tint
    logoSrc: "/logo/zeroGPT.png",
  },
  {
    name: "QuillBot",
    accent: "bg-[#f5fdf7]", // subtle green tint
    logoSrc: "/logo/quillbot.png",
  },
  {
    name: "Originality.ai",
    accent: "bg-[#faf8ff]", // light peach tint
    logoSrc: "/logo/originality.png",
  },
  {
    name: "Sapling",
    accent: "bg-[#fdf5f5]", // light natural green
    logoSrc: "/logo/sapling.png",
  },
  {
    name: "Writer",
    accent: "bg-[#f7faff]", // very soft blue
    logoSrc: "/logo/writer.png",
  },
];

const INSTITUTES = [
  { name: "Harvard University", src: "/institutes/Harvard_University_shield.png" },
  { name: "Stanford University", src: "/institutes/stanford-university-logo.png" },
  { name: "Miami University", src: "/institutes/Miami-University-Logo.png" },
  { name: "University of Oregon", src: "/institutes/University-of-Oregon-Logo.png" },
  { name: "Boise State University", src: "/institutes/bsu.png" },
  { name: "AW RUB", src: "/institutes/rub.png" },
  { name: "Marca Peru", src: "/institutes/marca_peu_150.png" },
];


const TESTIMONIALS = [
  {
    quote:
      "I rewrote parts of our documentation with Unrobotic Text. It actually sounded more human even though I wrote the text myself :)",
    name: "Amanuel Garmosa",
    role: "Founder of Canvelete",
  },
  {
    quote:
      "I paraphrased my essay and it actually passed all AI detectors. Quite impressive. I don't think others do that.",
    name: "Daniel Park",
    role: "Student",
  },
  {
    quote:
      "Reliable, fast, and trustworthy. Unrobotic Text helped us ship human-sounding knowledge base articles at scale.",
    name: "Nardos Mekuanint",
    role: "Product Marketing, DamaDash",
  },
  {
    quote:
      "The only humanizer so far that was able to pass all detectors without error.",
    name: "Abenezer Teklu",
    role: "Content writer",
  },
];

const FAQ_ITEMS = [
  {
    id: "privacy",
    question: "Will my uploads stay private?",
    answer:
      "Absolutely. Your text is encrypted in transit and at rest. We never train on your data, and you can delete your history any time.",
  },
  {
    id: "accuracy",
    question: "How accurate is the humanization?",
    answer:
      "Unrobotic Text blends large language models with our post-processing engine to introduce human quirks while preserving meaning. You can choose the tone that best fits your context.",
  },
  {
    id: "files",
    question: "Which file formats can I upload?",
    answer:
      "You can paste text directly or upload .txt, .docx, or .pdf files. We'll extract the content automatically so you can humanize in one click.",
  },
  {
    id: "credits",
    question: "How do credits work?",
    answer:
      "Every one words uses one credit. Credits reset every month, and you can top up instantly on a paid plan.",
  },
  {
    id: "team",
    question: "Do you support teams?",
    answer:
      "Yes. The Ultra plan unlocks shared folders, usage insights, and single billing. Contact us to set up your workspace.",
  },
  {
    id: "support",
    question: "Can I talk to someone if I need help?",
    answer:
      "Of course. Reach us through the in-app chat or email unrobotictext@gmail.com. Pro and Premium customers receive priority responses.",
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

  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: 7 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

    const wordCount = originalText.trim().split(/\s+/).filter(Boolean).length;

    // Check minimum word count (50 words)
    if (wordCount < 50) {
      toast.error("Text must contain at least 50 words to be humanized");
      return;
    }

    if (currentCredits === undefined) {
      toast.info("Syncing your account credits, please wait a moment...");
      await fetchCredits(); // Try to fetch immediately
      return;
    }

    if (currentCredits === 0 || currentCredits < wordCount) {
      toast.error("You don't have enough credits. Please purchase more below.");
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
          toast.error(errorData.error || "Insufficient credits. Please purchase more credits to continue.");
          await fetchCredits(); // Refresh credits display
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
                // Mark that we've received the first chunk (for logging only)
                if (!firstChunkReceived) {
                  firstChunkReceived = true;
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
  }, [originalText, isSignedIn, currentCredits, preset, fetchCredits, fetchHistory]);

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
    setPreset(item.preset);
  };

  const wordCount = originalText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = originalText.length;
  // 1 credit = 1 word in the new system
  const estimatedCredits = wordCount;
  // Show output panel when humanizing, has humanized text, or is showing thoughts
  const showOutputPanel = isHumanizing || Boolean(humanizedText) || Boolean(thoughtsText);

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden w-full">
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
        {/* Social Proof Section - Pill Style */}
        <div className="w-full bg-slate-50 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {/* Pill 1 */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?img=${i + 5}`} alt="User" width={24} height={24} />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">300,000+</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Students & Writers</p>
                </div>
              </div>

              {/* Pill 2 */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">3M+</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Documents</p>
                </div>
              </div>

              {/* Pill 3 */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">50+</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero and Workspace Section with Seamless Gradient */}
        <div
          className="relative w-full overflow-x-hidden bg-slate-50 pb-20"
        >
          {/* Hero Section */}
          <section
            id="hero"
            className="relative pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-6"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Main Headline - Reduced Size */}
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 leading-tight px-2">
                  Make AI text{" "}
                  <span className="text-blue-600 font-semibold italic" style={{ fontFamily: '"Lora", serif', fontSize: '1.05em' }}>
                    Unrobotic
                  </span>
                  {" "}and bypass every{" "}
                  <span className="text-blue-600 font-semibold italic" style={{ fontFamily: '"Lora", serif', fontSize: '1.05em' }}>
                    detector
                  </span>
                  .
                </h1>

                {/* AI Detectors Section - Infinite Scroll - Smaller */}
                <div className="mt-2 sm:mt-3 lg:mt-4 mb-3 sm:mb-4 lg:mb-6 px-2 w-full overflow-hidden">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500 mb-2 sm:mb-3">
                    AI detectors we help you pass
                  </p>

                  <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scroll {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .animate-scroll {
                      animation: scroll 35s linear infinite;
                    }
                    .animate-scroll:hover {
                      animation-play-state: paused;
                    }
                  `}} />

                  <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div className="animate-scroll flex w-max items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 py-1">
                      {/* First set of badges */}
                      {DETECTOR_BADGES.map((detector) => (
                        <div
                          key={detector.name}
                          className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 opacity-80 transition-all duration-300 hover:opacity-100 cursor-pointer"
                        >
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center">
                            <Image
                              src={detector.logoSrc}
                              alt={`${detector.name} logo`}
                              width={28}
                              height={28}
                              className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 object-contain"
                            />
                          </div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-600 whitespace-nowrap">{detector.name}</p>
                        </div>
                      ))}
                      {/* Second set of badges for seamless looping */}
                      {DETECTOR_BADGES.map((detector) => (
                        <div
                          key={`${detector.name}-dup`}
                          className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 opacity-80 transition-all duration-300 hover:opacity-100 cursor-pointer"
                          aria-hidden="true"
                        >
                          <div className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center">
                            <Image
                              src={detector.logoSrc}
                              alt={`${detector.name} logo`}
                              width={28}
                              height={28}
                              className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 object-contain"
                            />
                          </div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-600 whitespace-nowrap">{detector.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Workspace - Within the same gradient container */}
          <section
            id="tool"
            className="scroll-mt-24 pb-6 sm:pb-8 lg:pb-10 relative -mt-6 sm:-mt-8 lg:-mt-10"
          >
            <div className="relative z-30 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

              {showSignInPrompt && !isSignedIn && (
                <div className="mt-8 rounded-3xl border border-[#bfdbfe] bg-[#e0f2fe] p-6 text-center shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Sign in to humanize your text</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Create a free account to get 50 starter credits and keep track of every version you humanize.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <SignInButton mode="modal">
                      <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.6)]">
                        Sign in to continue
                      </Button>
                    </SignInButton>
                  </div>
                </div>
              )}

              <div className="mt-0 space-y-4 sm:mt-1 sm:space-y-6">
                <div
                  className={cn(
                    "grid w-full gap-6",
                    showOutputPanel ? "lg:grid-cols-2 lg:items-start" : "justify-items-center"
                  )}
                >
                  <div
                    className={cn(
                      "w-full rounded-[20px] border border-slate-200/50 bg-white/85 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-slate-200/30",
                      showOutputPanel ? "lg:max-w-none" : "max-w-8xl"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Dropdown for all screen sizes */}
                      <div className="w-full sm:w-auto sm:min-w-[200px]">
                        <Select value={preset} onValueChange={(value) => {
                          const selectedPreset = PRESETS.find(p => p.value === value);
                          // Lock presets for basic users - only pro and ultra can use presets
                          const hasPresetAccess = subscriptionPlan === "pro" || subscriptionPlan === "ultra";
                          const isLocked = selectedPreset?.isPremium && !hasPresetAccess;
                          if (isLocked) {
                            toast.error("Presets are only available for Pro and Ultra subscribers. Upgrade to unlock!");
                            document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                            return;
                          }
                          setPreset(value);
                        }}>
                          <SelectTrigger className="w-full rounded-2xl border-slate-200 bg-white h-9 text-sm">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {PRESETS.map((presetOption) => {
                              // Lock presets for basic users - only pro and ultra can use presets
                              const hasPresetAccess = subscriptionPlan === "pro" || subscriptionPlan === "ultra";
                              const isLocked = presetOption.isPremium && !hasPresetAccess;
                              return (
                                <SelectItem
                                  key={presetOption.value}
                                  value={presetOption.value}
                                  disabled={isLocked}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{presetOption.label}</span>
                                    {isLocked && <Lock className="h-3 w-3 text-slate-400" />}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Keep desktop buttons but hidden */}
                      <div className="hidden">
                        {PRESETS.map((presetOption) => {
                          const isActive = preset === presetOption.value;
                          // Lock presets for basic users - only pro and ultra can use presets
                          const hasPresetAccess = subscriptionPlan === "pro" || subscriptionPlan === "ultra";
                          const isLocked = presetOption.isPremium && !hasPresetAccess;
                          const handleClick = () => {
                            if (isLocked) {
                              toast.error("Presets are only available for Pro and Ultra subscribers. Upgrade to unlock!");
                              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                              return;
                            }
                            setPreset(presetOption.value);
                          };

                          return (
                            <Tooltip key={presetOption.value}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={handleClick}
                                  className={cn(
                                    "group flex min-w-[115px] items-center justify-center gap-2 rounded-2xl border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcd4ff]",
                                    isLocked && "cursor-not-allowed opacity-60",
                                    isActive
                                      ? "border-[#b8a8ff] bg-[#f3efff] text-[#5c47d9] shadow-sm"
                                      : "border-slate-200 bg-white text-slate-600 hover:border-[#c9bdff] hover:text-slate-900"
                                  )}
                                >
                                  {presetOption.label}
                                  {isLocked ? (
                                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                                  ) : (
                                    <Info className="h-4 w-4 text-[#b2a3ff] opacity-0 transition-opacity group-hover:opacity-100" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={6}>
                                {isLocked ? "Premium feature - Upgrade to unlock" : presetOption.description}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                      {currentCredits !== undefined && isSignedIn && (
                        <div className="flex items-center gap-2 self-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> {currentCredits} credits
                        </div>
                      )}
                    </div>

                    {/* Unified Input Card */}
                    <div className="group relative mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl transition-all hover:shadow-2xl">

                      {/* Textarea Section */}
                      <div className="relative">
                        <Textarea
                          value={originalText}
                          onChange={(e) => setOriginalText(e.target.value)}
                          placeholder="Paste or type the text you want to humanize…"
                          className={cn(
                            "h-[400px] w-full resize-none border-none bg-transparent px-6 py-6 text-base text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0",
                            isDragging && "bg-blue-50/50"
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          spellCheck={false}
                        />

                        {/* Drag & Drop Overlay (Empty State) */}
                        {!originalText && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="pointer-events-auto">
                              <div
                                className={cn(
                                  "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all",
                                  isDragging
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-slate-200 bg-slate-50/80 hover:border-blue-400 hover:bg-white"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-100">
                                  <UploadCloud className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    Drop files here or{" "}
                                    <button
                                      type="button"
                                      className="text-blue-600 hover:text-blue-700 hover:underline"
                                      onClick={() => fileInputRef.current?.click()}
                                    >
                                      browse
                                    </button>
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">Supports .txt, .md, .docx • Max 2MB</p>
                                </div>
                                {uploadedFileName && (
                                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10">
                                    <FileText className="h-3.5 w-3.5" /> {uploadedFileName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".txt,.md,.markdown,.doc,.docx,.csv,.json"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                      </div>

                      {/* Toolbar / Footer */}
                      <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between rounded-b-3xl">

                        {/* Left Side: Stats */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                          {!showOutputPanel ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-500 font-medium">
                              {wordCount > 0 ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                  Estimated credits: <span className="font-bold text-slate-900">{estimatedCredits}</span>
                                </span>
                              ) : (
                                <span className="text-slate-400">Add text to see estimates</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                              <span>{wordCount} words</span>
                              <span className="text-slate-300">•</span>
                              <span>{charCount} chars</span>
                            </div>
                          )}

                          {!showOutputPanel && (
                            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                              <span>{wordCount} words</span>
                              <span className="text-slate-300">•</span>
                              <span>{charCount} chars</span>
                            </div>
                          )}
                        </div>

                        {/* Right Side: Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            onClick={() => {
                              setOriginalText("");
                              setHumanizedText("");
                              setUploadedFileName(null);
                            }}
                            disabled={!originalText && !humanizedText}
                          >
                            Reset
                          </Button>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleHumanize}
                                disabled={isHumanizing || !originalText.trim()}
                                className="h-9 px-6 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] disabled:opacity-60 disabled:shadow-none"
                              >
                                {isHumanizing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin text-white mr-2" /> Humanizing
                                  </>
                                ) : (
                                  "Humanize text"
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Press {isMac ? 'Cmd' : 'Ctrl'}+Enter to humanize</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>

                  {showOutputPanel && (
                    <div className="w-full rounded-[20px] border border-slate-200/50 bg-white/85 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-slate-200/30">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Humanized output</p>
                          <p className="text-[10px] text-slate-500">Your natural, detection-safe copy.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!humanizedText}
                            className="h-8 text-xs rounded-full border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          >
                            {copied ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload("txt")}
                            disabled={!humanizedText}
                            className="h-8 text-xs rounded-full border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          >
                            <Download className="h-3 w-3" /> .txt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload("docx")}
                            disabled={!humanizedText}
                            className="h-8 text-xs rounded-full border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          >
                            <Download className="h-3 w-3" /> .docx
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 h-[380px] rounded-2xl border border-slate-100 bg-slate-50/80 p-1 overflow-hidden relative outline-none focus-visible:outline-none focus-visible:ring-0">
                        {/* Background Output Panel */}
                        <ScrollArea className="h-full w-full bg-white p-4 outline-none focus-visible:outline-none focus-visible:ring-0">
                          {humanizedText && (
                            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 relative">
                              {humanizedText.split("\n\n").map((paragraph, index) => (
                                <p key={`${index}-${paragraph.slice(0, 16)}`} className="whitespace-pre-wrap mb-4">
                                  {paragraph}
                                </p>
                              ))}
                              {isHumanizing && (
                                <span className="inline-block w-[2px] h-5 bg-[#3b82f6] animate-pulse ml-0.5"></span>
                              )}
                            </div>
                          )}
                        </ScrollArea>

                        {/* Simple Processing UI - Centered in output box */}
                        {isHumanizing && thoughtsList.length > 0 && (humanizedText.length === 0 || humanizedText.length < 50) && (
                          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                            <div className="flex items-center gap-3">
                              <Loader2 className="h-5 w-5 animate-spin text-[#3b82f6]" />
                              <p className="text-base text-slate-600 font-medium">
                                {thoughtsList[0]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[10px] text-slate-500 text-center">
                          <span className="font-medium text-slate-700">Version history:</span> {history.length > 0 ? `${history.length} saved outputs` : "Sign in to unlock"}
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[10px] text-slate-500 text-center">
                          <span className="font-medium text-slate-700">Detection score:</span> {humanizedText && !isHumanizing && currentAiScore !== null && currentAiScore > 0 ? <span className="font-bold text-green-600">{Math.round((1) * 100)}% Human</span> : "Visible once humanized"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bypass AI Detection for Students - New Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Bypass AI Detection for <span className="text-blue-600">Everyone</span></h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Whether you're a student, writer, or professional, we help you stay undetectable.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: GraduationCap, title: "For Students", desc: "Submit assignments with confidence. Turn AI drafts into human-grade essays that pass formatting and detection checks." },
                { icon: FileText, title: "For Content Writers", desc: "Scale your content production without risking SEO penalties. Keep your unique voice while using AI tools." },
                { icon: Users, title: "For Professionals", desc: "Ensure your reports and emails sound authentic and personal, maintaining professional relationships." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights of Undetected - New Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-3 block">Features</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Highlights of Unrobotic Text</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Anti-AI Detector", desc: "Advanced algorithms specifically trained to bypass Turnitin, GPTZero, and Originality.ai." },
                { title: "Error-Free Writing", desc: "Maintains perfect grammar and syntax while humanizing your text." },
                { title: "SEO Optimized", desc: "Retains keywords and readability to ensure your content ranks high." },
                { title: "Plagiarism Free", desc: "Generates unique content that passes all standard plagiarism checks." },
                { title: "Context Aware", desc: "Understands the nuance of your text to preserve the original meaning." },
                { title: "Instant Processing", desc: "Get humanized results in seconds, not minutes." }
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 hover:border-blue-200 transition-colors">
                  <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institutes Section - Static Logo Cloud (Clean & Simple) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by Students & Researchers From</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 opacity-50 hover:opacity-100 transition-opacity duration-500">
              {INSTITUTES.map((inst, idx) => (
                <div key={`${inst.name}-${idx}`} className="w-32 sm:w-40 h-16 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image src={inst.src} alt={inst.name} width={160} height={80} className="object-contain max-h-14" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Hero Banner with Falling Snow - Compact Ad Style */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
          <div className="relative py-10 px-6 md:px-10 bg-white overflow-hidden text-slate-900 rounded-2xl border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            {/* Snow Animation Styles */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes fall {
                0% { transform: translateY(-10vh) translateX(0); opacity: 0.8; }
                100% { transform: translateY(110%) translateX(20px); opacity: 0.2; }
              }
              .snowflake {
                position: absolute;
                top: -20%;
                color: #cbd5e1; /* Slate-300 for visibility on white */
                user-select: none;
                pointer-events: none;
                animation-name: fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                z-index: 1; /* Ensure behind text which is z-10 */
              }
            `}} />

            {/* Snowflakes - Light Blue/Gray */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 5 + 6}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 1.5 + 1.5}em`, // Bigger snow: 1.5em to 3em
                  opacity: Math.random() * 0.4 + 0.3 // adjusted visibility
                }}
              >
                ❄
              </div>
            ))}

            <div className="absolute inset-0 bg-blue-50/50 z-0" />

            {/* Left: Content */}
            <div className="flex-1 text-center md:text-left z-10 relative">
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" /> 300,000+ Users Celebration
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                Get <span className="text-blue-600">50% OFF</span> Pro Plans
              </h2>
              <p className="text-sm text-slate-500 font-medium">Limited time offer for our community.</p>
            </div>

            {/* Center: Timer (Light Theme) */}
            <div className="flex gap-3 z-10 relative">
              {[
                { label: 'D', value: timeLeft.days },
                { label: 'H', value: timeLeft.hours },
                { label: 'M', value: timeLeft.minutes },
                { label: 'S', value: timeLeft.seconds }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm text-slate-900">
                    <span className="text-sm md:text-base font-bold font-mono tabular-nums">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Right: CTA */}
            <div className="w-full md:w-auto z-10 relative">
              <Button
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full md:w-auto h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 transition-all hover:scale-105"
              >
                Claim 50% Off
              </Button>
            </div>

          </div>
        </section>

        {/* Pricing Section (Untouched logic, just moved) */}
        <section id="pricing" className="py-10 sm:py-16 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">Pricing</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Choose your plan
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                Transparent pricing with zero lock-in. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="mt-12">
              <PolarPricing isTeamMember={isTeamMember} />
            </div>

            {subscriptionPlan && <TopUpSection />}
          </div>
        </section>

        {/* Transform Your Content (Formerly How To Use) */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Transform Your Content with <span className="text-blue-600">Ease</span></h2>
              <p className="mt-4 text-slate-500">Three simple steps to undetectable content.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                <div className="absolute -top-4 left-8 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">1</div>
                <div className="h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center border border-slate-100">
                  <Copy className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Paste Content</h3>
                <p className="text-sm text-slate-500">Copy your AI-generated text from ChatGPT, Claude, or Gemini and paste it into our editor.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                <div className="absolute -top-4 left-8 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">2</div>
                <div className="h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center border border-slate-100">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Humanize</h3>
                <p className="text-sm text-slate-500">Click the "Humanize" button. Our engine rewrites the text to sound natural and human.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative">
                <div className="absolute -top-4 left-8 bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">3</div>
                <div className="h-40 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center border border-slate-100">
                  <CheckCircle2 className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Bypass</h3>
                <p className="text-sm text-slate-500">Use the output with confidence. It will bypass all major AI detectors and read naturally.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Benefits Section */}
        <section className="py-20 bg-blue-600 text-white overflow-hidden relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-blue-100 font-bold tracking-wide uppercase text-xs mb-4 block">Why Choose Us</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">Benefits <br />Unrobotic Text Offers</h2>
                <div className="space-y-6">
                  {[
                    "Guaranteed Bypass Rate of 99.9%",
                    "Preserves Original Meaning & Context",
                    "No Grammar or Spelling Errors",
                    "SEO-Friendly Output",
                    "Completely Private & Secure"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-blue-50 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="rounded-full bg-white px-8 py-6 text-base font-bold text-blue-600 shadow-xl shadow-blue-900/20 hover:bg-blue-50 hover:scale-105 transition-all"
                  >
                    Start Humanizing Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-blue-100 font-mono">bypass_check.exe</div>
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    {["GPTZero", "Originality.ai", "Turnitin", "Crossplag", "Copyleaks"].map((detector, i) => (
                      <div key={detector} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-blue-100">{detector}</span>
                        <span className="text-emerald-300 font-bold flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> PASSED</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Redesigned Testimonials Section */}
        <section id="testimonials" className="py-24 sm:py-32 bg-slate-50 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-px bg-slate-200" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-4 block">Testimonials</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">You're in good <span className="text-blue-600 relative inline-block">company<span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/50 -z-10 rounded-full"></span></span></h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Join thousands of students and professionals who trust Unrobotic Text.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {t.name[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-xs truncate">{t.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-slate-100 py-12 sm:py-14 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">FAQ</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Get quick answers</h3>
              <p className="mt-3 text-base text-slate-600">
                Everything you need to know about Humanizer’s security, pricing, and workflow.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {FAQ_ITEMS.map((item) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-1"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between rounded-3xl bg-white px-6 py-4 text-left"
                    >
                      <span className="text-base font-medium text-slate-800">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
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
      <SiteFooter />
    </div>
  );
}
