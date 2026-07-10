import type { ComponentType } from "react";
import {
  Bell,
  Bot,
  CreditCard,
  LayoutDashboard,
  LayoutTemplate,
  MessageCircle,
  Mic2,
  Settings2,
  Sparkles,
  UserRound,
  Video,
  Wand2,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

export type DashboardNavGroup = {
  title: string;
  items: DashboardNavItem[];
};

export const dashboardNavigation: DashboardNavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Create Video", href: "/dashboard/create", icon: Wand2 },
      { label: "My Videos", href: "/dashboard/videos", icon: Video },
      { label: "AI Avatars", href: "/dashboard/avatars", icon: Sparkles },
      { label: "AI Voices", href: "/dashboard/voices", icon: Mic2, badge: "New" },
      { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
      { label: "Roadmap", href: "/dashboard/roadmap", icon: Bot },
      { label: "Community", href: "/dashboard/community", icon: MessageCircle },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
      { label: "Profile", href: "/profile", icon: UserRound },
    ],
  },
] as const;
