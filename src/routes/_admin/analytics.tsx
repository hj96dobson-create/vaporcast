import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Area, AreaChart } from "recharts";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_admin/analytics")({
  component: AdminAnalytics,
});

const dailyData = [
  { day: "Mon", generations: 45, revenue: 540 },
  { day: "Tue", generations: 52, revenue: 624 },
  { day: "Wed", generations: 48, revenue: 576 },
  { day: "Thu", generations: 61, revenue: 732 },
  { day: "Fri", generations: 55, revenue: 660 },
  { day: "Sat", generations: 38, revenue: 456 },
  { day: "Sun", generations: 42, revenue: 504 },
];

const weeklyData = [
  { week: "W1", generations: 280, revenue: 3360 },
  { week: "W2", generations: 320, revenue: 3840 },
  { week: "W3", generations: 295, revenue: 3540 },
  { week: "W4", generations: 350, revenue: 4200 },
];

const monthlyData = [
  { month: "Jan", generations: 1200, revenue: 14400 },
  { month: "Feb", generations: 1350, revenue: 16200 },
  { month: "Mar", generations: 1480, revenue: 17760 },
  { month: "Apr", generations: 1620, revenue: 19440 },
  { month: "May", generations: 1750, revenue: 21000 },
  { month: "Jun", generations: 1890, revenue: 22680 },
];

const storageData = [
  { month: "Jan", storage: 450 },
  { month: "Feb", storage: 520 },
  { month: "Mar", storage: 580 },
  { month: "Apr", storage: 650 },
  { month: "May", storage: 720 },
  { month: "Jun", storage: 845 },
];

const apiUsageData = [
  { day: "Mon", calls: 1200 },
  { day: "Tue", calls: 1450 },
  { day: "Wed", calls: 1320 },
  { day: "Thu", calls: 1680 },
  { day: "Fri", calls: 1550 },
  { day: "Sat", calls: 980 },
  { day: "Sun", calls: 1100 },
];

const userGrowthData = [
  { month: "Jan", users: 450 },
  { month: "Feb", users: 520 },
  { month: "Mar", users: 610 },
  { month: "Apr", users: 680 },
  { month: "May", users: 750 },
  { month: "Jun", users: 847 },
];

const renderTimeData = [
  { month: "Jan", avgTime: 45 },
  { month: "Feb", avgTime: 42 },
  { month: "Mar", avgTime: 38 },
  { month: "Apr", avgTime: 35 },
  { month: "May", avgTime: 32 },
  { month: "Jun", avgTime: 30 },
];

function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Platform performance and usage metrics</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Generations</CardTitle>
              <CardDescription>Video generations per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  generations: {
                    label: "Generations",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart data={dailyData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="generations" fill="var(--color-generations)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Generations</CardTitle>
              <CardDescription>Video generations per week this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  generations: {
                    label: "Generations",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <BarChart data={weeklyData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="generations" fill="var(--color-generations)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Generations</CardTitle>
              <CardDescription>Video generations per month this year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  generations: {
                    label: "Generations",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <LineChart data={monthlyData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="generations"
                    stroke="var(--color-generations)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <AreaChart data={monthlyData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>Total storage used over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  storage: {
                    label: "Storage (GB)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
              >
                <AreaChart data={storageData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="storage"
                    stroke="var(--color-storage)"
                    fill="var(--color-storage)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Daily API call volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calls: {
                    label: "API Calls",
                    color: "hsl(var(--chart-5))",
                  },
                }}
              >
                <BarChart data={apiUsageData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="calls" fill="var(--color-calls)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <LineChart data={userGrowthData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Render Time</CardTitle>
              <CardDescription>Average video generation time in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  avgTime: {
                    label: "Time (s)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <LineChart data={renderTimeData}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="var(--color-avgTime)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
