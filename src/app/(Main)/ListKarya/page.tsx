import React from "react";
import Main from "@/components/ListKarya/Main";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "@/auth";
import { FileFullPayload } from "@/utils/relationship";

export default async function Partner() {
  const session = await getServerSession();
  const getUser = await prisma.fileWork.findMany({
    where: { AND: [{ NOT: { status: "DENIED" } }, { NOT: { status: "PENDING" } }] },
  });
  const getCurrentUser = await prisma.user.findFirst({
    where: { id: session?.user?.id },
  });
  const getGenre = await prisma.genre.findMany();
  return (
    <main className="min-h-screen bg-slate-100 py-36">
      <section>
        <Main currentUser={getCurrentUser!} genre={getGenre} session={session!} ListData={getUser as FileFullPayload[]} />
      </section>
    </main>
  );
}
