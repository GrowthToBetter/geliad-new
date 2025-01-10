"use client";

import React, { useMemo } from "react";
import {
  CircleGauge,
  Home,
  LogOut,
  Book,
  type LucideIcon,
  SquareStack,
  Check
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
} from "@/app/components/ui/sidebar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import MenuItem from "./MenuItem";
import { Role } from "@prisma/client";

export type SidebarItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  requiredRole?: (Role | "ALL")[];
  children?: {
    title: string;
    url: string;
  }[];
};

const BASE_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: false,
    requiredRole: ["ALL"],
  },
  {
    title: "Category",
    url: "/admin/dataCategory",
    icon: SquareStack,
    isActive: false,
    requiredRole: ["ADMIN"],
  },{
    title: "Validasi",
    url: "/admin/validasi",
    icon: Check,
    isActive: false,
    requiredRole: ["ADMIN"],
  },
  {
    title: "Student",
    url: "/admin/studentData",
    icon: Book,
    isActive: false,
    requiredRole: ["ADMIN"],
  },
  {
    title: "Teacher",
    url: "/admin/teacherData",
    icon: Book,
    isActive: false,
    requiredRole: ["ADMIN"],
  },
  {
    title: "File",
    url: "/admin/fileData",
    icon: Book,
    isActive: false,
    requiredRole: ["ADMIN"],
  },
];

export default function AppSidebar({ session }: { session: Session | null }) {
  const sidebarItems = useMemo(() => {
    if (session?.user) {
      const userRole = session?.user?.role;
      return BASE_SIDEBAR_ITEMS.filter(
        (item) =>
          item.requiredRole?.includes("ALL") ||
          item.requiredRole?.includes(userRole as Role)
      );
    } else {
      return [];
    }
  }, [session?.user]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <CircleGauge className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Panel Admin MokletPort
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
            <SidebarMenuItem className="mt-3 text-red-500">
              <SidebarMenuButton onClick={() => signOut()}>
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
