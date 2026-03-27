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
import PricingModal from "~/components/PricingModal";
import { usePricingModal } from "~/hooks/usePricingModal";
import DetectorShowcase from "~/components/DetectorShowcase";
import LargeDiscountBanner from "~/components/LargeDiscountBanner";
import ResponsibleUseDisclaimer from "~/components/ResponsibleUseDisclaimer";

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
    id: "privacy",
    question: "How is my data protected?",
    answer:
      "Enterprise-grade encryption protects your content in transit and at rest. We never train models on your data, and you maintain full control with instant deletion capabilities.",
  },
  {
    id: "accuracy",
    question: "What is the humanization quality rate?",
    answer:
      "HumanifyLab utilizes advanced language models combined with sophisticated post-processing algorithms to transform AI text into natural, professional human writing while preserving semantic integrity and contextual meaning.",
  },
  {
    id: "files",
    question: "Which file formats are supported?",
    answer:
      "The platform accepts direct text input or file uploads in .txt, .docx, and .pdf formats. Content is automatically extracted and processed for immediate humanization.",
  },
  {
    id: "credits",
    question: "How does the credit system work?",
    answer:
      "Credits operate on a 1:1 word ratio. Monthly allocations reset automatically, with instant top-up options available for paid subscriptions.",
  },
  {
    id: "team",
    question: "Are team and enterprise plans available?",
    answer:
      "Yes. Premium plans include collaborative workspaces, usage analytics, centralized billing, and dedicated support. Contact our team to configure your enterprise deployment.",
  },
  {
    id: "support",
    question: "What support channels are available?",
    answer:
      "Access support through in-app messaging or email at humanifylab1@gmail.com. Premium and Enterprise subscribers receive priority response with dedicated account management.",
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
  
  // Pricing Modal Hook
  const { isOpen: isPricingModalOpen, closeModal: closePricingModal } = usePricingModal();
  
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
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden w-full scroll-smooth">
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

      <main className="flex-1 w-full pt-32">
        {/* Hero and Workspace Section */}
        <div className="relative w-full overflow-x-hidden bg-white pb-16">
          {/* Subtle top gradient wash */}
          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#faf7f4] to-white pointer-events-none" />

          {/* Hero Section */}
          <section className="relative pt-14 pb-4 sm:pt-20 sm:pb-6 overflow-hidden">
            {/* Small bubble pattern background - perfectly aligned grid */}
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: `radial-gradient(circle, #8B6F47 3px, transparent 3px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: 'center'
            }}></div>


            <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">

                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#faf7f4] border border-[#e8ddd5] px-3.5 py-1.5 text-[11px] font-medium text-[#7a5c44] mb-7 tracking-widest uppercase">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#5e3d2a]" />
                  Trusted by 500,000+ writers worldwide
                </div>

                {/* Main Heading */}
                <h1 className="mb-5 tracking-tight">
                  <span
                    className="block text-[2rem] sm:text-[2.75rem] lg:text-[3.1rem] font-bold text-gray-950 leading-[1.15]"
                    style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}
                  >
                    AI text that reads like
                  </span>
                  <span
                    className="block text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem] text-[#5e3d2a] leading-[1.1] mt-0.5"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 500 }}
                  >
                    you wrote it
                  </span>
                </h1>

                {/* Subheadline */}
                <p
                  className="text-[14.5px] text-gray-400 leading-[1.7] max-w-md mx-auto mb-8 font-normal"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Paste any AI-generated content and get back clean, natural writing —
                  undetectable, meaning-preserved, ready to use.
                </p>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[12px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-[#5e3d2a]" />
                    No AI footprint
                  </span>
                  <span className="text-gray-200 hidden sm:block">·</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-[#5e3d2a]" />
                    Meaning intact
                  </span>
                  <span className="text-gray-200 hidden sm:block">·</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-[#5e3d2a]" />
                    Results in under 3 seconds
                  </span>
                </div>

              </div>
            </div>
          </section>

          {/* Main Workspace - Humanizer Tool */}
          <section id="tool" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            {showSignInPrompt && !isSignedIn && (
              <div className="mb-8 border border-[#D4C4B0] bg-[#F5E6D3] p-6 text-center shadow-sm">
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

            <div className="bg-white shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-[#8B6F47] animate-[glow_2s_ease-in-out_infinite]"></div>
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#8B6F47] opacity-50 animate-[ping_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">LIVE HUMANIZER</span>
                </div>
                {currentCredits !== undefined && isSignedIn && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 bg-white px-3 py-1.5 border border-gray-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-#F5E6D30 flex-shrink-0" />
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
                        "h-[450px] border-2 transition-all duration-200 overflow-hidden",
                        isDragging
                          ? "border-[#8B6F47] bg-[#F5E6D3]/30 shadow-lg shadow-[#8B6F47]/20"
                          : originalText
                          ? "border-[#A0826D] bg-white shadow-sm"
                          : "border-[#D4C4B0] bg-[#F5E6D3]/20"
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
                            <div className="inline-flex flex-col items-center gap-3 px-6 py-6 border-2 border-dashed border-[#8B6F47] bg-white/80 backdrop-blur-sm">
                              <div className="w-12 h-12 bg-[#8B6F47]/10 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-[#8B6F47]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Paste your text or{" "}
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[#8B6F47] hover:text-[#6D5635] font-semibold underline pointer-events-auto transition-colors"
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
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#8B6F47] text-white text-xs font-medium">
                          {originalText.trim().split(/\s+/).filter(Boolean).length} words
                        </div>
                      )}
                    </div>

                    {/* Warning for < 250 words */}
                    {originalText && originalText.trim().split(/\s+/).filter(Boolean).length < 250 && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 font-medium">
                            For better results, use 250+ words
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-3">
                      <Button
                        onClick={handleHumanize}
                        disabled={!originalText.trim() || isHumanizing || wordCount < 100}
                        className="w-full h-12 bg-gradient-to-r from-[#8B6F47] to-[#6D5635] hover:from-[#6D5635] hover:to-[#5A4529] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
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
                            <Sparkles className="w-5 h-5 mr-2" />
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
                          className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm"
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
                          <span className="text-xs px-2 py-1 bg-[#8B6F47] text-white font-medium">
                            100% Human
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Output Box */}
                    <div className="relative flex-1">
                      <div className={cn(
                        "h-[450px] border-2 transition-all duration-200 overflow-hidden",
                        humanizedText && !isHumanizing
                          ? "border-[#A0826D] bg-white shadow-sm"
                          : "border-[#D4C4B0] bg-gray-50"
                      )}>
                        <ScrollArea className="h-full">
                          <div className="p-4 sm:p-5">
                            {isHumanizing ? (
                              <div className="flex flex-col items-center justify-center min-h-[310px] gap-4">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full border-4 border-[#F5E6D3]"></div>
                                  <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-[#8B6F47] animate-spin"></div>
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
                                  <div className="w-14 h-14 bg-[#8B6F47]/10 flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-7 h-7 text-[#8B6F47]" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-500 mb-1">
                                    Humanized output will appear here
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Enter text on the left to get started
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Character Counter */}
                        {humanizedText && !isHumanizing && (
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1">
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
                            className="flex-1 h-10 border-gray-300 hover:border-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#6D5635] transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-[#5e3d2a]" />
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
                            className="h-10 px-4 border-gray-300 hover:border-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#6D5635] transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            .txt
                          </Button>
                          <Button
                            onClick={() => handleDownload("docx")}
                            variant="outline"
                            className="h-10 px-4 border-gray-300 hover:border-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#6D5635] transition-colors"
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
                      className="flex-shrink-0 flex items-center justify-center px-6 py-3 bg-white border border-gray-200 transition-all duration-300 hover:border-[#8B6F47] hover:shadow-md group"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="bg-white rounded-xl p-5 shadow-none border border-gray-100 text-center hover:shadow-sm transition-shadow">
              <div className="text-[1.4rem] font-bold text-[#5e3d2a] mb-0.5 tracking-tight">
                1.2M+
              </div>
              <div className="text-[12px] text-gray-400 tracking-wide">
                Documents humanized
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-xl p-5 shadow-none border border-gray-100 text-center hover:shadow-sm transition-shadow">
              <div className="text-[1.4rem] font-bold text-[#5e3d2a] mb-0.5 tracking-tight">
                98.7%
              </div>
              <div className="text-[12px] text-gray-400 tracking-wide">
                Detection bypass rate
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-xl p-5 shadow-none border border-gray-100 text-center hover:shadow-sm transition-shadow">
              <div className="text-[1.4rem] font-bold text-[#5e3d2a] mb-0.5 tracking-tight">
                &lt;3s
              </div>
              <div className="text-[12px] text-gray-400 tracking-wide">
                Average turnaround
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards] relative overflow-hidden">
          {/* Diagonal stripe pattern background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #8B6F47,
              #8B6F47 2px,
              transparent 2px,
              transparent 20px
            )`
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-[1.6rem] sm:text-[2.2rem] font-extrabold tracking-tight text-gray-900 mb-2 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                How it{" "}
                <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: '1.15em' }} className="text-[#5e3d2a]">works</span>
              </h2>
              <p className="text-[12px] text-gray-400 tracking-wide">Three steps. Under 30 seconds.</p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-[#5e3d2a] via-gray-200 to-[#5e3d2a]/30 hidden lg:block" style={{ width: 'calc(100% - 200px)', left: '100px' }} />
              
              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#5e3d2a] text-white text-sm font-semibold mb-4 shadow-sm">
                    1
                  </div>
                  <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Paste your text</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    Drop in content from ChatGPT, Claude, Gemini, or any AI tool. Supports plain text, .docx, and .pdf.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-800 text-white text-sm font-semibold mb-4 shadow-sm">
                    2
                  </div>
                  <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Hit Humanize</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    Our engine rewrites for natural flow, varied sentence rhythm, and authentic tone — while keeping your meaning.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#5e3d2a] text-white text-sm font-semibold mb-4 shadow-sm">
                    3
                  </div>
                  <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Copy and use</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    Download as .txt or .docx, or copy directly. Ready for submission, publication, or wherever you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Large Discount Banner - Above Pricing */}
        <LargeDiscountBanner />

        {/* Pricing Section (Untouched logic, just moved) */}
        <section id="pricing" className="py-10 sm:py-16 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5e3d2a]">Pricing</span>
              <h3 className="mt-3 text-[1.6rem] sm:text-[2.2rem] font-extrabold tracking-tight text-gray-900 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                Simple,{" "}
                <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: '1.15em' }} className="text-[#8B6F47]">transparent pricing</span>
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-[13px] text-gray-400">
                No hidden fees. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="mt-12">
              <PolarPricing isTeamMember={isTeamMember} />
            </div>

            {subscriptionPlan && <TopUpSection />}
          </div>
        </section>

        {/* Powerful Humanization Features */}
        <section className="py-16 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] relative overflow-hidden">
          {/* Square grid background pattern */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `
              linear-gradient(to right, #8B6F47 1.5px, transparent 1.5px),
              linear-gradient(to bottom, #8B6F47 1.5px, transparent 1.5px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-[1.6rem] sm:text-[2.2rem] font-extrabold tracking-tight text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                What makes{" "}
                <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: '1.15em' }} className="text-[#5e3d2a]">it work</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto text-[13px] leading-relaxed">
                Under the hood, a purpose-built rewriting engine — not a generic LLM wrapper — handles every nuance of natural language.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-[#5e3d2a]/5 rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Undetectable output</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  Rewrites pass GPTZero, Turnitin, and Originality.ai. The result reads like a person — because it's engineered to.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#faf7f4] rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Meaning preserved</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  Your facts, arguments, and structure stay intact. Only the phrasing changes — nothing gets lost in translation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#5e3d2a]/5 rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Fast at any scale</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  5,000 words processed in under 3 seconds. No queue, no wait — just instant results on demand.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#faf7f4] rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Private by design</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  Your content is never stored, logged, or used for training. What you paste stays yours — full stop.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#5e3d2a]/5 rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">50+ languages</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  English, Spanish, French, German, Chinese, Japanese, and more — all with the same quality and naturalness.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#faf7f4] rounded-2xl p-6 border border-[#e8ddd5]">
                <div className="w-10 h-10 bg-[#5e3d2a] rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">No friction to start</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">
                  Paste and go. No account required to try it — sign up only when you're ready for more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Redesigned Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-20 bg-[#faf7f4] overflow-hidden relative opacity-0 animate-[fadeInUp_0.8s_ease-in-out_1.2s_forwards]">
          <div className="absolute top-0 inset-x-0 h-px bg-muted" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5e3d2a] mb-3 block">Testimonials</span>
              <h2 className="text-[1.6rem] md:text-[2.2rem] font-extrabold text-foreground tracking-tight mb-3 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                What people{" "}
                <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: '1.15em' }} className="text-[#8B6F47]">are saying</span>
              </h2>
              <p className="text-gray-400 max-w-sm mx-auto text-[13px]">Thousands of writers, students, and teams use HumanifyLab every day.</p>
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
                    <div className="w-8 h-8 rounded-full bg-[#f5ede6] flex items-center justify-center text-xs font-bold text-[#5e3d2a]">
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

        {/* FAQ Section */}
        <section id="faq" className="relative py-20 sm:py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards] overflow-hidden">
          {/* Small triangle pattern background */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 2 L14 10 L6 10 Z' fill='%238B6F47' /%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
            backgroundRepeat: 'repeat'
          }}></div>
          
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900">FAQ</h3>
            </div>

            <div className="space-y-0">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className={`border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between py-5 text-left hover:bg-gray-50 transition-colors px-2"
                    >
                      <span className="text-base font-semibold text-gray-900 pr-8">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-2 pb-5 text-sm leading-relaxed text-gray-600">
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
      
      {/* Pricing Modal - Shows after sign-in for free users */}
      <PricingModal isOpen={isPricingModalOpen} onClose={closePricingModal} />
    </div>
  );
}