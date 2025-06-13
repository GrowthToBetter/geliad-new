/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Class, Prisma } from "@prisma/client";
import { Session } from "next-auth";
import { FileFullPayload, GenreFullPayload } from "@/utils/relationship";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Radix UI icons
import {
  LucideGlasses,
  EyeIcon,
  HeartIcon,
  PersonStanding,
} from "lucide-react";
import { addLike, addViews } from "@/utils/FileServerAction";

export default function Main({
  ListData,
  session,
  currentUser,
  genre,
}: {
  ListData: FileFullPayload[];
  session: Session;
  currentUser: Prisma.UserGetPayload<{}>;
  genre: GenreFullPayload[];
}) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selected, setSelected] = useState("All");
  const [classes, setClasses] = useState<string>("All");
  const [filteredUser, setFilteredUser] = useState<FileFullPayload[]>(ListData);
  const [openRead, setOpenRead] = useState<{
    [key: string]: { isOpen: boolean; link: string };
  }>({});
  const [like, setLike] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const filterUsers = () => {
      const filteredByName = ListData.filter((userData: FileFullPayload) =>
        userData.filename.toLowerCase().includes(searchInput.toLowerCase())
      );

      const finalFilteredUsers =
        selected === "All" && classes === "All"
          ? filteredByName
          : selected === "All"
          ? filteredByName.filter(
              (dataList: FileFullPayload) =>
                dataList.userClasses === (classes as Class)
            )
          : classes === "All"
          ? filteredByName.filter(
              (dataList: FileFullPayload) => dataList.genre === selected
            )
          : filteredByName.filter(
              (dataList: FileFullPayload) =>
                dataList.genre === selected &&
                dataList.userClasses === (classes as Class)
            );
      setFilteredUser(finalFilteredUsers);
    };
    filterUsers();
  }, [ListData, classes, searchInput, selected]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleButtonFilter = (data: string) => {
    setSelected(data);
  };

  const handleButtonFilterClass = (data: string) => {
    setClasses(data);
  };

  const filteredGenre: string[] = [];
  for (const Genre of genre) {
    if (!filteredGenre.includes(Genre.Genre)) {
      filteredGenre.push(Genre.Genre);
    }
  }

  const handleRead = (id: string, link: string) => {
    setOpenRead((prev) => ({
      ...prev,
      [id]: {
        isOpen: !prev[id]?.isOpen,
        link: prev[id]?.link || link,
      },
    }));
  };

  const addLikes = async (file: FileFullPayload) => {
    setLike(!like);
    const loading = toast.loading("Loading...");
    try {
      const update = await addLike(
        file.id,
        like ? file.Like - 1 : file.Like + 1
      );
      if (!update) {
        toast.error("Gagal Menambahkan Like");
      }
      toast.success("Success", { id: loading });
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  if (!ListData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }
  if (!genre) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Mobile Search */}
      <div className="block md:hidden">
        <div className="relative">
          <LucideGlasses className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search files..."
            value={searchInput}
            onChange={handleSearchInput}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Profile Card */}
          {currentUser && session && (
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={
                      (currentUser.cover as string) ||
                      "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"
                    }
                    unoptimized
                    quality={100}
                    width={400}
                    height={120}
                    alt="banner"
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <Avatar className="absolute -bottom-4 left-4">
                    <AvatarImage
                      src={
                        (session?.user?.image as string) ||
                        "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png"
                      }
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="pt-6 pb-4 px-4">
                  <h3 className="font-semibold text-lg">
                    {session?.user?.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {session?.user?.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Class Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Filter by Class</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={classes === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleButtonFilterClass("All")}
                    className="w-full">
                    All
                  </Button>
                  <Button
                    variant={classes === "X" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleButtonFilterClass("X")}
                    className="w-full">
                    Class X
                  </Button>
                  <Button
                    variant={classes === "XI" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleButtonFilterClass("XI")}
                    className="w-full">
                    Class XI
                  </Button>
                  <Button
                    variant={classes === "XII" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleButtonFilterClass("XII")}
                    className="w-full">
                    Class XII
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Genre Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Filter by Genre</Label>
                <div className="space-y-2">
                  <Button
                    variant={selected === "All" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleButtonFilter("All")}>
                    All Genres
                  </Button>
                  {filteredGenre.map((genreItem) => (
                    <Button
                      key={genreItem}
                      variant={selected === genreItem ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleButtonFilter(genreItem)}>
                      {genreItem}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Desktop Search */}
          <div className="hidden md:block">
            <div className="relative">
              <LucideGlasses className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search files..."
                value={searchInput}
                onChange={handleSearchInput}
                className="pl-10"
              />
            </div>
          </div>

          {/* Files Grid */}
          {filteredUser.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUser.map((user, i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={
                        user.coverFile ||
                        "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"
                      }
                      unoptimized
                      quality={100}
                      width={400}
                      height={200}
                      alt="file cover"
                      className="w-full h-40 object-cover"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary">
                      <EyeIcon className="w-3 h-3 mr-1" />
                      {user.views}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {user.filename}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.genre && (
                        <Badge variant="outline">{user.genre}</Badge>
                      )}
                      {user.userClasses && (
                        <Badge variant="outline">
                          Class {user.userClasses}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/ListKarya/user/profile/${user.userId}`)
                        }>
                        <PersonStanding className="w-4 h-4 mr-1" />
                        Profile
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (
                              user.path.includes("drive") ||
                              user.path.includes("Drive")
                            ) {
                              handleRead(user.id, user.permisionId as string);
                            } else {
                              router.push(user.path);
                            }
                            addViews(user.id, user.views + 1);
                          }}>
                          Read
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLikes(user)}>
                          <HeartIcon className="w-4 h-4 mr-1" />
                          {user.Like}
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  {/* Modal for Google Drive files */}
                  <Dialog
                    open={openRead[user.id]?.isOpen || false}
                    onOpenChange={() => handleRead(user.id, "")}>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{user.filename}</DialogTitle>
                      </DialogHeader>
                      <div className="h-[70vh]">
                        <iframe
                          className="w-full h-full border rounded"
                          src={`https://drive.google.com/file/d/${
                            openRead[user.id]?.link
                          }/preview`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                          allowFullScreen
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                  No Files Found
                </h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
