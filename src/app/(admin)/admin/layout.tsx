import type { Metadata } from "next";
import "./../../globals.css";
import { Toaster } from "react-hot-toast";
import { nextGetServerSession } from "@/lib/authOption";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import AppSidebar from "@/app/components/utils/Sidebar";

export const metadata: Metadata = {
  title: "Admin | Moklet Portfolio",
  description: "Inovasi Mokleters, Solusi Masa Depan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await nextGetServerSession();
  return (
    <html lang="en">
      <body>
        <main className="flex h-screen w-full overflow-hidden bg-white">
          <SidebarProvider>
            <AppSidebar session={session} />
            <SidebarInset>
              <SidebarTrigger className="m-2" />
              <div
                id="main-content"
                className="relative mt-[12px] min-h-full w-full overflow-y-auto py-4 sm:mt-[90px] lg:mt-0">
                <main className="pb-16">
                  <div className="min-h-fit overflow-y-auto px-4 pt-4">
                    {children}
                  </div>
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
