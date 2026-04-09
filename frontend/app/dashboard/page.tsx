"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();

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
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-zinc-200 font-medium text-sm">Discord Bot</span>
                    <span className="text-zinc-500 text-xs">
                      {user?.discordId ? "Linked" : "Not Linked"}
                    </span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${user?.discordId ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                </div>
                {user?.discordId && (
                   <div className="mt-2 text-xs text-zinc-500 font-mono">
                     ID: {user.discordId}
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
