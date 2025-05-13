"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarIcon, HomeIcon, UserIcon, SettingsIcon } from "lucide-react";

const navigation = [
  {
    title: "Accueil",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Rendez-vous",
    href: "/rendez-vous",
    icon: CalendarIcon,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: UserIcon,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
} 