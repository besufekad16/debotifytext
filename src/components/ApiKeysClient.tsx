"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Copy, Key, Trash2, Eye, EyeOff, Plus, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsedAt: string | null;
  createdAt: string;
  isActive: boolean;
}

interface ApiKeysClientProps {
  hasApiAccess: boolean;
}

export default function ApiKeysClient({ hasApiAccess }: ApiKeysClientProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (hasApiAccess) {
      fetchApiKeys();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApiAccess]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys([...apiKeys, data.apiKey]);
        setNewKeyName("");
        toast.success("API key created successfully");

        // Auto-copy the new key
        await navigator.clipboard.writeText(data.apiKey.key);
        toast.success("API key copied to clipboard");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== keyId));
        toast.success("API key deleted successfully");
      } else {
        toast.error("Failed to delete API key");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  const copyApiKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskApiKey = (key: string) => {
    return `${key.slice(0, 12)}${"•".repeat(20)}${key.slice(-4)}`;
  };

  if (!hasApiAccess) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-gray-950">
            API Access
          </h1>
          <p className="mt-2 text-[14px] text-gray-400">
            Integrate HumanifyLab into your applications
          </p>
        </div>

        <Card className="border-orange-200 bg-orange-50/80 shadow-md backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-5 w-5" />
              API Access Requires ULTRA Plan
            </CardTitle>
            <CardDescription className="text-orange-700">
              Upgrade to the ULTRA plan to access our API and integrate the AI humanizer into your own applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">With API access, you can:</h3>
              <ul className="space-y-2 text-[13px] text-gray-500">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-#faf6f10 mt-0.5 flex-shrink-0" />
                  <span>Integrate AI humanization into your own applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-#faf6f10 mt-0.5 flex-shrink-0" />
                  <span>Automate content humanization workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-#faf6f10 mt-0.5 flex-shrink-0" />
                  <span>Process content at scale with programmatic access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-#faf6f10 mt-0.5 flex-shrink-0" />
                  <span>Build custom integrations with your existing tools</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link href="/pricing">
                <Button className="bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)]">
                  View Pricing Plans
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-gray-950">
          API Keys
        </h1>
        <p className="mt-2 text-[14px] text-gray-400">
          Manage your API keys for integrating HumanifyLab into your applications
        </p>
      </div>

      {/* Create New API Key */}
      <Card className="mb-8 border-white/60 bg-white/80 shadow-md backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--hl-mint-deep)]" />
            Create New API Key
          </CardTitle>
          <CardDescription>
            Generate a new API key to access the HumanifyLab API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="keyName" className="sr-only">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Server, Testing Environment"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createApiKey()}
              />
            </div>
            <Button
              onClick={createApiKey}
              disabled={creating || !newKeyName.trim()}
              className="bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)]"
            >
              {creating ? "Creating..." : "Create Key"}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            Give your API key a descriptive name to help you remember what it&apos;s used for.
          </p>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card className="border-white/60 bg-white/80 shadow-md backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-[var(--hl-mint-deep)]" />
            Your API Keys
          </CardTitle>
          <CardDescription>
            {apiKeys.length === 0 ? "No API keys created yet" : `You have ${apiKeys.length} API key${apiKeys.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-[13px] text-gray-400 py-8">Loading...</p>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">No API keys yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-[13.5px] font-semibold text-gray-900">{apiKey.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="flex-1 rounded bg-white px-3 py-2 text-sm font-mono text-slate-700 border border-slate-200">
                          {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyApiKey(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex gap-4 text-[11px] text-gray-400">
                        <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                        {apiKey.lastUsedAt && (
                          <span>Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="mt-8 border-white/60 bg-white/80 shadow-md backdrop-blur">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use the HumanifyLab API in your applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Base URL</h3>
            <code className="block rounded bg-slate-100 px-3 py-2 text-sm">
              https://www.humanifylab.com/api
            </code>
          </div>

          <div>
            <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Authentication</h3>
            <p className="text-[13px] text-gray-500 mb-2">
              Include your API key in the request headers:
            </p>
            <code className="block rounded bg-slate-100 px-3 py-2 text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>

          <div>
            <h3 className="text-[13.5px] font-semibold text-gray-900 mb-1.5">Example Request</h3>
            <pre className="rounded bg-slate-100 px-3 py-2 text-xs overflow-x-auto">
              {`curl -X POST https://www.humanifylab.com/api/humanizer \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your AI-generated text here",
    "preset": "professional"
  }'`}
            </pre>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[var(--hl-mint-deep)] hover:text-[var(--hl-mint)] font-medium"
            >
              Contact Support for API Documentation
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
