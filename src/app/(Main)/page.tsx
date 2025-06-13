import React from "react";
import Home from "../../components/dashboard/Home";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const files = await prisma.fileWork.findMany({
    include: {
      user: { include: { userAuth: true } },
      TaskValidator: true,
      comment: { include: { user: true } },
    },
  });
  return <Home files={files} />;
}
