"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Search,
  FileText,
  Eye,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationship";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@/generated/prisma";

import { toast } from "sonner";
import {
  addViews,
  commentFile,
  DeleteRoleFileFromNotif,
  updateStatus,
} from "@/utils/FileServerAction";
import PDFPreviewDialog from "@/components/Ajukan/PDFPreview";

export default function ValidationPage({
  userData,
  file,
}: {
  userData: userFullPayload;
  file: FileFullPayload[];
}) {
  const [taskFields, setTaskFields] = useState([{ task: "", details: [""] }]);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [previewCloud, setPreviewCloud] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [commentDialog, setCommentDialog] = useState<{
    [key: string]: boolean;
  }>({});
  const [previewDialog, setPreviewDialog] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleProfileDropdown = (id: string) => {
    setOpenProfiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCommentDialog = (id: string, open: boolean) => {
    setCommentDialog((prev) => ({
      ...prev,
      [id]: open,
    }));
  };

  const handlePreviewDialog = (id: string, open: boolean) => {
    setPreviewDialog((prev) => ({
      ...prev,
      [id]: open,
    }));
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTaskFields = [...taskFields];
    newTaskFields[index].task = value;
    setTaskFields(newTaskFields);
  };

  const handleAddTaskField = () => {
    setTaskFields([...taskFields, { task: "", details: [""] }]);
  };

  const handleMinTaskField = () => {
    if (taskFields.length > 1) {
      setTaskFields(taskFields.slice(0, -1));
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const loading = toast.loading("Updating status...");
      const formData = new FormData();
      formData.set("status", status as RequestStatus);
      await updateStatus(id, formData);
      toast.success("Status updated successfully", { id: loading });
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleRemove = async (fileId: string) => {
    try {
      const loading = toast.loading("Deleting...");
      const update = await DeleteRoleFileFromNotif(fileId);
      if (!update) {
        throw new Error("Failed to delete");
      }
      toast.success("File deleted successfully", { id: loading });
      return update;
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const addView = async (file: FileFullPayload) => {
    const loading = toast.loading("Loading...");
    try {
      const update = await addViews(file.id, file.views + 1);
      if (!update) {
        toast.error("Failed to add view");
        return;
      }
      toast.success("View added", { id: loading });
      return update;
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    idFile: string,
    idUser: string
  ) => {
    e.preventDefault();
    try {
      const loading = toast.loading("Submitting comments...");

      for (const field of taskFields) {
        if (field.task.trim()) {
          const user = { connect: { id: idUser } };
          const file = { connect: { id: idFile } };
          await commentFile(field.task, file, user);
        }
      }

      toast.success("Comments submitted successfully", { id: loading });
      setTaskFields([{ task: "", details: [""] }]);
      setCommentDialog((prev) => ({ ...prev, [idFile]: false }));
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "DENIED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "VERIFIED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const filteredFile =
    userData?.role === "GURU"
      ? file.filter((file) => file.userRole === "SISWA")
      : userData?.role === "VALIDATOR"
      ? file.filter((file) => file.userRole === "GURU")
      : file.filter((file) => file.userRole !== "DELETE");

  const filteredByName = searchInput
    ? filteredFile.filter((fileData: FileFullPayload) =>
        fileData.filename.toLowerCase().includes(searchInput.toLowerCase())
      )
    : filteredFile;

  const isPrivilegedUser =
    userData?.role === "GURU" ||
    userData?.role === "VALIDATOR" ||
    userData?.role === "ADMIN";

  const handleReadCloudinary = (link: string) => {
    setPreviewCloud(link);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        {isPrivilegedUser && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <Tabs defaultValue="karya" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="karya" asChild>
                    <Link
                      href="/profile/notification/Karya"
                      className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Karya Yang Diajukan
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="validasi" asChild>
                    <Link
                      href="/profile/notification/Validasi"
                      className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Validasi Karya
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Validate Karya Sekarang
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search file name..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Files List */}
            {filteredByName && filteredByName.length > 0 ? (
              <div className="space-y-6">
                {filteredByName.map((file) => (
                  <Card
                    key={file.id}
                    className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={file.path}
                            className="group flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            <FileText className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate">{file.filename}</span>
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={getStatusColor(file.status)}>
                              {file.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Views: {file.views}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Read/Preview Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (
                                file.path.includes("drive") ||
                                file.path.includes("Drive")
                              ) {
                                handlePreviewDialog(file.id, true);
                              } else if (file.path.includes("cloudinary")) {
                                handleReadCloudinary(file.path as string);
                              } else {
                                router.push(file.path);
                              }
                              await addView(file);
                            }}
                            className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(file.id)}
                            className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>

                          {/* User Actions Dropdown - Now Controlled */}
                          <DropdownMenu
                            open={openProfiles[file.id] || false}
                            onOpenChange={(open) => {
                              if (!open) {
                                // Close the dropdown
                                setOpenProfiles((prev) => ({
                                  ...prev,
                                  [file.id]: false,
                                }));
                              }
                            }}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => handleProfileDropdown(file.id)}>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      file.user?.photo_profile ||
                                      "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png"
                                    }
                                    alt={file.user?.name || "User"}
                                  />
                                  <AvatarFallback>
                                    {file.user?.name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/ListKarya/user/profile/${file.userId}`}
                                  className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Visit Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  handleStatusUpdate(file.id, "VERIFIED");
                                  setOpenProfiles((prev) => ({
                                    ...prev,
                                    [file.id]: false,
                                  }));
                                }}
                                className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleStatusUpdate(file.id, "DENIED");
                                  setOpenProfiles((prev) => ({
                                    ...prev,
                                    [file.id]: false,
                                  }));
                                }}
                                className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-4 w-4" />
                                Deny
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.error(
                                    "this feature is under development"
                                  );
                                }}
                                className="flex items-center gap-2 text-purple-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="currentColor">
                                  <path d="M9 2a1 1 0 0 1 1 1v1.07A7.001 7.001 0 0 1 17.93 11H19a1 1 0 1 1 0 2h-1.07A7.001 7.001 0 0 1 10 20.93V22a1 1 0 1 1-2 0v-1.07A7.001 7.001 0 0 1 4.07 13H3a1 1 0 1 1 0-2h1.07A7.001 7.001 0 0 1 8 4.07V3a1 1 0 0 1 1-1zm1 4.07V5a5 5 0 1 0 5 5h-.07a6.987 6.987 0 0 1-4.93-3.93z" />
                                </svg>
                                Check Plagiarism
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  handleCommentDialog(file.id, true);
                                  setOpenProfiles((prev) => ({
                                    ...prev,
                                    [file.id]: false,
                                  }));
                                }}
                                className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Add Comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Comment Dialog */}
                {Object.keys(commentDialog).map((fileId) => {
                  const file = filteredByName.find((f) => f.id === fileId);
                  if (!file || !commentDialog[fileId]) return null;

                  return (
                    <Dialog
                      key={`comment-${fileId}`}
                      open={commentDialog[fileId]}
                      onOpenChange={(open) =>
                        handleCommentDialog(fileId, open)
                      }>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Add Comments to {file.filename}
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) =>
                            handleSubmit(e, file.id, userData?.id || "")
                          }>
                          <div className="space-y-4 mt-4">
                            {taskFields.map((field, taskIndex) => (
                              <Card key={taskIndex} className="p-4">
                                <div className="space-y-3">
                                  <Label htmlFor={`comment-${taskIndex}`}>
                                    Comment {taskIndex + 1}
                                  </Label>
                                  <Textarea
                                    id={`comment-${taskIndex}`}
                                    placeholder="Enter your comment..."
                                    value={field.task}
                                    onChange={(e) =>
                                      handleTaskChange(
                                        taskIndex,
                                        e.target.value
                                      )
                                    }
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={handleAddTaskField}
                                      className="flex items-center gap-1">
                                      <Plus className="h-3 w-3" />
                                      Add
                                    </Button>
                                    {taskFields.length > 1 && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={handleMinTaskField}
                                        className="flex items-center gap-1">
                                        <Minus className="h-3 w-3" />
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                          <DialogFooter className="mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                handleCommentDialog(fileId, false)
                              }>
                              Cancel
                            </Button>
                            <Button type="submit">Submit Comments</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  );
                })}

                {/* Preview Dialog */}
                {Object.keys(previewDialog).map((fileId) => {
                  const file = filteredByName.find((f) => f.id === fileId);
                  if (!file || !previewDialog[fileId]) return null;

                  return (
                    <Dialog
                      key={`preview-${fileId}`}
                      open={previewDialog[fileId]}
                      onOpenChange={(open) =>
                        handlePreviewDialog(fileId, open)
                      }>
                      <DialogContent className="max-w-6xl h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {file.filename}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 mt-4">
                          <iframe
                            className="w-full h-full rounded-md border"
                            src={`https://drive.google.com/file/d/${file.permisionId}/preview`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
                {previewCloud && (
                  <PDFPreviewDialog
                    previewCloud={previewCloud}
                    setPreviewCloud={setPreviewCloud}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 font-medium">
                  Belum Ada Karya untuk dilihat
                </p>
                <p className="text-gray-500 mt-2">
                  Files submitted for validation will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
