"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deniedFruit,
  getPendingFruits,
  verifyFruit,
} from "@/utils/AdminServerAction";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { z } from "zod";

const FruitSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  stock: z.number(),
  isVerif: z.boolean(),
  supplier: z.object({
    user: z.object({
      name: z.string().nullable(),
      email: z.string().nullable(),
    }),
  }),
});

type Fruit = z.infer<typeof FruitSchema>;

export default function FruitPage() {
  const [fruits, setFruits] = useState<Fruit[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pendingFruits = await getPendingFruits();
      const parsedFruits = z.array(FruitSchema).safeParse(pendingFruits);
      if (parsedFruits.success) setFruits(parsedFruits.data);
    }
    fetchData();
  }, []);

  async function handleVerify(id: string) {
    const result = await verifyFruit(id);
    if (result.success) {
      setFruits((prev) => prev.filter((f) => f.id !== id));
    }
  }

  async function handleDenied(id: string) {
    const result = await deniedFruit(id);
    if (result.success) {
      setFruits((prev) => prev.filter((f) => f.id !== id));
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Verifikasi Buah</h1>
      <Card>
        <CardContent className="p-4">
          {fruits.length === 0 ? (
            <p>Tidak ada buah yang menunggu verifikasi.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Nama Buah</th>
                  <th className="py-2 px-4">Stock</th>
                  <th className="py-2 px-4">Pemilik</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Gambar</th>
                  <th className="py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {fruits.map((fruit) => (
                  <tr key={fruit.id} className="border-t">
                    <td className="py-2 px-4">{fruit.name}</td>
                    <td className="py-2 px-4">{fruit.stock}</td>
                    <td className="py-2 px-4">
                      {fruit.supplier.user.name || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {fruit.supplier.user.email || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {fruit.image ? (
                        <Image
                          src={fruit.image}
                          alt={fruit.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 px-4 w-40">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between">
                            Aksi <MoreVertical className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleVerify(fruit.id)}
                            className="text-green-600 hover:bg-green-100 cursor-pointer">
                            Verifikasi
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDenied(fruit.id)}
                            className="text-red-600 hover:bg-red-100 cursor-pointer">
                            Denied
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
