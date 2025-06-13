/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Gambar from "@/../public/img/HomeImage.png";
import Image from "next/image";
import { Archivo_Black } from "next/font/google";
const archivo_black = Archivo_Black({ weight: "400", subsets: ["latin"] });
import Link from "next/link";
import gambar1 from "@/../public/img/Gambar.png";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileFullPayload } from "@/utils/relationship";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  FileText,
  Plus,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Award,
  StarIcon,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Component for auto-generating cover images
const AutoCoverImage = ({
  file,
  className,
}: {
  file: FileFullPayload;
  className?: string;
}) => {
  const [generatedCover, setGeneratedCover] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate cover URL using screenshot service
  const generateCoverUrl = (url: string) => {
    // Using a free screenshot service - you can replace with your preferred service
    // Options:
    // 1. https://api.screenshotmachine.com/
    // 2. https://htmlcsstoimage.com/
    // 3. https://api.urlbox.io/
    // 4. Your own screenshot service

    const screenshotAPI = `https://api.screenshotmachine.com?key=c5d78f&url=${encodeURIComponent(
      url
    )}&dimension=1024x768&format=png&cacheLimit=0&delay=2000`;

    return screenshotAPI;
  };

  useEffect(() => {
    if (!file.coverFile && file.path && !generatedCover && !hasError) {
      setIsLoading(true);

      // Generate cover from file.path
      const coverUrl = generateCoverUrl(file.path);

      // Test if the generated cover URL is valid
      const img = new window.Image();
      img.onload = () => {
        setGeneratedCover(coverUrl);
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = coverUrl;
    }
  }, [file.path, file.coverFile, generatedCover, hasError]);

  const getCoverSrc = () => {
    if (file.coverFile) {
      return file.coverFile as string;
    }

    if (generatedCover) {
      return generatedCover;
    }

    // Default fallback image
    return "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png";
  };

  return (
    <div className="relative overflow-hidden">
      <Image
        src={getCoverSrc()}
        unoptimized
        quality={100}
        width={400}
        height={240}
        alt={file.filename}
        className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ${className}`}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Auto-generated badge */}
      {generatedCover && !file.coverFile && (
        <Badge
          variant="outline"
          className="absolute top-3 left-3 bg-blue-500/90 text-white border-0 text-xs">
          Auto Cover
        </Badge>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Badge
        variant="secondary"
        className="absolute top-3 right-3 bg-green-500 text-white border-0">
        Verified
      </Badge>
    </div>
  );
};

export default function Home({ files }: { files: FileFullPayload[] }) {
  const router = useRouter();
  const filteredFiles = files
    .filter((file) => file.status === "VERIFIED")
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Geometric Shapes */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-40 right-32 w-24 h-24 bg-yellow-400/30 rounded-lg rotate-45 blur-lg"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl"
          />

          {/* Creative Work Elements Inspired by Background */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 right-20">
            <div className="w-16 h-20 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg opacity-80 shadow-2xl transform rotate-12" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, 8, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/3 left-16">
            <div className="w-12 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-70 shadow-xl" />
          </motion.div>

          {/* Abstract Collaboration Icons */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-10 opacity-30">
            <Users className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-16">
            <Award className="w-10 h-10 text-yellow-300" />
          </motion.div>

          {/* Gradient Mesh Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8">
            {/* Badge with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium">
              <StarIcon className="w-4 h-4 text-yellow-300" />
              Platform Karya Terdepan
              <TrendingUp className="w-4 h-4 text-green-300" />
            </motion.div>

            {/* Main Heading with Staggered Animation */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}>
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block">
                Dari Tugas
              </motion.span>
              <motion.span
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="block">
                Menjadi{" "}
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Karya
                </span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              <span className="font-bold text-white">GELIAD</span> hadir untuk
              mengangkat{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text font-semibold">
                potensi kreatifmu
              </span>
              . Bersama kita wujudkan generasi yang mampu mengubah tugas menjadi
              karya luar biasa.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform -skew-y-12 group-hover:skew-y-12 transition-transform duration-500" />
                <div className="relative flex items-center">
                  <Plus className="mr-3 h-6 w-6" />
                  Mulai Berkarya
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-lg font-bold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center">
                  <BookOpen className="mr-3 h-6 w-6" />
                  Jelajahi Karya
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-[2px] h-8 bg-gradient-to-b from-transparent to-white/60 rounded-full" />
            <div className="text-xs font-medium">Scroll</div>
          </div>
        </motion.div>
      </section>

      {/* Navigation Cards */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="group">
              <Card className="h-full border-2 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ajukan Karya
                  </h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Bagikan karya terbaikmu dengan komunitas dan dapatkan
                    pengakuan
                  </p>
                  <Link href="/AjukanKarya">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Mulai Mengajukan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="group">
              <Card className="h-full border-2 hover:border-purple-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    List Karya
                  </h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Jelajahi ribuan karya inspiratif dari komunitas kreatif
                  </p>
                  <Link href="/ListKarya">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Jelajahi Sekarang
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 text-sm font-medium">
              Karya Pilihan
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Karya Terbaik Minggu Ini
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan inspirasi dari karya-karya terbaik yang telah diverifikasi
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {filteredFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group">
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  {/* Use the new AutoCoverImage component */}
                  <AutoCoverImage file={file} />

                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {file.filename}
                    </h3>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{file.views} views</span>
                      <div className="flex items-center ml-auto">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">4.8</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6">
                    <Link href={`${file.path}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/ListKarya">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Lihat Semua Karya
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>

            <h2
              className={`text-5xl md:text-7xl font-bold text-white leading-tight ${archivo_black.className}`}>
              <span className="text-red-400">G</span>ELIAD
            </h2>

            <p className="text-2xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto">
              Berjalan Bersama Menghasilkan Ribuan Karya
            </p>

            <div className="flex justify-center pt-8">
              <Button
                onClick={() => signIn()}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-full">
                🚀 Get Started Now!
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative max-w-lg">
            <Image
              src={gambar1}
              width={500}
              height={500}
              alt="Success Illustration"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
