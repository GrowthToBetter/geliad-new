"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, User, Mail, Shield } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userFullPayload } from "@/utils/relationship";
import { UpdateAdminById } from "@/utils/userGetServerAction";

// Valid roles for form (excluding DELETE)
const ValidRole = z.enum(["SISWA", "GURU", "ADMIN", "VALIDATOR"]);

// Base validation schema
const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),
  role: ValidRole,
});


// Edit schema (password optional)
const editUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .max(100, "Password must be less than 100 characters")
    .optional()
    .or(z.literal("")),
});

// Types
type ValidRoleType = z.infer<typeof ValidRole>;
type CreateUserFormValues = z.infer<typeof baseUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;
type UserFormValues = CreateUserFormValues | EditUserFormValues;

interface ModalUserProps {
  isOpen: boolean;
  onClose: () => void;
  data?: userFullPayload | null;
}

// Constants
const AVAILABLE_ROLES: ValidRoleType[] = [
  "SISWA",
  "GURU",
  "ADMIN",
  "VALIDATOR",
];

const ROLE_LABELS: Record<ValidRoleType, string> = {
  ADMIN: "Administrator",
  GURU: "Teacher",
  SISWA: "Student",
  VALIDATOR: "Validator",
} as const;

// Utility functions
const createFormData = (values: UserFormValues): FormData => {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("email", values.email);
  formData.append("role", values.role);

  if ("password" in values && values.password) {
    formData.append("password", values.password);
  }

  return formData;
};

export default function ModalUser({
  isOpen,
  onClose,
  data,
}: ModalUserProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEditMode = Boolean(data);

  // Memoized schema selection
  const schema = useMemo(() => {
    return isEditMode ? editUserSchema : baseUserSchema;
  }, [isEditMode]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      role: (data?.role as ValidRoleType) || "SISWA",
    },
  });
  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const onSubmit = useCallback(
    async (values: UserFormValues) => {

      setIsLoading(true);

      const loadingMessage = isEditMode
        ? "Updating user..."
        : "Creating user...";
      const successMessage = isEditMode
        ? "User updated successfully"
        : "User created successfully";

      const toastId = toast.loading(loadingMessage);

      try {
        const formData = createFormData(values);

        const result = await UpdateAdminById(
          data?.id || "",
          formData
        );
        console.log(result)

        if (result.status==200) {
          toast.success(result.message || successMessage, { id: toastId });
          handleClose();
        } else {
          toast.error("Operation failed");
        }
      } catch (error) {
        console.error("User operation error:", error);

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {isEditMode ? "Edit Admin User" : "Create Admin User"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the admin user information below."
              : "Fill in the details to create a new admin user."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      {...field}
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <>{isEditMode ? "Update User" : "Create User"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
