import { SectionContainer } from "@/app/components/layout/SectionContainer";
import Image from "next/image";
import { H1, Body3} from "@/app/components/ui/text";
import { SectionTitle } from "@/app/components/ui/SectionTitle";
export default function Hero() {
    return (
        <SectionContainer className="flex flex-col-reverse items-end justify-between gap-y-24 lg:flex-row">
        <div className="w-full lg:max-w-[57%]">
          <SectionTitle>Tentang Moklet Port</SectionTitle>
          <H1 className="mb-[1.375rem] text-black">
          Inovasi Mokleters, Solusi Masa Depan
          </H1>
          <Body3 className="mb-12 text-neutral-500">
            Moklet Portfolio adalah platform yang kami sediakan untuk mewadahi
            product product luar biasa yang dihasilkan oleh para Mokleters.
            Moklet Portfolio memberikan kesempatan kepada para Mokleters untuk
            menampilkan product mereka
          </Body3>
        </div>
          <Image
          src={"/img/cover.png"}
          alt="Tentang Kami"
          width={525}
          height={457}
          className="pointer-events-none h-auto w-full object-cover lg:w-[34%]"
        />
        </SectionContainer>
    );
}