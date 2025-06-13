import React from "react";
import AjukanKarya from "../../../components/Ajukan/AjukanKarya";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { FileFullPayload, userFullPayload } from "@/utils/relationship";

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
  const getGenre = await prisma.genre.findMany();
  if (userData) {
    if (session?.user?.email && !userData.title && userData?.role === "SISWA")
      return redirect("/pilihRole");
  }

  if (!session?.user?.email) return redirect("/signin");
  return (
    <AjukanKarya
      userData={userData as userFullPayload}
      genre={getGenre}
      files={userData?.File as FileFullPayload[]}
    />
  );
}
