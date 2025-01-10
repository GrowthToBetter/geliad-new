"use client";

import { FileCardProps, UserProfileCardProps } from "./Hero";
import Image from "next/image";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { Button } from "./button";
import { useState } from "react";
import { IFrameViewer } from "./Iframe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import {
  DeleteRoleFileFromNotif,
  sugestFile,
  updateStatus,
} from "@/utils/server-action/userGetServerSession";
import { Textarea } from "@/app/components/ui/textarea";
import { Body3 } from "@/app/components/ui/text";

const items = [
  {
    label: "Verfied",
    action: async (id: string) => {
      const toastId = toast.loading("Loading...");
      try {
        const formData = new FormData();
        formData.append("status", "VERIFIED");
        const verified = await updateStatus(id, formData);
        if (!verified) {
          toast.error("Gagal Mengubah Status", { id: toastId });
        }
        toast.success("Berhasil Mengubah Status", { id: toastId });
      } catch (error) {
        toast.error((error as Error).message, { id: toastId });
      }
    },
  },
  {
    label: "denied",
    action: async (id: string) => {
      const toastId = toast.loading("Loading...");
      try {
        const formData = new FormData();
        formData.append("status", "DENIED");
        const verified = await updateStatus(id, formData);
        if (!verified) {
          toast.error("Gagal Mengubah Status", { id: toastId });
        }
        toast.success("Berhasil Mengubah Status", { id: toastId });
      } catch (error) {
        toast.error((error as Error).message, { id: toastId });
      }
    },
  },
  {
    label: "delete",
    action: async(id:string)=>{
      const toastId = toast.loading("Loading...");
      try {
        const deleted = await DeleteRoleFileFromNotif(id);
        if (!deleted) {
          toast.error("Gagal Mengubah Status", { id: toastId });
        }
        toast.success("Berhasil Mengubah Status", { id: toastId });
      } catch (error) {
        toast.error((error as Error).message, { id: toastId });
      }
    }
  }
];

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  currentUser,
  session,
}) => (
  <div className="w-full bg-white rounded-3xl pb-6">
    <AspectRatio.Root ratio={16 / 9}>
      <Image
        src={
          (currentUser.cover as string) ||
          "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"
        }
        alt="banner"
        layout="fill"
        objectFit="cover"
        className="rounded-t-3xl"
      />
    </AspectRatio.Root>
    <div className="relative -mt-8 ml-4">
      <div className="rounded-full overflow-hidden w-[60px] h-[60px]">
        <Image
          src={
            session?.user?.image ||
            "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png"
          }
          height={60}
          width={60}
          alt="profile"
          className="object-cover"
        />
      </div>
      <div className="ml-16 -mt-3">
        <p className="font-medium text-lg text-black">{session?.user?.name}</p>
        <p className="text-sm text-slate-600">{session?.user?.role}</p>
      </div>
    </div>
  </div>
);

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onLike,
  onRead,
  validate,
  notif,
  user,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [comment, setComment] = useState("");
  const handleSubmitComment = async (id: string) => {
    if (!comment.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }
    if (!user) return toast.error("Anda belum login");
    const toastId = toast.loading("Mengirim komentar...");
    try {
      const commentFiles = await sugestFile(
        comment,
        { connect: { id } },
        { connect: { id: user.id as string } }
      );
      if (!commentFiles) return toast.error("Gagal mengirim komentar");
      toast.success("Komentar berhasil dikirim", {id:toastId});
      setComment("");
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  };

  return (
    <div className="w-full bg-slate-50 rounded-3xl pb-6 border border-slate-200">
      <div
        className="relative rounded-t-3xl overflow-hidden cursor-pointer group"
        onClick={() => setIsPreviewOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open preview for ${file.filename}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsPreviewOpen(true);
          }
        }}>
        <AspectRatio.Root ratio={16 / 9}>
          <div className="absolute inset-0 bg-black">
            {file.coverFile ? (
              <Image
              src={file.coverFile.replace('http://', 'https://')}
              width={0} 
              height={0} 
              alt="cover file"
              layout="fill"
              objectFit="cover"
            />
            ):
            <>
            <iframe
              src={file.path}
              className="w-full h-full pointer-events-none"
              title={`${file.filename} thumbnail preview`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-white/90 hover:bg-white text-black px-4 py-2 rounded-full font-medium"
                  aria-label={`Preview ${file.filename}`}>
                  Preview
                </button>
              </div>
            </div>
            </>
            }
          </div>
        </AspectRatio.Root>
      </div>

      <div className="p-6">
        <div className="flex justify-between mb-6">
          <p className="font-medium text-sm text-black">{file.filename}</p>
          <p
            className="font-medium text-sm text-black"
            aria-label={`${file.views} views`}>
            views: {file.views}
          </p>
        </div>
        <Body3 className="text-wrap h-20 scroll-m-1 overflow-auto mb-3">
          {file.description}
        </Body3>

        <div className="flex justify-between items-center">
          <Button
            variant="default"
            onClick={onRead}
            className="text-white hover:text-Secondary"
            aria-label={`Read ${file.filename}`}>
            Kunjungi
          </Button>
          <div className="flex gap-4">
            <Button
              variant="base"
              onClick={onLike}
              className="p-1"
              aria-label={`Like ${file.filename}. Current likes: ${file.Like}`}>
              Like: {file.Like}
            </Button>
            {validate && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-black rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2">
                    Action
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white border border-gray-200 rounded-md p-2 shadow-lg"
                  sideOffset={5}>
                  {items.filter((item)=>{
                    if(notif){
                      return item;
                    } else {
                      return item.label != "delete";
                    }
                  }).map((childItem, childIndex) => (
                    <DropdownMenuItem key={childIndex} asChild>
                      <Button
                        variant="default"
                        className="text-white"
                        onClick={() => {
                          childItem.action(file.id);
                        }}>
                        {childItem.label}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {validate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="base">Comment</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white border border-gray-200 rounded-md p-4 shadow-lg w-80"
                sideOffset={5}>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Tulis komentar Anda..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-24 p-2 border rounded-md w-full"
                  />
                  <Button
                    variant="default"
                    onClick={() => handleSubmitComment(file.id)}
                    className="w-full text-white">
                    Kirim Komentar
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <IFrameViewer file={file} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
};
