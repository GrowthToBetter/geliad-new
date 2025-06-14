import React from "react";
import { prisma } from "@/lib/prisma";
import { userFullPayload } from "@/utils/relationship";
import AdminHeaders from "@/components/admin/main/AdminHeaders";
import TableUser from "@/components/admin/main/TableUser";

export default async function studentData() {
  const studentData = await prisma.user.findMany({
    where: { role: "SISWA" },
    include: {
      userAuth: true,
      File: { include: { TaskValidator: true } },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });

  return (
    <div className="flex flex-col">
      <AdminHeaders data="Student Data" />
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            User Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage users and Students
          </p>
        </div>

        <div className="p-6">
          <TableUser dataAdmin={studentData as userFullPayload[]} />
        </div>
      </div>
    </div>
  );
}
