import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export function AdminSidebar() {
  return null;
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      heading="VaporCast control center"
      subheading="Governance, operations, and analytics from a single premium admin workspace."
    >
      {children}
    </AppShell>
  );
}
