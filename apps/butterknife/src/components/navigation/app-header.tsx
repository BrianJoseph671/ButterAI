"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SETTINGS_UPDATED_EVENT, readSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const DEFAULT_BUSINESS_NAME = "ButterAI";

const navigationItems = [
  { href: "/", label: "Dashboard" },
  { href: "/calls", label: "Call Feed" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [businessName, setBusinessName] = useState(DEFAULT_BUSINESS_NAME);

  useEffect(() => {
    const updateBusinessName = () => {
      setBusinessName(readSettings(window.localStorage).businessName);
    };

    updateBusinessName();
    window.addEventListener("storage", updateBusinessName);
    window.addEventListener(SETTINGS_UPDATED_EVENT, updateBusinessName);

    return () => {
      window.removeEventListener("storage", updateBusinessName);
      window.removeEventListener(SETTINGS_UPDATED_EVENT, updateBusinessName);
    };
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="border-b-4 border-[#F5D76E] bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/butter-ai-logo.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
            aria-hidden
          />
          <span className="text-lg font-semibold text-[#1a1a1a]">
            {businessName}
          </span>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          {navigationItems.map((item) => {
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-[#1a1a1a] transition-colors",
                  active
                    ? "bg-[#F5D76E] font-semibold"
                    : "bg-white hover:bg-zinc-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
