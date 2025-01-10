import React from "react";
import AdminHeaders from "../components/main/AdminHeaders";
import prisma from "@/lib/prisma";
import { nextGetServerSession } from "@/lib/authOption";
import { userFullPayload } from "@/utils/relationsip";
import { SectionContainer } from "@/app/components/layout/SectionContainer";
import Table from "../studentData/_components/Table";

export default async function studentData() {
  const studentData = await prisma.user.findMany({
    where: { role: "GURU" },
    include: { userAuth: true },
  });
  const session = await nextGetServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      userAuth: true,
      File: true,
      comment: { include: { file: true } },
    },
  });

  return (
    <SectionContainer>
      <AdminHeaders data="Teacher Data" />
      <Table userData={userData as userFullPayload} studentData={studentData} />
    </SectionContainer>
  );
}
