import type { ReactNode } from "react";

import { AppHeader } from "@/components/navigation/app-header";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 text-[#1a1a1a]">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
