import { SectionContainer } from "../components/layout/SectionContainer";
import prisma from "@/lib/prisma";
import { TopFiveData, TypeGraphics } from "./components/Graphic";
import Hero from "./components/Hero";
import { Custom } from "./components/Custom";

export default async function Home() {
  const topUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      clasess: true,
      File: {
        select: {
          id: true,
        },
        where: {
          status: "VERIFIED",
        },
      },
    },
  });
  

  const usersWithFileCounts = topUsers
    .map((user) => ({
      name: user.name,
      classes: user.clasess || "N/A",
      nomination: user.name,
      fileCount: user.File.length,
    }))
    .filter((user) => user.fileCount > 0) 
    .sort((a, b) => b.fileCount - a.fileCount) 
    .slice(0, 5); 

  const formattedData: TypeGraphics[] = usersWithFileCounts.map((user, i) => ({
    name: user.name,
    classes: user.classes,
    nomination: user.nomination,
    number: `${i + 1}`,
    date_time: new Date(),
  }));
  
  return (
  <SectionContainer>
    <TopFiveData data={formattedData} title="Data Siswa Membuat Product Paling Banyak" label="Product" /> 
    <Hero/>
    <Custom/>
  </SectionContainer>
  );
}
