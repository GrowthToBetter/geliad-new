"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationship";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage({
  userData,
  file,
}: {
  userData: userFullPayload;
  file: FileFullPayload[];
}) {
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [commentDialogs, setCommentDialogs] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const handleProf = (id: string) => {
    setOpenProfiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCommentDialog = (id: string, open: boolean) => {
    setCommentDialogs((prev) => ({
      ...prev,
      [id]: open,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "DENIED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const filteredFile = file.filter((file) => file.userId == userData?.id);
  const hasComments = (file: FileFullPayload) =>
    file.comment && file.comment.length > 0;

  const isPrivilegedUser =
    userData?.role === "GURU" ||
    userData?.role === "VALIDATOR" ||
    userData?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs for Privileged Users */}
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
                      Komentar Karya Yang Diajukan
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="validasi" asChild>
                    <Link
                      href="/profile/notification/Validasi"
                      className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
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
              Komentar Karya Yang Diajukan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {filteredFile && filteredFile.length > 0 ? (
              <div className="space-y-6">
                {filteredFile.filter(hasComments).map((file) => (
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
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              className={getStatusColor(file.status)}>
                              {file.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Comments Dialog */}
                          <Dialog
                            open={commentDialogs[file.id] || false}
                            onOpenChange={(open) =>
                              handleCommentDialog(file.id, open)
                            }>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Comments ({file.comment.length})
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Comments from Validator
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                {file.comment.map((comment, index) => (
                                  <Card
                                    key={`${file.id}-comment-${index}`}
                                    className="bg-gray-50">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start gap-4">
                                        <p className="text-gray-800 flex-1">
                                          {comment.Text}
                                        </p>
                                        <Badge
                                          variant="outline"
                                          className="text-xs whitespace-nowrap">
                                          {comment.user?.name}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* View File Button */}
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              if (
                                file.mimetype.includes("msword") ||
                                file.mimetype.includes(
                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                )
                              ) {
                                handleProf(file.id);
                              } else {
                                router.push(file.path);
                              }
                            }}
                            className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Lihat File
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* File Preview Dialog */}
                {Object.keys(openProfiles).map((fileId) => {
                  const file = filteredFile.find((f) => f.id === fileId);
                  if (!file || !openProfiles[fileId]) return null;

                  return (
                    <Dialog
                      key={fileId}
                      open={openProfiles[fileId]}
                      onOpenChange={(open) =>
                        setOpenProfiles((prev) => ({ ...prev, [fileId]: open }))
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
                            src={`${file.path}&output=embed`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 font-medium">
                  Belum Ada Karya untuk dilihat
                </p>
                <p className="text-gray-500 mt-2">
                  Karya yang Anda ajukan akan muncul di sini
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
