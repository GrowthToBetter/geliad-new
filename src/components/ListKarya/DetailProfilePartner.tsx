import { Prisma } from "@/generated/prisma";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Grid3X3, FileText, Users } from "lucide-react";

export default function DetailProfilePartner({
  userData,
  userId,
}: {
  userData: Prisma.UserGetPayload<{
    include: {
      userAuth: true;
      File: { include: { TaskValidator: true } };
      taskValidator: { include: { user: true } };
      comment: { include: { file: true } };
    };
  }>;
  userId: string;
}) {
  const currentTeam = userData.File.find((x) => x.userId === userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <Card className="max-w-6xl mx-auto mt-20 overflow-hidden shadow-xl border-0">
        {/* Cover Image Section */}
        <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
          <Image
            src={userData.cover ?? "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"}
            width={1200}
            height={400}
            quality={100}
            unoptimized
            alt="Cover profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <CardContent className="relative mt-20 px-6 md:px-10 pb-10">
          {/* Profile Avatar - Overlapping cover */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg">
                <AvatarImage
                  src={userData.photo_profile as string}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {userData.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 md:pb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  {userData?.name as string}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium">
                  {userData?.clasess}
                </p>
                <div className="flex items-center space-x-2 text-slate-700">
                  <Users className="w-5 h-5" />
                  <span className="text-base md:text-lg">
                    {userData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Files Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-slate-700" />
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Files
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {userData && userData?.File.length !== 0 ? (
                userData?.File.map((file, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-4 py-2 text-sm md:text-base bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md">
                    {file.filename}
                  </Badge>
                ))
              ) : (
                <p className="text-slate-500 italic font-medium">
                  Belum Ada File yang Ditambahkan
                </p>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Paper List and Social Media Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Paper List */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Grid3X3 className="w-6 h-6 text-slate-700" />
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Paper List
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-base md:text-lg">
                    <span className="font-semibold text-slate-700">
                      Team Name:
                    </span>
                  </p>
                  {currentTeam?.status ? (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200 bg-red-50 font-medium px-3 py-1">
                      {currentTeam?.filename}
                    </Badge>
                  ) : (
                    <p className="text-slate-500 italic font-medium">
                      {"Don't Have Uploaded File"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-slate-700" />
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Social Media
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 italic">
                  No social media links available
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
