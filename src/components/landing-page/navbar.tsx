"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Auto-show tutorial on homepage for first-time visitors
  useState(() => {
    if (pathname === "/") {
      setIsTutorialOpen(true);
    }
  });

  const tutorialSteps = [
    "Daftar Melalui Admin sekolah masing masing",
    "Apabila belum memiliki admin, bergabung sekarang bersama kami",
    "Setelah melakukan pendaftaran, login dengan akun yang didaftarkan",
    "Update profile",
    "Ajukan Karya yang Diinginkan",
    "Proses Pengajuan dilakukan dengan menentukan jenis karya yang ingin diupload",
    "Apabila memilih Upload File, Pilih genre file terlebih dahulu, Lalu Baru pilih file yang akan diupload",
    "Setelah Upload Succes, tutup tab upload dan tambahkan cover",
    "Apabila Jenis file adalah link, isi sesuai format yang disediakan, setelah selesai tambahkan cover seperti diatas",
    "Tunggu Validator untuk memverifikasi karya yang telah diupload",
    "Lihat pada bagian notifikasi apabila terdapat komentar, atau melihat status terbaru dari karya",
    "Karya yang telah diverifikasi bisa dilihat pada List Karya yang diakses dari halaman Home atau Navbar Karya",
    "Karya Yang berupa word atau docs dapat dibaca On Page, sedangkan pdf atau Image akan ter- Redirect ke lokasi file disimpan"
  ];

  const navigationLinks = [
    { href: "/", label: "Beranda" },
    { href: "/AjukanKarya", label: "Ajukan Karya", requireAuth: true },
    { href: "/ListKarya", label: "List Karya" },
    { href: "/pengembang", label: "Developers" }
  ];

  const isActivePath = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
        <div className="container mx-auto py-1.5 px-4 md:px-6 max-w-7xl lg:px-20">
          <div className="flex gap-x-16 h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div>
                <h1 className="tracking-[1.5rem] text-center text-2xl text-black font-bold">
                  GELIAD
                </h1>
                <p className="text-center text-sm font-normal text-black tracking-widest">
                  Menciptakan generasi hebat, Dari tugas Jadi karya
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => {
                if (link.requireAuth && !session?.user?.email) return null;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium rounded-md px-3 py-2 transition-all duration-200",
                      isActivePath(link.href)
                        ? link.href === "/pengembang"
                          ? "text-yellow-400 border-2 bg-white border-yellow-400"
                          : "text-black border-2 bg-white border-primary"
                        : "text-black hover:text-black hover:bg-white hover:border-2 hover:border-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsTutorialOpen(true)}
                className="text-white hover:text-black bg-primary hover:bg-slate-100"
              >
                Panduan
              </Button>

              {status === "loading" ? (
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    className="inline w-5 h-5 animate-spin text-blue-900 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : !session ? (
                <Button 
                  variant="outline" 
                  onClick={() => signIn()}
                  className="text-white hover:text-black bg-primary hover:bg-slate-100"
                >
                  Sign In
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 text-black bg-primary hover:bg-slate-100">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="user image"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {session.user?.name?.slice(0, 2).toUpperCase() || "PR"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {session.user?.name || "Profile"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/notification/Karya">Notification</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/signin" })}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden fixed inset-x-0 top-16 bg-secondary border-b shadow-lg transition-all duration-300 ease-in-out z-40",
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <div className="container mx-auto px-4 py-8 text-center space-y-8">
              <nav className="flex flex-col space-y-8">
                {navigationLinks.map((link) => {
                  if (link.requireAuth && !session?.user?.email) return null;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-sm font-medium rounded-md px-3 py-2 transition-all duration-200",
                        isActivePath(link.href)
                          ? link.href === "/pengembang"
                            ? "text-yellow-400 border-2 border-yellow-400"
                            : "text-black border-2 border-secondary bg-white"
                          : "text-black hover:text-blue-600 hover:border-2 hover:border-secondary"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                <div className="flex flex-col space-y-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsTutorialOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-white hover:text-black bg-primary hover:bg-slate-100"
                  >
                    Panduan
                  </Button>

                  {status === "loading" ? (
                    <div className="flex justify-center">
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 animate-spin text-blue-900 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  ) : !session ? (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        signIn();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-white hover:text-black bg-primary hover:bg-slate-100"
                    >
                      Sign In
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between text-black bg-primary hover:bg-slate-100">
                          <span>{session.user?.name || "Profile"}</span>
                          {session.user?.image ? (
                            <Image
                              src={session.user.image}
                              alt="user image"
                              width={24}
                              height={24}
                              className="rounded-full ml-2"
                            />
                          ) : (
                            <Avatar className="ml-2 h-6 w-6">
                              <AvatarFallback>
                                {session.user?.name?.slice(0, 2).toUpperCase() || "PR"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full mt-2">
                        <DropdownMenuItem asChild>
                          <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/notification/Karya" onClick={() => setIsMenuOpen(false)}>
                            Notification
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut({ callbackUrl: "/signin" });
                          }}
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Tutorial Modal */}
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Panduan Penggunaan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ol className="space-y-3 text-sm">
              {tutorialSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-semibold text-primary min-w-[2rem]">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="pt-4">
              <Button 
                onClick={() => setIsTutorialOpen(false)}
                className="w-full"
              >
                Mengerti
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}