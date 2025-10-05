"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Clock, Settings, Image, Edit, ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  {
    label: "Generate",
    icon: Zap,
    subLinks: [
      { href: "/generate/caption", label: "Alat Caption AI" },
      { href: "/generate/image", label: "Gambar AI" },
    ],
  },
  { href: "/gallery", label: "Galeri", icon: Image },
  { href: "/editor", label: "Editor", icon: Edit },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [openGenerate, setOpenGenerate] = useState(false);

  return (
    <nav className="hidden h-full border-r bg-background lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Zap className="h-6 w-6" />
            <span className="">UMKM KitStudio</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map((link) => {
              if (link.subLinks) {
                return (
                  <Collapsible
                    key={link.label}
                    open={openGenerate}
                    onOpenChange={setOpenGenerate}
                    className="grid items-start"
                  >
                    <CollapsibleTrigger>
                      <Button
                        variant={pathname.startsWith("/generate") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            openGenerate && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-2 space-y-2">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname === subLink.href && "text-primary"
                          )}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === link.href && "text-primary"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </nav>
  );
}
