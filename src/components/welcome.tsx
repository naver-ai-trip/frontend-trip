"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Rocket, Zap, ArrowRight } from "lucide-react";

export const Welcome = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"
          style={{
            top: "20%",
            left: "10%",
            animation: "float 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"
          style={{
            bottom: "20%",
            right: "10%",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="absolute h-64 w-64 animate-pulse rounded-full bg-pink-500/20 blur-3xl"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "float 12s ease-in-out infinite",
          }}
        ></div>
      </div>

      <div
        className="pointer-events-none absolute h-96 w-96 rounded-full bg-purple-500/10 blur-3xl transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <Card className="relative z-10 w-[480px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:scale-105 hover:shadow-purple-500/20">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-xl"></div>
              <div className="relative rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <CardTitle className="animate-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Welcome Back
          </CardTitle>

          <p className="text-base font-light text-white/60">Your modern workspace awaits</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid gap-3">
            {[
              {
                icon: Rocket,
                text: "Lightning fast performance",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                text: "Built with latest tech stack",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Sparkles,
                text: "Beautiful & responsive design",
                color: "from-amber-500 to-orange-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <div
                  className={`bg-gradient-to-r ${feature.color} rounded-lg p-2 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white/80">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="group mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:shadow-purple-500/50"
          >
            <span>Get Started</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="mt-4 text-center text-xs text-white/40">
            Powered by Next.js 15 • TailwindCSS • Shadcn UI
          </p>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
