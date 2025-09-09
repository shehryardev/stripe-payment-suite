"use client";

import { motion } from "framer-motion";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PaymentCard } from "@/components/PaymentCard";
import { FloatingElements } from "@/components/FloatingElements";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
      <AnimatedBackground />
      <FloatingElements />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StripePro
              </span>
            </motion.div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Gen Payment Integration
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
                Beautiful
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Payments
                </span>
                Made Simple
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
                Integrate Stripe payments with stunning UI components, smooth
                animations, and modern design patterns. Built with Next.js 15
                and shadcn/ui.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                  >
                    Start Building
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              )}
              <Link href="/payment">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Lightning Fast</CardTitle>
                  <CardDescription>
                    Built with Next.js 15 and optimized for performance with
                    instant page loads and smooth animations.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Secure by Default</CardTitle>
                  <CardDescription>
                    Enterprise-grade security with Clerk authentication and
                    Stripe's battle-tested payment infrastructure.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Beautiful UI</CardTitle>
                  <CardDescription>
                    Stunning design with shadcn/ui components, Framer Motion
                    animations, and physics-based interactions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Payment Card Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Beautiful Payment Cards
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Create stunning payment experiences with our animated card
              components
            </p>
          </div>

          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <PaymentCard />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  99.9%
                </div>
                <div className="text-slate-600 dark:text-slate-300">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  50ms
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Response Time
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  256-bit
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Encryption
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  24/7
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Support
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
