/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Custom RadioGroup components
const RadioGroup = ({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className} role="radiogroup">
    {children}
  </div>
);

const RadioGroupItem = ({
  value,
  id,
  checked,
  onChange,
}: {
  value: string;
  id: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}) => (
  <input
    type="radio"
    id={id}
    value={value}
    checked={checked}
    onChange={() => onChange?.(value)}
    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
  />
);

// Lucide icons
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Eye,
  Trash2,
  Edit,
  Link as LinkIcon,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
} from "lucide-react";

import { Class, Genre, RequestStatus, Role } from "@prisma/client";
import {
  FileFullPayload,
  GenreFullPayload,
  userFullPayload,
} from "@/utils/relationship";
import {
  uploadImageToCloudinary,
  uploadPDFToCloudinary,
} from "@/utils/cloudinary.utils";
import { ModalEditCover } from "./ModalEditCoverFile";
import {
  updateUploadFile,
  updateUploadFileByLink,
} from "@/utils/FileServerAction";
import PDFPreviewDialog from "./PDFPreview";

// Zod schemas
const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf",
      "Only images and PDF files are allowed"
    ),
  genre: z.string().min(1, "Genre is required"),
  class: z.nativeEnum(Class, { required_error: "Class is required" }),
});

const linkUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.string().min(1, "File type is required"),
  url: z.string().url("Please enter a valid URL"),
  genre: z.string().min(1, "Genre is required"),
  class: z.nativeEnum(Class, { required_error: "Class is required" }),
});

interface UploadPageProps {
  userData: userFullPayload;
  genre: GenreFullPayload[];
  files: FileFullPayload[];
}

interface FileUploadForm {
  genre: string;
  class: Class | "";
}

interface LinkUploadForm {
  name: string;
  type: string;
  url: string;
  genre: string;
  class: Class | "";
}

export default function UploadPage({
  userData,
  genre,
  files,
}: UploadPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewCloud, setPreviewCloud] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Form states
  const [fileUploadForm, setFileUploadForm] = useState<FileUploadForm>({
    genre: "",
    class: "",
  });

  const [linkUploadForm, setLinkUploadForm] = useState<LinkUploadForm>({
    name: "",
    type: "",
    url: "",
    genre: "",
    class: "",
  });

  const [formErrors, setFormErrors] = useState<{
    fileUpload?: Record<string, string>;
    linkUpload?: Record<string, string>;
  }>({});

  // Get unique genres
  const uniqueGenres = React.useMemo(() => {
    const genreSet = new Set(genre.map((g) => g.Genre));
    return Array.from(genreSet);
  }, [genre]);

  // File drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    // Validate form data
    const formData = {
      file: selectedFile,
      genre: fileUploadForm.genre,
      class: fileUploadForm.class,
    };

    try {
      const validatedData = fileUploadSchema.parse(formData);
      setFormErrors((prev) => ({ ...prev, fileUpload: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors((prev) => ({ ...prev, fileUpload: errors }));
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString("base64");

      let cloudinaryUrl: string;

      if (selectedFile.type.startsWith("image/")) {
        const dataURI = `data:${selectedFile.type};base64,${base64String}`;
        const result = await uploadImageToCloudinary({
          base64: dataURI,
          publicId: `work-${userData.id}-${Date.now()}`,
        });
        cloudinaryUrl = result.url;
      } else if (selectedFile.type === "application/pdf") {
        const dataURI = `data:application/pdf;base64,${base64String}`;
        const result = await uploadPDFToCloudinary({
          base64: dataURI,
          publicId: `work-${userData.id}-${Date.now()}`,
        });
        cloudinaryUrl = result.url;
      } else {
        throw new Error("Unsupported file type");
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Save to database
      const dbFormData = new FormData();
      dbFormData.append("filename", selectedFile.name);
      dbFormData.append("mimetype", selectedFile.type);
      dbFormData.append("path", cloudinaryUrl);
      dbFormData.append("size", selectedFile.size.toString());
      dbFormData.append("userId", userData.id);
      dbFormData.append("genre", fileUploadForm.genre);
      dbFormData.append("class", fileUploadForm.class);

      // Replace with your actual save function
      // await saveFileToDatabase(dbFormData);

      setUploadProgress(100);

      await updateUploadFile(dbFormData, userData);

      toast.success("File uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setFileUploadForm({ genre: "", class: "" });
      setIsUploadModalOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Link upload handler
  const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    try {
      const validatedData = linkUploadSchema.parse(linkUploadForm);
      setFormErrors((prev) => ({ ...prev, linkUpload: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors((prev) => ({ ...prev, linkUpload: errors }));
        return;
      }
    }

    const loading = toast.loading("Saving link...");

    try {
      const formData = new FormData();
      formData.append("name", linkUploadForm.name);
      formData.append("type", linkUploadForm.type);
      formData.append("url", linkUploadForm.url);
      formData.append("userId", userData.id);
      formData.append("role", userData.role);
      formData.append("genre", linkUploadForm.genre);
      formData.append("kelas", linkUploadForm.class);

      // Replace with your actual function
      // const result = await updateUploadFileByLink(formData, userData);

      // Simulate success for now
      const result = await updateUploadFileByLink(formData, userData);

      if (result) {
        toast.success("Link saved successfully!", { id: loading });

        // Reset form
        setLinkUploadForm({
          name: "",
          type: "",
          url: "",
          genre: "",
          class: "",
        });
        setIsLinkModalOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to save link", { id: loading });
      }
    } catch (error) {
      toast.error("Error saving link", { id: loading });
      console.error(error);
    }
  };

  // Delete handler
  const handleDelete = async (fileId: string, file: FileFullPayload) => {
    const loading = toast.loading("Deleting file...");

    try {
      // Replace with your actual delete function
      // const response = await DeleteFile(fileId, file);

      // Simulate success for now
      const response = { status: 200, message: "File deleted successfully" };

      if (response.status === 200) {
        toast.success("File deleted successfully", { id: loading });
        router.refresh();
      } else {
        toast.error(response.message, { id: loading });
      }
    } catch (error) {
      toast.error("Failed to delete file", { id: loading });
      console.error(error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const variants: Record<
      RequestStatus,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ComponentType<{ className?: string }>;
        color: string;
      }
    > = {
      PENDING: {
        variant: "secondary",
        icon: Clock,
        color: "text-yellow-600",
      },
      DENIED: {
        variant: "destructive",
        icon: AlertCircle,
        color: "text-red-600",
      },
      VERIFIED: {
        variant: "outline",
        icon: CheckCircle,
        color: "text-blue-600",
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  if (!userData || !genre) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Submit Your Work
            </CardTitle>
            <CardDescription className="text-lg">
              Upload your files and wait for our team to validate them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Dialog
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Upload className="h-5 w-5" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                      Upload images or PDF files (max 10MB)
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleFileUpload} className="space-y-4">
                    {/* Genre Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select
                        value={fileUploadForm.genre}
                        onValueChange={(value) =>
                          setFileUploadForm((prev) => ({
                            ...prev,
                            genre: value,
                          }))
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueGenres.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.fileUpload?.genre && (
                        <p className="text-sm text-red-600">
                          {formErrors.fileUpload.genre}
                        </p>
                      )}
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <RadioGroup
                        value={fileUploadForm.class}
                        onValueChange={(value) =>
                          setFileUploadForm((prev) => ({
                            ...prev,
                            class: value as Class,
                          }))
                        }>
                        <div className="flex space-x-6">
                          {Object.values(Class).map((cls) => (
                            <div
                              key={cls}
                              className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={cls}
                                id={cls}
                                checked={fileUploadForm.class === cls}
                                onChange={(value) =>
                                  setFileUploadForm((prev) => ({
                                    ...prev,
                                    class: value as Class,
                                  }))
                                }
                              />
                              <Label htmlFor={cls}>Class {cls}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      {formErrors.fileUpload?.class && (
                        <p className="text-sm text-red-600">
                          {formErrors.fileUpload.class}
                        </p>
                      )}
                    </div>

                    {/* File Drop Zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-primary"
                      } ${
                        isUploading ? "pointer-events-none opacity-50" : ""
                      }`}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          {selectedFile ? (
                            <div>
                              <p className="text-lg font-medium text-green-600">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          ) : (
                            <>
                              <p className="text-lg font-medium">
                                {dragActive
                                  ? "Drop the file here"
                                  : "Drag & drop file here, or click to select"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Support: Images (PNG, JPG, GIF, WebP) and PDF
                                files
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {formErrors.fileUpload?.file && (
                      <p className="text-sm text-red-600">
                        {formErrors.fileUpload.file}
                      </p>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={isUploading || !selectedFile}>
                        {isUploading ? "Uploading..." : "Upload File"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Upload by Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload by Link</DialogTitle>
                    <DialogDescription>
                      Add a file by providing a link
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleLinkSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">File Name</Label>
                      <Input
                        id="name"
                        value={linkUploadForm.name}
                        onChange={(e) =>
                          setLinkUploadForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter file name"
                      />
                      {formErrors.linkUpload?.name && (
                        <p className="text-sm text-red-600">
                          {formErrors.linkUpload.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">File Type</Label>
                      <Input
                        id="type"
                        value={linkUploadForm.type}
                        onChange={(e) =>
                          setLinkUploadForm((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        placeholder="e.g., PDF, Image"
                      />
                      {formErrors.linkUpload?.type && (
                        <p className="text-sm text-red-600">
                          {formErrors.linkUpload.type}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">File URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={linkUploadForm.url}
                        onChange={(e) =>
                          setLinkUploadForm((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                      {formErrors.linkUpload?.url && (
                        <p className="text-sm text-red-600">
                          {formErrors.linkUpload.url}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Class</Label>
                      <RadioGroup
                        value={linkUploadForm.class}
                        onValueChange={(value) =>
                          setLinkUploadForm((prev) => ({
                            ...prev,
                            class: value as Class,
                          }))
                        }>
                        <div className="flex space-x-6">
                          {Object.values(Class).map((cls) => (
                            <div
                              key={cls}
                              className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={cls}
                                id={`link-${cls}`}
                                checked={linkUploadForm.class === cls}
                                onChange={(value) =>
                                  setLinkUploadForm((prev) => ({
                                    ...prev,
                                    class: value as Class,
                                  }))
                                }
                              />
                              <Label htmlFor={`link-${cls}`}>Class {cls}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      {formErrors.linkUpload?.class && (
                        <p className="text-sm text-red-600">
                          {formErrors.linkUpload.class}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="link-genre">Genre</Label>
                      <Select
                        value={linkUploadForm.genre}
                        onValueChange={(value) =>
                          setLinkUploadForm((prev) => ({
                            ...prev,
                            genre: value,
                          }))
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueGenres.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.linkUpload?.genre && (
                        <p className="text-sm text-red-600">
                          {formErrors.linkUpload.genre}
                        </p>
                      )}
                    </div>

                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Uploaded Files</CardTitle>
            <CardDescription>
              Manage your submitted works and track their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length > 0 ? (
              <div className="space-y-4">
                {files.map((file) => (
                  <Card key={file.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {file.mimetype?.includes("image") ? (
                            <ImageIcon className="h-6 w-6 text-blue-600" />
                          ) : (
                            <FileText className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {file.filename}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <StatusBadge status={file.status} />
                            <span className="text-sm text-gray-500">
                              {file.mimetype?.includes("image")
                                ? "Image"
                                : "PDF"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const isGoogleDrive = file.path?.includes("drive");
                            const isCloudinaryPDF =
                              file.mimetype?.includes("pdf");

                            if (isGoogleDrive) {
                              // your custom preview behavior (setPreviewFile will trigger a preview modal for example)
                              setPreviewFile(file.permisionId || file.path);
                            } else if (isCloudinaryPDF) {
                              // Open Cloudinary-hosted PDF directly
                              setPreviewCloud(file.path);
                            } else {
                              // Fallback for other public links (Dropbox, OneDrive, etc.)
                              window.open(file.path, "_blank");
                            }
                          }}
                          className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setIsEditModalOpen({
                              ...isEditModalOpen,
                              [file.id]: true,
                            })
                          }
                          className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        {isEditModalOpen[file.id] && (
                          <ModalEditCover
                            id={file.id}
                            isOpen={isEditModalOpen[file.id]}
                            onClose={() =>
                              setIsEditModalOpen({
                                ...isEditModalOpen,
                                [file.id]: false,
                              })
                            }
                          />
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your file.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(file.id, file)}
                                className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No files uploaded yet
                </h3>
                <p className="text-gray-500">
                  Upload your first file to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Preview Modal */}
        {previewFile && (
          <Dialog
            open={!!previewFile}
            onOpenChange={() => setPreviewFile(null)}>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>File Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`https://drive.google.com/file/d/${previewFile}/preview`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {previewCloud && (
        <PDFPreviewDialog
          previewCloud={previewCloud}
          setPreviewCloud={setPreviewCloud}
        />
        )}
      </div>
    </div>
  );
}
