"use client";

import { useState, useEffect } from "react";
import { useUser, useLogout, useUpdateDiscord } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User, ShieldCheck, HelpCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const updateDiscord = useUpdateDiscord();
  
  const [discordId, setDiscordId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.discordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscordId(user.discordId);
    }
  }, [user?.discordId]);

  const handleUpdateDiscord = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    updateDiscord.reset();

    if (!/^\d{17,20}$/.test(discordId)) {
      setValidationError("Discord ID must be 17-20 digits.");
      return;
    }

    try {
      await updateDiscord.mutateAsync(discordId);
    } catch (err) {
      // Error state is managed by React Query; we catch here to prevent unhandled promise rejection
      console.error("Discord update failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-sm">Welcome back, {user?.email.split('@')[0]}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => logout.mutate()}
            className="text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-zinc-200">
                <User className="h-5 w-5 text-purple-400" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm">Email</span>
                  <span className="text-zinc-200 font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm">User ID</span>
                  <span className="text-zinc-400 text-xs font-mono">{user?.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-zinc-200">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
                Integrations
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Manage your external account connections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateDiscord} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discordId" className="text-zinc-300">Discord ID</Label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-zinc-500 cursor-help hover:text-zinc-300 transition-colors" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-zinc-300 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                        Enable &quot;Developer Mode&quot; in Discord Settings &gt; Advanced, then right-click your profile to &quot;Copy User ID&quot;.
                      </div>
                    </div>
                  </div>
                  <Input 
                    id="discordId"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    placeholder="e.g. 123456789012345678"
                    className="bg-black/50 border-white/10 text-zinc-200 focus:border-blue-500/50 transition-colors"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={updateDiscord.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all"
                >
                  {updateDiscord.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    "Update Discord Link"
                  )}
                </Button>

                {updateDiscord.isSuccess && (
                  <div className="flex items-center gap-2 text-xs text-green-400 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Discord ID updated successfully!
                  </div>
                )}

                {(validationError || updateDiscord.isError) && (
                  <div className="flex items-center gap-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationError || 
                     (updateDiscord.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                     "Failed to update Discord ID"}
                  </div>
                )}
              </form>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Integration Status</span>
                  <div className="flex items-center gap-2">
                    <span className={user?.discordId ? "text-green-400" : "text-zinc-500"}>
                      {user?.discordId ? "Active" : "Not Linked"}
                    </span>
                    <div className={`h-2 w-2 rounded-full ${user?.discordId ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
