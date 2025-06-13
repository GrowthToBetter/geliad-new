"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "sonner";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { uploadImageToCloudinary } from "@/utils/cloudinary.utils";
import { randomString } from "@/utils/validate-file.utils";
import { UpdateCoverFile } from "@/utils/FileServerAction";

// Validation schema
const coverFormSchema = z.object({
  cover: z
    .string()
    .min(1, "Please select a cover image")
    .refine((value) => value.startsWith("data:image/"), "Please select a valid image file"),
});

type CoverFormValues = z.infer<typeof coverFormSchema>;



interface ModalEditCoverProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function ModalEditCover({ 
  isOpen, 
  onClose, 
  id 
}: ModalEditCoverProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const form = useForm<CoverFormValues>({
    resolver: zodResolver(coverFormSchema),
    defaultValues: {
      cover: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setCoverFile(file);
      setFileName(file.name);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        form.setValue('cover', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CoverFormValues) => {
    setIsLoading(true);
    try {
      let coverUrl: string | undefined;

      if (data.cover && coverFile) {
        const result = await uploadImageToCloudinary({
          base64: data.cover,
          publicId: `user-cover-${id}-${randomString(10)}`,

        });
        coverUrl = result.url;
      }

      if (coverUrl) {
        await UpdateCoverFile(id, coverUrl);
        toast.success("Cover berhasil diperbarui");
        form.reset();
        setCoverFile(null);
        setFileName("");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memperbarui cover");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setCoverFile(null);
    setFileName("");
    onClose();
  };

  const removeFile = () => {
    setCoverFile(null);
    setFileName("");
    form.setValue('cover', '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Edit Cover Image
          </DialogTitle>
          <DialogDescription>
            Upload a new cover image for your profile. Recommended size: 1200x400 pixels.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Cover Image *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!coverFile ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                          <div className="space-y-2">
                            <p className="text-sm text-slate-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-slate-500">
                              PNG, JPG, JPEG up to 5MB
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {fileName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {(coverFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeFile}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Preview Image */}
                              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                                <Image
                                  src={field.value}
                                  alt="Cover preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <Badge variant="secondary" className="w-fit">
                                Ready to upload
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !coverFile}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Update Cover"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}