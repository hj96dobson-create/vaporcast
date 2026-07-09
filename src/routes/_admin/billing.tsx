import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, DollarSign, FileText, Tag, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_admin/billing")({
  component: AdminBilling,
});

const mockPlans = [
  { id: 1, name: "Free", price: "$0", videos: 5, users: 2450, revenue: "$0" },
  { id: 2, name: "Pro", price: "$29/mo", videos: 100, users: 350, revenue: "$10,150" },
  { id: 3, name: "Enterprise", price: "$99/mo", videos: 1000, users: 47, revenue: "$4,653" },
];

const mockSubscriptions = [
  { id: 1, user: "john@example.com", plan: "Pro", status: "active", nextBilling: "2024-07-15" },
  { id: 2, user: "sarah@example.com", plan: "Free", status: "active", nextBilling: "N/A" },
  {
    id: 3,
    user: "mike@example.com",
    plan: "Enterprise",
    status: "active",
    nextBilling: "2024-07-20",
  },
  { id: 4, user: "emma@example.com", plan: "Pro", status: "past_due", nextBilling: "2024-06-15" },
];

const mockInvoices = [
  { id: 1, user: "john@example.com", amount: "$29.00", date: "2024-06-15", status: "paid" },
  { id: 2, user: "mike@example.com", amount: "$99.00", date: "2024-06-15", status: "paid" },
  { id: 3, user: "emma@example.com", amount: "$29.00", date: "2024-06-15", status: "pending" },
  { id: 4, user: "alex@example.com", amount: "$29.00", date: "2024-06-10", status: "paid" },
];

const mockCredits = [
  { id: 1, user: "john@example.com", balance: 75, purchased: 100, used: 25 },
  { id: 2, user: "sarah@example.com", balance: 3, purchased: 5, used: 2 },
  { id: 3, user: "mike@example.com", balance: 500, purchased: 500, used: 0 },
];

function AdminBilling() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage plans, subscriptions, and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$14,803</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">397</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Sold</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">578</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,453</div>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
            <CardDescription>Available subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Videos/Month</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.videos}</TableCell>
                    <TableCell>{plan.users}</TableCell>
                    <TableCell>{plan.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Active user subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Billing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sub.status === "active" ? "default" : "destructive"}
                        className={
                          sub.status === "active" ? "bg-green-500 hover:bg-green-600" : undefined
                        }
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sub.nextBilling}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.user}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.status === "paid" ? "default" : "secondary"}
                        className={
                          invoice.status === "paid" ? "bg-green-500 hover:bg-green-600" : undefined
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader>
            <CardTitle>User Credits</CardTitle>
            <CardDescription>Credit balances and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead>Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>{credit.user}</TableCell>
                    <TableCell>{credit.balance}</TableCell>
                    <TableCell>{credit.purchased}</TableCell>
                    <TableCell>{credit.used}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Placeholders for future features */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Refunds</CardTitle>
              <CardDescription>Manage refund requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No pending refund requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>Discount codes and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No active coupons</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
