"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deniedSupplier,
  getPendingSuppliers,
  verifySupplier,
} from "@/utils/AdminServerAction";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { z } from "zod";

const SupplierSchema = z.object({
  id: z.string(),
  member: z.boolean(),
  user: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
  }),
  supplier_data: z
    .object({
      license: z.string().nullable(),
      omzet: z.string().nullable(),
      photo_profile: z.string().nullable(),
    })
    .nullable(),
});

type Supplier = z.infer<typeof SupplierSchema>;

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pendingSuppliers = await getPendingSuppliers();
      const parsedSuppliers = z.array(SupplierSchema).safeParse(pendingSuppliers);
      if (parsedSuppliers.success) setSuppliers(parsedSuppliers.data);
    }
    fetchData();
  }, []);

  async function handleVerify(id: string) {
    const result = await verifySupplier(id);
    if (result.success) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  async function handleDenied(id: string) {
    const result = await deniedSupplier(id);
    if (result.success) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Verifikasi Supplier</h1>
      <Card>
        <CardContent className="p-4">
          {suppliers.length === 0 ? (
            <p>Tidak ada supplier yang menunggu verifikasi.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Nama</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">No Telepon</th>
                  <th className="py-2 px-4">Omzet</th>
                  <th className="py-2 px-4">Foto</th>
                  <th className="py-2 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t">
                    <td className="py-2 px-4">{supplier.user.name || "-"}</td>
                    <td className="py-2 px-4">{supplier.user.email || "-"}</td>
                    <td className="py-2 px-4">{supplier.supplier_data?.license || "-"}</td>
                    <td className="py-2 px-4">{supplier.supplier_data?.omzet || "-"}</td>
                    <td className="py-2 px-4">
                      {supplier.supplier_data?.photo_profile ? (
                        <Image
                          src={supplier.supplier_data.photo_profile}
                          alt="Foto Profil"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2 px-4 w-40">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Aksi <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleVerify(supplier.id)}
                            className="text-green-600 hover:bg-green-100 cursor-pointer"
                          >
                            Verifikasi
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDenied(supplier.id)}
                            className="text-red-600 hover:bg-red-100 cursor-pointer"
                          >
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
