
import NAVBAR from "./comp-nav";

export const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Pengembang",
    href: "/pengembang",
  },
  {
    label: "Product",
    child: [
      {
        label: "Product",
        href: "/product",
      },
      {
        label: "Karya",
        href: "/karya",
      },
    ],
  },
];
export default async function Navbar(){
  return (
    <NAVBAR />
  )
}