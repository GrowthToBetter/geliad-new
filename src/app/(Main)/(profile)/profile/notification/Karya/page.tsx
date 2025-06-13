import React from "react";
import Home from "@/components/profile/Karya";
import { prisma } from "@/lib/prisma";
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

  return (
    <Home
      userData={userData as userFullPayload}
      file={userData?.File as FileFullPayload[]}
    />
  );
}
