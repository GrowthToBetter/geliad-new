
import React from "react";
import Home from "@/components/profile/Validasi";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FileFullPayload, userFullPayload } from "@/utils/relationship";
import { getServerSession } from "@/auth";

export default async function page() {
  const session = await getServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      userAuth: true,
      File: {
        include: {
          user: { include: { userAuth: true } },
          TaskValidator: true,
          comment: { include: { user: true } },
        },
      },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });
  let file: FileFullPayload[] = [];
  if (session?.user?.role === "SISWA") {
    file = (await prisma.fileWork.findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        user: { include: { userAuth: true } },
        TaskValidator: true,
        comment: { include: { user: true } },
      },
    })) as FileFullPayload[];
  } else {
    file = (await prisma.fileWork.findMany({
      include: {
        user: { include: { userAuth: true } },
        TaskValidator: true,
        comment: { include: { user: true } },
      },
    })) as FileFullPayload[];
  }
  if (userData) {
    if (session?.user?.email && !userData.title && userData.role === "SISWA")
      return redirect("/pilihRole");
  }
  return <Home userData={userData as userFullPayload} file={file} />;
}

export const maxDuration = 60;
