"use client";

import React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  BookOpen, 
  Map, 
  Beaker, 
  Briefcase, 
  Layers, 
  Clock,
  Users,
  Brain,
  User,
  Sparkles
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";


const navItems = [
  { title: "Learn", icon: BookOpen, url: "/" },
  { title: "Knowledge Map", icon: Map, url: "/map" },
  { title: "Virtual Lab", icon: Beaker, url: "/lab" },
  { title: "Feynman Challenger", icon: Brain, url: "/feynman" },
  { title: "Flashcards", icon: Layers, url: "/flashcards" },
  { title: "Portfolio", icon: Briefcase, url: "/portfolio" },
  { title: "History", icon: Clock, url: "/history" },
  { title: "Collaborate", icon: Users, url: "/collaborate" },
  { title: "Profile", icon: User, url: "/profile" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar" collapsible="icon">
      <SidebarHeader className="p-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-sm text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          IL
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    className={cn(
                      "h-10 w-10 p-0 flex items-center justify-center rounded-lg transition-all",
                      pathname === item.url 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border border-sidebar-border" 
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                    )}
                    tooltip={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                  </SidebarMenuButton>
                </SidebarMenuItem>

              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-secondary border border-border" />
      </SidebarFooter>
    </Sidebar>
  );
}
