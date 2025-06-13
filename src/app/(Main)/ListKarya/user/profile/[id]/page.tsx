import React from "react";
import DetailProfilePartner from "@/components/ListKarya/DetailProfilePartner";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { headers } from "next/headers";

export default async function profilePartner({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    const currentPath = (await headers()).get("x-nextjs-pathname") || "/";
    return redirect(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
  }
  const findUser = await prisma.user.findFirst({
    where: { id: params.id },
    include: {
      userAuth: true,
      File: { include: { TaskValidator: true } },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });
  return <DetailProfilePartner userId={params.id} userData={findUser!} />;
}
