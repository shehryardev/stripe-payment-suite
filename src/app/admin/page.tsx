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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock data for demonstration
const transactions = [
  {
    id: "pi_1234567890",
    customer: "John Doe",
    email: "john@example.com",
    amount: 299.0,
    currency: "usd",
    status: "succeeded",
    date: "2024-01-15T10:30:00Z",
    product: "Pro Plan",
    paymentMethod: "card_visa",
  },
  {
    id: "pi_0987654321",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 99.0,
    currency: "usd",
    status: "pending",
    date: "2024-01-15T09:15:00Z",
    product: "Basic Plan",
    paymentMethod: "card_mastercard",
  },
  {
    id: "pi_1122334455",
    customer: "Bob Johnson",
    email: "bob@example.com",
    amount: 149.0,
    currency: "usd",
    status: "failed",
    date: "2024-01-14T16:45:00Z",
    product: "Pro Plan",
    paymentMethod: "card_amex",
  },
  {
    id: "pi_5566778899",
    customer: "Alice Brown",
    email: "alice@example.com",
    amount: 299.0,
    currency: "usd",
    status: "succeeded",
    date: "2024-01-14T14:20:00Z",
    product: "Enterprise Plan",
    paymentMethod: "card_visa",
  },
];

const customers = [
  {
    id: "cus_123",
    name: "John Doe",
    email: "john@example.com",
    totalSpent: 598.0,
    transactions: 2,
    lastPayment: "2024-01-15",
    status: "active",
  },
  {
    id: "cus_456",
    name: "Jane Smith",
    email: "jane@example.com",
    totalSpent: 99.0,
    transactions: 1,
    lastPayment: "2024-01-15",
    status: "active",
  },
  {
    id: "cus_789",
    name: "Bob Johnson",
    email: "bob@example.com",
    totalSpent: 0.0,
    transactions: 0,
    lastPayment: null,
    status: "inactive",
  },
];

export default function AdminPage() {
  const { user } = useUser();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage payments, customers, and transactions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                $1,247.00
              </div>
              <p className="text-xs text-green-500">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Transactions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                847
              </div>
              <p className="text-xs text-green-500">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                234
              </div>
              <p className="text-xs text-green-500">+15.3% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                96.8%
              </div>
              <p className="text-xs text-green-500">+2.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Monitor all payment transactions and their status
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="succeeded">Succeeded</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {transaction.customer}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {transaction.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {transaction.product}
                          </p>
                        </div>
                        <div className="text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Customer Management</CardTitle>
                      <CardDescription>
                        View and manage customer information and payment history
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Search customers..."
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers.map((customer) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {customer.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">
                            ${customer.totalSpent.toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {customer.transactions} transactions
                          </p>
                        </div>
                        <div className="text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              customer.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                          >
                            {customer.status}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {customer.lastPayment
                              ? new Date(
                                  customer.lastPayment
                                ).toLocaleDateString()
                              : "No payments"}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
