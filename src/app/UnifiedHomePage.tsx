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

      <main className="flex-1 w-full">
        {/* Hero and Workspace Section with Seamless Gradient */}
        <div
          className="relative w-full overflow-x-hidden bg-[#f0f9ff] pb-20"
          style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          {/* Hero Section */}
          <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#5e3d2a]/5 via-white to-white pointer-events-none" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#5e3d2a]/30 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-[#5e3d2a]"></span>
                  Advanced AI Text Humanization Technology
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
                  <span className="text-gray-900">Transform AI Content Into</span>
                  <br />
                  <span className="text-[#5e3d2a]">Authentic Human Writing</span>
                </h1>

                {/* Feature Pills */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
                  <div className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5e3d2a]/10">
                      <Check className="h-3 w-3 text-[#5e3d2a]" />
                    </div>
                    <span>Enterprise-Grade Security</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5e3d2a]/10">
                      <Check className="h-3 w-3 text-[#5e3d2a]" />
                    </div>
                    <span>Professional Quality Results</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5e3d2a]/10">
                      <Check className="h-3 w-3 text-[#5e3d2a]" />
                    </div>
                    <span>Instant Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Workspace - Humanizer Tool */}
          <section id="tool" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            {showSignInPrompt && !isSignedIn && (
              <div className="mb-8 rounded-3xl border border-[#bfdbfe] bg-[#e0f2fe] p-6 text-center shadow-sm">
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

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-[#5e3d2a]"></div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Live Humanizer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Writing Quality</span>
                  {originalText && !humanizedText && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs font-semibold text-red-600">AI Generated</span>
                    </div>
                  )}
                  {humanizedText && !isHumanizing && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5e3d2a]/10 border border-[#5e3d2a]/30">
                      <div className="w-2 h-2 rounded-full bg-[#5e3d2a]"></div>
                      <span className="text-xs font-semibold text-[#5e3d2a]">Human Quality</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid - Conditional Layout */}
              <div className="p-6">
                <div className={cn(
                  "grid gap-6",
                  (humanizedText || isHumanizing) ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                )}>
                  {/* Left Column - Input (always visible) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        AI-Generated Text
                      </label>
                      {originalText && (
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                          Robotic
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <ScrollArea className={cn(
                        "h-[320px] w-full rounded-2xl border-2 transition-all",
                        isDragging
                          ? "border-[#5e3d2a] bg-[#5e3d2a]/5"
                          : "border-gray-200 focus-within:border-[#5e3d2a] focus-within:bg-white bg-gray-50"
                      )}>
                        <Textarea
                          value={originalText}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            setOriginalText(e.target.value);
                            setUploadedFileName(null);
                          }}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          placeholder="Paste your AI-generated text here..."
                          className={cn(
                            "w-full resize-none border-0 bg-transparent p-4 text-base leading-relaxed focus:outline-none focus:ring-0",
                            isDragging && "bg-emerald-50/50"
                          )}
                          disabled={isHumanizing}
                          style={{ minHeight: '320px' }}
                        />
                      </ScrollArea>

                      {/* Drop Zone Overlay */}
                      {!originalText && !isHumanizing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border-2 border-dashed border-[#5e3d2a]/40 bg-[#5e3d2a]/5">
                              <UploadCloud className="w-10 h-10 text-[#5e3d2a]" />
                              <div>
                                <p className="text-sm font-semibold text-gray-700">
                                  Drop files here or{" "}
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[#5e3d2a] hover:text-[#4a2f1f] underline pointer-events-auto"
                                  >
                                    browse
                                  </button>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Supports .txt, .md, .docx • Max 2MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Character Counter */}
                      {originalText && (
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                          {originalText.length} / 5000
                        </div>
                      )}
                    </div>

                    {/* Info Text */}
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500">
                        Paste content from ChatGPT, Claude, Gemini, or any AI writing tool
                      </p>
                    </div>

                    {/* Humanize Button */}
                    <Button
                      onClick={handleHumanize}
                      disabled={!originalText.trim() || isHumanizing}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#5e3d2a] via-[#4a2f1f] to-[#3d2519] hover:from-[#4a2f1f] hover:via-[#3d2519] hover:to-[#2f1d13] text-white font-bold text-lg shadow-lg shadow-[#5e3d2a]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isHumanizing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Humanizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Humanize Text
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </Button>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,.md"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Right Column - Output (only when humanizing or complete) */}
                  {(humanizedText || isHumanizing) && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Humanized Text
                        </label>
                        {humanizedText && !isHumanizing && (
                          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                            Human-Like
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <ScrollArea className="h-[320px] w-full rounded-2xl border-2 border-gray-200 bg-white p-4">
                          {isHumanizing ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 min-h-[320px]">
                              <Loader2 className="w-8 h-8 animate-spin text-[#5e3d2a]" />
                              {thoughtsList.length > 0 && (
                                <p className="text-sm text-gray-600 text-center animate-pulse">
                                  {thoughtsList[0]}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                              {humanizedText}
                            </p>
                          )}
                        </ScrollArea>

                        {/* Character Counter */}
                        {humanizedText && !isHumanizing && (
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {humanizedText.length} characters
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {humanizedText && !isHumanizing && (
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex-1 h-11 rounded-xl border-2 border-gray-200 hover:border-[#5e3d2a] hover:bg-[#5e3d2a]/5 hover:text-[#5e3d2a]"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 text-[#5e3d2a]" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDownload("txt")}
                            variant="outline"
                            className="flex-1 h-11 rounded-xl border-2 border-gray-200 hover:border-[#5e3d2a] hover:bg-[#5e3d2a]/5 hover:text-[#5e3d2a]"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            onClick={() => {
                              setOriginalText("");
                              setHumanizedText("");
                              setCurrentAiScore(null);
                            }}
                            variant="outline"
                            className="h-11 px-4 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Stats Section - Below Humanizer Tool */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#f0f9ff] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat 1 - Texts Humanized */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-[#5e3d2a] mb-2">
                1.2M+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Texts Humanized
              </div>
            </div>

            {/* Stat 2 - Quality Success Rate */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                98.7%
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Quality Success Rate
              </div>
            </div>

            {/* Stat 3 - Average Processing */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-bold text-[#5e3d2a] mb-2">
                &lt;3s
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Average Processing
              </div>
            </div>
          </div>
        </section>

        {/* Professional Solutions for Every Industry */}
        <section className="py-20 bg-[#f0f9ff] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                Professional Solutions for <span className="text-[#5e3d2a]">Every Industry</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Advanced AI humanization technology trusted by professionals across academia, content creation, and enterprise sectors.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 - For Students */}
              <div className="bg-[#5e3d2a]/5 rounded-3xl p-8 border border-[#5e3d2a]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Academic Excellence</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Maintain academic integrity while leveraging AI assistance. Transform drafts into polished, authentic submissions that meet institutional standards.
                </p>
              </div>

              {/* Card 2 - For Content Writers */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Content Production</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Scale content operations without compromising quality or authenticity. Maintain brand voice while optimizing production workflows.
                </p>
              </div>

              {/* Card 3 - For Professionals */}
              <div className="bg-[#5e3d2a]/5 rounded-3xl p-8 border border-[#5e3d2a]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Communications</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ensure professional correspondence maintains authentic human tone. Optimize business communications while preserving relationship quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Humanization Features */}
        <section className="py-20 bg-[#f0f9ff] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                Enterprise-Grade Humanization Technology
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Sophisticated AI rewriting algorithms that transform content into natural, authentic human writing while preserving semantic integrity.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 - Natural Writing Quality */}
              <div className="bg-[#5e3d2a]/5 rounded-3xl p-8 border border-[#5e3d2a]/20">
                <div className="w-14 h-14 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Writing Enhancement</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transform AI text into professional, natural-sounding content with authentic human tone and style. Perfect for academic, business, and creative writing.
                </p>
              </div>

              {/* Feature 2 - Preserve Meaning */}
              <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Semantic Preservation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Advanced NLP algorithms maintain original context, tone, and critical information while rewriting for authentic human characteristics.
                </p>
              </div>

              {/* Feature 3 - Lightning Fast */}
              <div className="bg-[#5e3d2a]/5 rounded-3xl p-8 border border-[#5e3d2a]/20">
                <div className="w-14 h-14 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">High-Performance Processing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Process up to 5,000 words in under 3 seconds. Zero queuing, instant humanization with enterprise-grade infrastructure.
                </p>
              </div>

              {/* Feature 4 - 100% Private */}
              <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Enterprise Security</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Military-grade encryption with zero data retention. Your content is never logged, tracked, or shared with third parties.
                </p>
              </div>

              {/* Feature 5 - Multi-Language */}
              <div className="bg-[#5e3d2a]/5 rounded-3xl p-8 border border-[#5e3d2a]/20">
                <div className="w-14 h-14 bg-[#5e3d2a] rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Global Language Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Comprehensive support for 50+ languages including English, Spanish, French, German, Chinese, Japanese, and more.
                </p>
              </div>

              {/* Feature 6 - No Sign-Up */}
              <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Instant Access</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Begin humanizing immediately. No registration barriers, no email verification, no payment required for initial access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-[#f0f9ff] opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-base text-gray-600">Transform AI text into human-like content in three simple steps</p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#5e3d2a] via-gray-700 to-blue-500 hidden lg:block" style={{ width: 'calc(100% - 200px)', left: '100px' }} />
              
              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5e3d2a] text-white text-3xl font-bold mb-4 shadow-lg">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Paste AI Text</h3>
                  <p className="text-sm text-gray-600">
                    Copy your AI-generated content from ChatGPT, Claude, Gemini, or any AI writing tool and paste it into our editor.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-700 text-white text-3xl font-bold mb-4 shadow-lg">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Click Humanize</h3>
                  <p className="text-sm text-gray-600">
                    Our advanced AI rewriting engine analyzes and transforms your text to sound naturally human while preserving meaning.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white text-3xl font-bold mb-4 shadow-lg">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Copy & Use</h3>
                  <p className="text-sm text-gray-600">
                    Get your humanized text instantly. Copy it, download it, or use it anywhere with professional, natural-sounding quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (Untouched logic, just moved) */}
        <section id="pricing" className="py-10 sm:py-16 bg-[#f0f9ff] opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#2563eb] drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]">Pricing</span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-[#1e40af] bg-clip-text text-transparent animate-[glowPulse_3s_ease-in-out_infinite]" style={{ textShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.4), 0 0 80px rgba(59,130,246,0.3)" }}>
                Choose your plan
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
                Transparent pricing with zero lock-in. Upgrade or cancel anytime.
              </p>
            </div>

            <div className="mt-12">
              <PolarPricing isTeamMember={isTeamMember} />
            </div>

            {subscriptionPlan && <TopUpSection />}
          </div>
        </section>

        {/* Redesigned Testimonials Section */}
        <section id="testimonials" className="py-24 sm:py-32 bg-[#f0f9ff] overflow-hidden relative opacity-0 animate-[fadeInUp_0.8s_ease-in-out_1.2s_forwards]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="absolute top-0 inset-x-0 h-px bg-muted" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-primary font-bold tracking-wide uppercase text-xs mb-4 block">Testimonials</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">Trusted by <span className="text-primary relative inline-block">Professionals<span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/50 -z-10 rounded-full"></span></span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm">Join thousands of professionals who rely on HumanifyLab for authentic content transformation.</p>
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-blue-700">
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
        <section id="faq" className="relative py-20 sm:py-24 bg-gradient-to-br from-[#8b6f47] via-[#5e3d2a] to-[#4a2f1f] overflow-hidden opacity-0 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">FAQ</span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">Get quick answers</h3>
              <p className="mt-3 text-sm text-white/90">
                Everything you need to know about Humanizer’s security, pricing, and workflow.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {FAQ_ITEMS.map((item) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-gray-900">{item.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm leading-relaxed text-gray-700 border-t border-gray-100 pt-4">
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
      
      {/* Pricing Modal - Shows after sign-in for free users */}
      <PricingModal isOpen={isPricingModalOpen} onClose={closePricingModal} />
    </div>
  );
}