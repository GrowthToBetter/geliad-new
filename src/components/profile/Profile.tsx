"use client";
import React, { useState } from "react";
import Image from "next/image";
import { userFullPayload } from "@/utils/relationship";
import { Gender } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Edit3, Camera } from "lucide-react";

import ModalEditCover from "./ModalEditCover";
import { UpdateGeneralProfileById } from "@/utils/userGetServerAction";

// Zod validation schema
const profileSchema = z.object({
  absent: z.string().optional(),
  Phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(62|0)\d{9,12}$/, "Please enter a valid phone number"),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileProps {
  userData: userFullPayload;
}

export default function Profile({ userData }: ProfileProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      absent: userData?.absent || "",
      Phone: userData?.Phone || "",
      gender: userData?.gender || Gender.Male,
    },
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);

    try {
      // Create FormData to match the existing server action
      const formData = new FormData();
      if (values.absent) formData.append("absent", values.absent);
      formData.append("Phone", values.Phone);
      formData.append("gender", values.gender);

      await UpdateGeneralProfileById(formData);
      toast.success("Sukses Mengisi Data");
      setIsModalOpen(false);
      router.push("/profile");
      window.location.reload();
    } catch (error) {
      console.log((error as Error).message);
      toast.error("Gagal Mengedit Profil");
    } finally {
      setIsLoading(false);
    }
  };

  const formatWhatsAppNumber = (phone: string) => {
    return phone?.includes("0") ? phone.replace("0", "62") : phone;
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <Card className="mt-20 overflow-hidden border-0 shadow-xl">
        <CardContent className="p-0 relative">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72">
            <Image
              quality={100}
              unoptimized
              src={
                (userData?.cover as string) ||
                "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"
              }
              fill
              alt="Cover profile"
              className="object-cover"
            />
            <Button
              onClick={() => setIsCoverModalOpen(true)}
              className="absolute top-4 right-4 bg-white/90 text-gray-700 hover:bg-white"
              size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Edit Cover
            </Button>
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 md:px-12 lg:px-16 pb-8 relative">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={
                      (userData?.photo_profile as string) ||
                      "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png"
                    }
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {userData?.name}
                  {userData?.clasess && (
                    <span className="text-lg sm:text-xl lg:text-2xl font-normal text-gray-600 ml-2">
                      ({userData.clasess})
                    </span>
                  )}
                </h1>
                {userData?.Phone && (
                  <Link
                    href={`https://wa.me/${formatWhatsAppNumber(
                      userData.Phone
                    )}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer">
                    wa.me/{formatWhatsAppNumber(userData.Phone)}
                  </Link>
                )}
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-4">
                      {/* Read-only fields */}
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            value={userData?.name || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            value={userData?.email || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </FormControl>
                      </FormItem>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Absent field - only for SISWA role */}
                        {userData?.role === "SISWA" && (
                          <FormField
                            control={form.control}
                            name="absent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Absent</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Phone field */}
                        <FormField
                          control={form.control}
                          name="Phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="62xxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Gender field */}
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(Gender).map((gender) => (
                                    <SelectItem key={gender} value={gender}>
                                      {gender}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          disabled={isLoading}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cover Edit Modal */}
      {isCoverModalOpen && (
        <ModalEditCover isOpen={isCoverModalOpen} setIsOpenModal={setIsCoverModalOpen} />
      )}
    </div>
  );
}
