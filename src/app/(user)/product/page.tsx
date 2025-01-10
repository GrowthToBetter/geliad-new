import React from "react";
import AjukanKarya from "../components/AjukanKarya";
import prisma from "@/lib/prisma";
import { nextGetServerSession } from "@/lib/authOption";
import { redirect } from "next/navigation";
import { userFullPayload } from "@/utils/relationsip";
import { SectionContainer } from "@/app/components/layout/SectionContainer";

export default async function page() {
  const session = await nextGetServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      userAuth: true,
      File: { include: { comment: true } },
      comment: { include: { file: true } },
    },
  });
  const getGenre=await prisma.genre.findMany();
  if (!session?.user?.email) return redirect("/signin");
  return (
    <SectionContainer>
      <AjukanKarya userData={userData as userFullPayload} genre={getGenre}/>
    </SectionContainer>
  );
}
