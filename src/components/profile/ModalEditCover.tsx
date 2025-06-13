/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";

import { uploadImageToCloudinary } from "@/utils/cloudinary.utils";
import { randomString } from "@/utils/validate-file.utils";
import { UpdateCoverProfile } from "@/utils/userGetServerAction";
import { Form } from "@/components/ui/form";

interface ModalEditCoverProps {
  isOpen: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalEditCover({
  isOpen,
  setIsOpenModal,
}: ModalEditCoverProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      return "Only .jpg, .jpeg, .png and .webp formats are supported";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    try {
      let coverUrl: string | undefined;

      if (selectedFile && previewUrl) {
        // Convert file to base64 for cloudinary upload
        const base64 = previewUrl.split(",")[1]; // Remove data:image/...;base64, prefix

        const result = await uploadImageToCloudinary({
          base64: `data:${selectedFile.type};base64,${base64}`,
          publicId: `cover-profile-${randomString(10)}`,
        });
        coverUrl = result.url;
      }

      // Update cover profile with the cloudinary URL
      const update = await UpdateCoverProfile(coverUrl ?? "");

      if (update) {
        toast.success(update.message || "Cover berhasil diperbarui");
        setIsOpenModal(false);
        // Reset state
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memperbarui cover");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPreviewUrl("");
    setSelectedFile(null);
    setError("");
  };

  const handleClose = () => {
    setIsOpenModal(false);
    resetForm();
  };

  const removePreview = () => {
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Cover Photo
          </DialogTitle>
          <DialogDescription>
            Upload a new cover photo for your profile. Recommended size:
            1200x400px
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-medium">
              Upload Cover Photo <span className="text-red-500">*</span>
            </label>

            <div className="space-y-4">
              {/* File Input */}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cover-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="cover-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG or WEBP (MAX. 5MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

              {/* Preview */}
              {previewUrl && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    <div className="relative w-full h-48">
                      <Image
                        src={previewUrl}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 600px) 100vw, 600px"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removePreview}
                        disabled={isLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ImageIcon className="h-4 w-4" />
                        <span className="truncate">{selectedFile?.name}</span>
                        <span className="text-xs">
                          (
                          {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !previewUrl}
              className="min-w-[100px]">
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
      </DialogContent>
    </Dialog>
  );
}
