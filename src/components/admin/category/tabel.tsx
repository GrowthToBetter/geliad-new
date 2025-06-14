"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { GenreFullPayload } from "@/utils/relationship";
import AddGenre from "./addGenre";
import ModalGenre from "./modalGenre";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { DeleteGenre } from "@/utils/genreGetServerAction";

interface TableGenreProps {
  dataGenre: GenreFullPayload[];
}

export default function TableGenre({ dataGenre }: TableGenreProps) {
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<GenreFullPayload | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const EditGenre = async (data: GenreFullPayload) => {
    setModal(true);
    setModalData(data);
  };

  const DeleteGenreById = async (id: string) => {
    setIsDeleting(id);
    const toastId = toast.loading("Deleting genre...");

    try {
      const result = await DeleteGenre(id);
      if (result) {
        toast.success(result.message, { id: toastId });
      }
    } catch {
      toast.error("Failed to delete genre", { id: toastId });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <div className="w-full space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl font-bold">
                  Genre Management
                </CardTitle>
              </div>
              <AddGenre />
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Genre</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataGenre.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center py-8 text-gray-500">
                        No genres found
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataGenre.map((genre) => (
                      <TableRow key={genre.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {genre.Genre}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => EditGenre(genre)}
                              className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit genre</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={isDeleting === genre.id}>
                                  {isDeleting === genre.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Delete genre</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Genre
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    <strong>{genre.Genre}</strong>? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => DeleteGenreById(genre.id)}
                                    className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing {dataGenre.length} genre
              {dataGenre.length !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>
      </div>

      {modal && <ModalGenre setIsOpenModal={setModal} data={modalData} />}
    </>
  );
}
