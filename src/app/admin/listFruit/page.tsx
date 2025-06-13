"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { editFruit } from "@/utils/fruitServerAction";
import { getFruits } from "@/utils/AdminServerAction";

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
  const [editingFruit, setEditingFruit] = useState<Fruit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const pendingFruits = await getFruits();
      const parsedFruits = z.array(FruitSchema).safeParse(pendingFruits);
      if (parsedFruits.success) setFruits(parsedFruits.data);
    }
    fetchData();
  }, []);

  function handleEdit(fruit: Fruit) {
    setEditingFruit(fruit);
    setIsModalOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    const schema = z.object({
      id: z.string(),
      stock: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Stock harus berupa angka",
      }),
    });

    const raw = {
      id: formData.get("id"),
      stock: formData.get("stock"),
    };

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      toast.error("Data tidak valid.");
      return;
    }

    const result = await editFruit({
      id: parsed.data.id,
      stock: Number(parsed.data.stock),
    });

    if (result.success) {
      setFruits((prev) =>
        prev.map((f) =>
          f.id === parsed.data.id
            ? { ...f, stock: Number(parsed.data.stock) }
            : f
        )
      );
      toast.success("Data buah berhasil diubah");
      setIsModalOpen(false);
    } else {
      toast.error("Gagal mengubah data buah");
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">List Buah</h1>
      <Card>
        <CardContent className="p-4">
          {fruits.length === 0 ? (
            <p>Tidak ada buah.</p>
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
                            className="w-full justify-between"
                          >
                            Aksi <MoreVertical className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEdit(fruit)}
                            className="text-blue-600 hover:bg-blue-100 cursor-pointer"
                          >
                            Edit
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

      {isModalOpen && editingFruit && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Edit Buah</h2>
            <form
              action={async (formData) => {
                await handleSubmit(formData);
              }}
            >
              <input type="hidden" name="id" value={editingFruit.id} />
              <div className="mb-4">
                <label className="block mb-1">Nama</label>
                <input
                  name="name"
                  defaultValue={editingFruit.name}
                  className="border w-full p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  defaultValue={editingFruit.stock}
                  className="border w-full p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
