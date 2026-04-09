"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/login`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative z-10 transition-all duration-500 hover:border-white/10">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20 mb-2">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-white bg-clip-text">
              Eventify Manager
            </CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              Organize your schedule with elegance.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleLogin}
            className="group relative w-full h-12 bg-white hover:bg-zinc-200 text-black font-semibold transition-all duration-300 rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="flex items-center justify-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f0f12] px-2 text-zinc-500">Secure Authentication</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-zinc-500 px-4 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
      
      {/* Footer minimal info */}
      <div className="absolute bottom-6 text-zinc-600 text-[10px] tracking-wider uppercase">
        Built with Google Cloud & Next.js
      </div>
    </div>
  );
}
