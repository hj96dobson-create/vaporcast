import * as React from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase, supabaseClientReady } from "@/integrations/supabase/client";
import { dashboardNavigation } from "@/lib/dashboard-navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CreditCard,
  Infinity as InfinityIcon,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
  heading?: string;
  subheading?: string;
};

const adminOpsLinks = [
  { label: "Admin Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Admin Settings", href: "/admin/settings" },
] as const;

function getHeading(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return {
      heading: "VaporCast control center",
      subheading: "Operations, governance, and platform intelligence.",
    };
  }

  if (pathname.startsWith("/profile")) {
    return {
      heading: "Account workspace",
      subheading: "Identity, preferences, and profile controls.",
    };
  }

  return {
    heading: "AI video workspace",
    subheading: "Generate, iterate, and ship videos from one command center.",
  };
}

export function AppShell({ children, heading, subheading }: AppShellProps) {
  const { user } = useSession();
  const { isAdmin, loading: authLoading } = useAuthUser();
  const router = useRouter();
  const location = useLocation();
  const initials = (user?.email ?? "VC").slice(0, 2).toUpperCase();
  const titleCopy = getHeading(location.pathname);
  const creditSummary = authLoading
    ? "Checking credits..."
    : isAdmin
      ? "Unlimited credits"
      : "1,120 credits left";
  const planSummary = authLoading ? "Account loading" : isAdmin ? "Admin access" : "Creator Pro";
  const creditTone = authLoading
    ? "text-slate-500"
    : isAdmin
      ? "text-emerald-600"
      : "text-slate-500";

  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const enabled = localStorage.getItem("vaporcast-theme") === "dark";
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleTheme = React.useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("vaporcast-theme", next ? "dark" : "light");
  }, [darkMode]);

  const handleSignOut = async () => {
    if (!supabaseClientReady) {
      await router.navigate({ to: "/auth" });
      return;
    }

    await supabase.auth.signOut();
    router.invalidate();
    await router.navigate({ to: "/auth" });
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="app-shell flex min-h-screen w-full overflow-x-hidden text-foreground">
        <Sidebar collapsible="icon" variant="floating">
          <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-4">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-black bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(51,65,85,0.9),rgba(14,165,233,0.28))] px-4 py-3 text-white shadow-[0_18px_60px_-24px_rgba(15,23,42,0.8)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-chrome text-slate-950 shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base font-semibold tracking-tight text-white">
                  VaporCast
                </p>
                <p className="text-xs text-white/75">Next-gen AI video platform</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            {dashboardNavigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        location.pathname === item.href ||
                        location.pathname.startsWith(`${item.href}/`);

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                            className="h-11 text-[0.95rem]"
                          >
                            <Link to={item.href}>
                              <Icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                          {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            <SidebarGroup>
              <SidebarGroupLabel>Access</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith("/admin")}
                      tooltip="Admin"
                      className="h-11 text-[0.95rem]"
                    >
                      <Link to="/admin/dashboard">
                        <Shield />
                        <span>Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isAdmin ? (
              <SidebarGroup>
                <SidebarGroupLabel>Admin Ops</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminOpsLinks.map((link) => (
                      <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === link.href}
                          tooltip={link.label}
                          size="sm"
                        >
                          <Link to={link.href}>
                            <span>{link.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : null}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-3">
            <div className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-[0_16px_60px_-38px_rgba(15,23,42,0.5)] backdrop-blur group-data-[collapsible=icon]:hidden">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-white shadow-sm">
                  <AvatarFallback className="bg-slate-950 text-xs text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.email ?? "Workspace user"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className="text-slate-500">{planSummary}</span>
                    <span className="text-slate-300">·</span>
                    <span className={creditTone}>
                      {isAdmin && !authLoading ? (
                        <InfinityIcon className="mr-1 inline-block h-3.5 w-3.5 align-[-2px]" />
                      ) : null}
                      {creditSummary}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[56%] rounded-full bg-gradient-to-r from-slate-950 via-sky-600 to-cyan-400" />
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => router.navigate({ to: "/dashboard/notifications" })}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => router.navigate({ to: "/dashboard/billing" })}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Open billing"
                >
                  <CreditCard className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => router.navigate({ to: "/dashboard/settings" })}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Open settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => router.navigate({ to: "/profile" })}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                  aria-label="Open profile"
                >
                  <UserRound className="h-4 w-4" />
                </button>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <div className="min-h-screen min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto flex min-h-screen max-w-[1680px] min-w-0 flex-col">
            <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50">
              <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <SidebarTrigger className="h-10 w-10 rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-white/15 dark:bg-slate-900/80" />
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 sm:inline-flex dark:border-white/15 dark:bg-slate-900 dark:text-slate-200">
                    <Menu className="mr-2 h-3.5 w-3.5" />
                    Workspace
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                      {heading ?? titleCopy.heading}
                    </p>
                    <p className="truncate text-sm leading-6 text-slate-600 dark:text-slate-300/85">
                      {subheading ?? titleCopy.subheading}
                    </p>
                  </div>
                </div>

                <Badge className="hidden rounded-full bg-slate-950 px-3 py-1 text-white shadow-sm sm:inline-flex dark:bg-cyan-400 dark:text-slate-950">
                  Live pipeline
                </Badge>

                <Button
                  variant="outline"
                  onClick={toggleTheme}
                  className="rounded-full border-slate-200 bg-white/80 shadow-sm hover:bg-white dark:border-white/15 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden sm:inline">Theme</span>
                </Button>

                <Button
                  variant="outline"
                  className="hidden rounded-full border-slate-200 bg-white/80 shadow-sm hover:bg-white md:inline-flex dark:border-white/15 dark:bg-slate-900 dark:hover:bg-slate-800"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>

                <Avatar className="h-10 w-10 border border-white shadow-sm">
                  <AvatarFallback className="bg-slate-950 text-xs text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </header>

            <main className="flex-1 min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
