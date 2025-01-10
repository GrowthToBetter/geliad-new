import { SectionContainer } from "@/app/components/layout/SectionContainer";
import AdminHeaders from "../components/main/AdminHeaders";
import Table from "./components/Table";
import prisma from "@/lib/prisma";
import { FileFullPayload } from "@/utils/relationsip";

export default async function Page() {
  const getGenre = await prisma.genre.findMany();
  const fileData = await prisma.fileWork.findMany({
    include: {
      comment: {
        include: {
          user: true,
        },
      },
      user:{
        include:{
            userAuth:true
        }
      }
    },
  });
  return (
    <SectionContainer>
      <AdminHeaders data="File Data" />
      <Table fileData={fileData as FileFullPayload[]} genre={getGenre} />
    </SectionContainer>
  );
}
