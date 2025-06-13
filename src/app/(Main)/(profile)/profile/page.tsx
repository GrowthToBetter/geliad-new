import React from "react";
import Home from "./_components/Profile";
import {prisma} from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { userFullPayload } from "@/utils/relationship";

export default async function page() {
  const session = await getServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      userAuth: true,
      File: { include: { TaskValidator: true } },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });
  if (userData) {
    if (session?.user?.email && !userData.title && userData?.role==="SISWA") return redirect("/pilihRole");
  }
  if (!session?.user?.email) return redirect("/signin");
  return <Home userData={userData as userFullPayload} />;
}
