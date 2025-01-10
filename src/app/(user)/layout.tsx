import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthProviders from "@/lib/AuthProvider";
import ProgressBarProvider from "@/lib/ProgressBar";
import Navbar from "../components/utils/Navbar";
import { Toaster } from "react-hot-toast";
import { PageContainer } from "../components/layout/PageContainer";
import { Footer } from "../components/utils/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moklet Portfolio",
  description: "Inovasi Mokleters, Solusi Masa Depan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProviders>
          <ProgressBarProvider>
            <Navbar />
            <PageContainer>{children}</PageContainer>
            <Footer/>
            <Toaster />
          </ProgressBarProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
