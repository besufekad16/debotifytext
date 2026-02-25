"use client";

import { useState, useEffect } from "react";
import { X, Zap, Crown, Rocket, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlanClick = (plan: string) => {
    // Close modal and redirect to pricing page
    onClose();
    router.push("/pricing");
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] text-white p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            🎉 Welcome to HumanifyLab!
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Choose a plan to unlock unlimited humanization power, or continue with our free tier
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Free Tier */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all">
              <div className="text-center mb-6">
                <Zap className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
                <p className="text-gray-600">Forever free</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">500 words per request</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic humanization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Standard processing</span>
                </li>
              </ul>

              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
              >
                Continue with Free
              </Button>
            </div>

            {/* Basic Plan */}
            <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-300 transition-all">
              <div className="text-center mb-6">
                <Zap className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$6.99</div>
                <p className="text-gray-600">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Up to 7,000 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Enhanced humanization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Fast processing</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePlanClick("basic")}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Upgrade to Basic
              </Button>
            </div>

            {/* Pro Plan - POPULAR */}
            <div className="border-2 border-[#2563eb] rounded-xl p-6 relative shadow-lg hover:shadow-xl transition-all">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  🔥 MOST POPULAR
                </span>
              </div>

              <div className="text-center mb-6 mt-2">
                <Crown className="h-12 w-12 mx-auto mb-3 text-[#2563eb]" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$23.99</div>
                <p className="text-gray-600">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Up to 25,000 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Advanced humanization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Priority processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">99.9% detection bypass</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePlanClick("pro")}
                className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8]"
              >
                Upgrade to Pro
              </Button>
            </div>

            {/* Ultra Plan */}
            <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-300 transition-all">
              <div className="text-center mb-6">
                <Rocket className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ultra</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$42.99</div>
                <p className="text-gray-600">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Up to 50,000 words</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Premium humanization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Fastest processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">API access</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePlanClick("ultra")}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Upgrade to Ultra
              </Button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              ✨ All plans include 99.9% AI detection bypass and unlimited humanizations
            </p>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              I'll decide later, continue with free tier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
