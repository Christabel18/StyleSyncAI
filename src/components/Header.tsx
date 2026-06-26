"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/onboarding", label: "Discover" },
  { href: "/upload", label: "Analyze" },
  { href: "/history", label: "My Fits" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream transition-all group-hover:rotate-12 group-hover:bg-pop-purple">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-2xl font-semibold tracking-tight text-ink">
            Out<span className="gradient-text">Fit</span>ted
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2.5 text-base font-semibold transition-all duration-200",
                  active
                    ? "bg-ink text-cream shadow-sm"
                    : "text-ink-soft hover:bg-sand hover:text-ink",
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


