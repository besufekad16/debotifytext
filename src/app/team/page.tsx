"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Loader2, Users, Plus, Trash2, UserPlus, Crown, Shield } from "lucide-react";
import { toast } from "sonner";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  sharedCredits: number;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamData {
  team: Team | null;
  ownedTeams: Team[];
  canCreateTeam: boolean;
  subscriptionPlan: string | null;
}

export default function TeamPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isSignedIn) {
      fetchTeamData();
    }
  }, [isSignedIn, isLoaded, router]);

  const fetchTeamData = async () => {
    try {
      const response = await fetch("/api/team");
      if (response.ok) {
        const data = await response.json();
        setTeamData(data);
      } else {
        toast.error("Failed to load team data");
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const leaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team? You will lose access to shared credits.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch("/api/team/leave", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Left team successfully!");
        await fetchTeamData();
        // Force a reload to update credits and subscription state across the app
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to leave team");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");
    } finally {
      setActionLoading(false);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Team created successfully!");
        setNewTeamName("");
        setShowCreateForm(false);
        await fetchTeamData();
      } else {
        toast.error(data.error || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setActionLoading(false);
    }
  };

  const addMember = async (teamId: string) => {
    if (!memberEmail.trim()) {
      toast.error("Please enter a member email");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch("/api/team/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, memberEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Member added successfully!");
        setMemberEmail("");
        setSelectedTeamId(null);
        await fetchTeamData();
      } else {
        toast.error(data.error || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setActionLoading(false);
    }
  };

  const removeMember = async (teamId: string, memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/team/members?teamId=${teamId}&memberId=${memberId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Member removed successfully!");
        await fetchTeamData();
      } else {
        toast.error(data.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/team?teamId=${teamId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Team deleted successfully!");
        await fetchTeamData();
      } else {
        toast.error(data.error || "Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--hl-mint-deep)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageNavbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-deep)]">Team</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Team management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your team members and collaborate on humanization projects.
            </p>
          </div>

          {!teamData?.canCreateTeam && (
            <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-amber-600" />
                <div>
                  <h3 className="text-[13.5px] font-semibold text-amber-900">Upgrade to Ultra Plan</h3>
                  <p className="mt-1 text-[13px] text-amber-700">
                    Team support is available exclusively for Ultra plan subscribers. Upgrade your plan to create and manage teams.
                  </p>
                  <Button
                    onClick={() => router.push("/pricing")}
                    className="mt-4 rounded-full bg-amber-600 hover:bg-amber-700"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          )}

          {teamData?.team && (
            <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[1.05rem] font-semibold text-gray-900">Your Team</h2>
                  <p className="text-[13px] text-gray-400">Team: {teamData.team.name}</p>
                </div>
                {teamData.team.ownerId !== teamData.team.members.find(m => m.email === currentUserEmail)?.id && (
                  <Button
                    variant="outline"
                    onClick={leaveTeam}
                    disabled={actionLoading}
                    className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave Team"}
                  </Button>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-[13px] font-semibold text-gray-900">Team Owner</h3>
                <div className="mt-2 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-[13.5px] font-medium text-gray-900">{teamData.team.owner?.name}</p>
                      <p className="text-[13px] text-gray-400">{teamData.team.owner?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {teamData?.ownedTeams && teamData.ownedTeams.length > 0 && (
            <div className="space-y-6">
              {teamData.ownedTeams.map((team) => (
                <div key={team.id} className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[1.05rem] font-semibold text-gray-900">{team.name}</h2>
                      <p className="text-[13px] text-gray-400">{team.members.length} members</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTeam(team.id)}
                      disabled={actionLoading}
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-gray-900">Team Members</h3>
                      <Button
                        size="sm"
                        onClick={() => setSelectedTeamId(selectedTeamId === team.id ? null : team.id)}
                        className="rounded-full bg-[var(--hl-mint-deep)]"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>

                    {selectedTeamId === team.id && (
                      <div className="mt-4 flex gap-2">
                        <input
                          type="email"
                          placeholder="Enter member email"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                          className="flex-1 rounded-full border border-border px-4 py-2 text-sm"
                        />
                        <Button
                          onClick={() => addMember(team.id)}
                          disabled={actionLoading}
                          className="rounded-full bg-[var(--hl-mint-deep)]"
                        >
                          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                        </Button>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {team.members.length === 0 ? (
                        <p className="text-[13px] text-gray-400">No members yet. Add members to start collaborating.</p>
                      ) : (
                        team.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                          >
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 text-muted-foreground/70" />
                              <div>
                                <p className="text-[13.5px] font-medium text-gray-900">{member.name}</p>
                                <p className="text-[13px] text-gray-400">{member.email}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeMember(team.id, member.id)}
                              disabled={actionLoading}
                              className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {teamData?.canCreateTeam && (
            <div className="mt-8">
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="rounded-full bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="h-5 w-5" /> Create New Team
                </Button>
              ) : (
                <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
                  <h2 className="text-[1.05rem] font-semibold text-gray-900">Create New Team</h2>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-[13px] font-medium text-gray-900">Team Name</label>
                      <input
                        type="text"
                        placeholder="Enter team name"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="mt-2 w-full rounded-full border border-border px-4 py-2"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={createTeam}
                        disabled={actionLoading}
                        className="rounded-full bg-[var(--hl-mint-deep)]"
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Team"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewTeamName("");
                        }}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

