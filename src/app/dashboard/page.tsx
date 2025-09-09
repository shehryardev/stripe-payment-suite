"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Subscriptions",
      value: "2,350",
      change: "+180.1%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Transactions",
      value: "12,234",
      change: "+19%",
      changeType: "positive" as const,
      icon: CreditCard,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      changeType: "negative" as const,
      icon: TrendingUp,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: "John Doe",
      amount: "$299.00",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: "$149.00",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 3,
      customer: "Bob Johnson",
      amount: "$99.00",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: 4,
      customer: "Alice Brown",
      amount: "$199.00",
      status: "failed",
      date: "2024-01-14",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 sm:h-16 sm:py-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white truncate">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 hidden sm:block">
                Here's what's happening with your payments today.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Search className="w-4 h-4 sm:hidden" />
                  <Bell className="w-4 h-4 hidden sm:block" />
                </Button>
                <Button variant="outline" size="sm" className="p-2 sm:hidden">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
              <Link href="/payment">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Payment</span>
                  <span className="sm:hidden">Pay</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-slate-600 dark:text-slate-300 flex-shrink-0" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                    )}
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 ml-1 hidden sm:inline">
                      from last month
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 ml-1 sm:hidden">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <BarChart3 className="w-5 h-5 mr-2 flex-shrink-0" />
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your payment performance over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      Chart visualization would go here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Activity className="w-5 h-5 mr-2 flex-shrink-0" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Latest transactions and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base truncate">
                          {transaction.customer}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          {transaction.date}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                          {transaction.amount}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Link href="/payment">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 w-full"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Create Payment</span>
                  </Button>
                </Link>
                <Link href="/subscriptions">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 w-full"
                  >
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">
                      My Subscriptions
                    </span>
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 w-full sm:col-span-2 lg:col-span-1"
                  >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Admin Panel</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
