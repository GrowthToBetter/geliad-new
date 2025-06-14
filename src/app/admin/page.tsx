import React from "react";
import { prisma } from "@/lib/prisma";
import { userFullPayload } from "@/utils/relationship";
import { signIn } from "next-auth/react";
import { findAllUsers, findFiles } from "@/utils/user.query";
import { getServerSession } from "@/auth";
import AdminHeaders from "@/components/admin/main/AdminHeaders";
import TableUser from "@/components/admin/main/TableUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Clock } from "lucide-react";

interface CardProps {
  title: string;
  data: number | string;
  desc: string;
  icon: React.ReactNode;
}

export default async function AdminPage() {
  const dataUser = await findAllUsers({
    AND: [{ NOT: { role: "ADMIN" } }, { NOT: { role: "GURU" } }],
  });

  const dataPaper = await findFiles({
    AND: [{ NOT: { status: "DENIED" } }, { NOT: { status: "PENDING" } }],
  });

  const dataAdmin = await prisma.user.findMany({
    where: {
      AND: [{ NOT: { role: "SISWA" } }, { NOT: { role: "GURU" } }],
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

  const dataSubmitted = await findFiles({
    AND: [{ NOT: { status: "DENIED" } }, { NOT: { status: "VERIFIED" } }],
  });

  const cardItems: CardProps[] = [
    {
      title: "Number of Users",
      data: dataUser.length,
      desc: "Users who allocated their paper",
      icon: <Users className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Verified Papers",
      data: dataPaper.length,
      desc: "All verified papers",
      icon: <FileText className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Pending Submissions",
      data: dataSubmitted.length,
      desc: "Malang Telkom Vocational School Achievements",
      icon: <Clock className="h-5 w-5 text-orange-600" />,
    },
  ];

  const session = await getServerSession();

  if (!session) {
    signIn();
    return null;
  }

  return (
    <div className="flex flex-col relative min-h-screen bg-gray-50">
      <section className="w-full">
        <AdminHeaders data="Dashboard" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your system statistics</p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Statistics
              </h2>
              <Badge variant="outline" className="text-sm">
                Real-time data
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardItems.map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {item.title}
                    </CardTitle>
                    {item.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {item.data}
                    </div>
                    <CardDescription className="text-sm text-gray-500">
                      {item.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                User Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage users and administrators
              </p>
            </div>

            <div className="p-6">
              <TableUser dataAdmin={dataAdmin as userFullPayload[]} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const maxDuration = 60;
