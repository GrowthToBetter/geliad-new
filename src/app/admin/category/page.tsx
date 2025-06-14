import React from "react";
import { prisma } from "@/lib/prisma";
import AdminHeaders from "@/components/admin/main/AdminHeaders";
import TableGenre from "@/components/admin/category/tabel";

export default async function teamData() {
  const dataCategory = await prisma.genre.findMany();
  return (
    <div className="flex flex-col">
      <AdminHeaders data="Data Category" />
      <TableGenre dataGenre={dataCategory} />
    </div>
  );
}
