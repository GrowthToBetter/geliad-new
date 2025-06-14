import React from "react";
import DetailProfilePartner from "@/components/ListKarya/DetailProfilePartner";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { headers } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProfilePartner({ params }: Props) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    const currentPath = (await headers()).get("x-nextjs-pathname") || "/";
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  // Await the params Promise to get the actual parameters
  const { id } = await params;

  const findUser = await prisma.user.findFirst({
    where: { id },
    include: {
      userAuth: true,
      File: { include: { TaskValidator: true } },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });

  return <DetailProfilePartner userId={id} userData={findUser!} />;
}