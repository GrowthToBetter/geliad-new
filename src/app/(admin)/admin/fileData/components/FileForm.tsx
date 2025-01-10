"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { DropDown } from "@/app/components/utils/Form";
import { updateUploadFileByLink } from "@/utils/server-action/userGetServerSession";
import { useZodForm } from "@/utils/use-zod-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { FileFullPayload } from "@/utils/relationsip";
import { Role, Type } from "@prisma/client";
import ModalProfile from "@/app/components/utils/Modal";
import { Dispatch, SetStateAction } from "react";

const uploadSchema = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string().url("Link Product harus berupa URL valid"),
  genre: z.string().min(1, "Genre wajib dipilih"),
  description: z.string(),
  cover: z
  .instanceof(File, { message: "Cover harus berupa file Image yang valid" })
  .nullable(),
  role: z.nativeEnum(Role),
  classes: z.nativeEnum(Type),
});

export const extractClassPrefix = (userClass: string) => {
  const match = userClass.match(/^(X|XI|XII)/i);
  return match ? match[0] : null;
};

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function UploadForm({
  fileData,
  genre,
  setIsOpenModal
}: {
  fileData: FileFullPayload;
  genre: { Genre: string }[];
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const form = useZodForm({
    defaultValues: {
      name: fileData.filename || "",
      type: fileData.type || "",
      url: fileData.path || "",
      genre: fileData.genre || "",
      description: fileData.description || "",
      cover: null,
      role: fileData.userRole as Role,
      classes: fileData.userType,
    },
    schema: uploadSchema,
  });

  const handleSubmit = async (values: UploadFormValues) => {
    const toastId = toast.loading("Uploading...");
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const response = await updateUploadFileByLink(formData, fileData.id);

      if (!response) {
        toast.error("Gagal mengunggah Data", { id: toastId });
      } else {
        toast.success("Data berhasil diunggah", { id: toastId });
        router.refresh();
      }
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`, { id: toastId });
    }
  };

  return (
    <ModalProfile onClose={()=>{setIsOpenModal(false)}} className="mb-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md mt-12">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Product</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan nama Product" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Product</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan tipe Product" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Product</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan link Product" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description Product</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan description Product"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <DropDown
                  label="Genre"
                  options={genre.map((g) => ({
                    label: g.Genre,
                    value: g.Genre,
                  }))}
                  value={field.value}
                  handleChange={(value) => field.onChange(value)}
                  name="genre"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <DropDown
                  label="Role"
                  options={Object.values(Role)
                    .filter((role) => role !== "DELETE")
                    .map((r) => ({
                      label: r,
                      value: r,
                    }))}
                  value={field.value}
                  handleChange={(value) => field.onChange(value)}
                  name="role"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <DropDown
                  label="Class"
                  options={Object.values(Type).map((c) => ({
                    label: c,
                    value: c,
                  }))}
                  value={field.value}
                  handleChange={(value) => field.onChange(value)}
                  name="classes"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unggah Cover</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Unggah
          </Button>
        </form>
      </Form>
    </ModalProfile>
  );
}
