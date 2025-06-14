"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, BookOpen } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { GenreFullPayload } from "@/utils/relationship";
import { UpdateGenreByIdInAdmin } from "@/utils/genreGetServerAction";

// Validation schema
const genreSchema = z.object({
  Genre: z
    .string()
    .min(2, "Genre must be at least 2 characters")
    .max(50, "Genre must be less than 50 characters")
    .trim(),
});

// Types
type GenreFormValues = z.infer<typeof genreSchema>;

interface ModalGenreProps {
  setIsOpenModal: (isOpen: boolean) => void;
  data?: GenreFullPayload | null;
}

// Utility functions
const createFormData = (values: GenreFormValues): FormData => {
  const formData = new FormData();
  formData.append("Genre", values.Genre);
  return formData;
};

export default function ModalGenre({
  setIsOpenModal,
  data,
}: ModalGenreProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEditMode = Boolean(data);

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      Genre: data?.Genre || "",
    },
  });

  const handleClose = useCallback(() => {
    form.reset();
    setIsOpenModal(false);
  }, [form, setIsOpenModal]);

  const onSubmit = useCallback(
    async (values: GenreFormValues) => {
      setIsLoading(true);

      const loadingMessage = isEditMode
        ? "Updating genre..."
        : "Creating genre...";
      const successMessage = isEditMode
        ? "Genre updated successfully"
        : "Genre created successfully";

      const toastId = toast.loading(loadingMessage);

      try {
        const formData = createFormData(values);

        const result = await UpdateGenreByIdInAdmin(
          data?.id || "",
          formData
        );

        if (result) {
          toast.success(result.message || successMessage, { id: toastId });
          handleClose();
        } else {
          toast.error("Operation failed", { id: toastId });
        }
      } catch (error) {
        console.error("Genre operation error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        toast.error(errorMessage, { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
    [isEditMode, data?.id, handleClose]
  );

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {isEditMode ? "Edit Genre" : "Create Genre"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the genre information below."
              : "Fill in the details to create a new genre."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Genre Field */}
            <FormField
              control={form.control}
              name="Genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Category of Paper
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter genre name"
                      {...field}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Genre" : "Create Genre"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}