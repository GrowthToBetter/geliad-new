"use client";
import { DeleteFile } from "@/utils/server-action/userGetServerSession";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import toast from "react-hot-toast";
import UploadForm from "./FileForm";
import { FileFullPayload } from "@/utils/relationsip";
import { PageContainer } from "@/app/components/layout/PageContainer";

export default function Table({
  fileData,
  genre
}: {
  fileData: FileFullPayload[];
  genre: {Genre:string}[]
}) {
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<FileFullPayload | null>(null);
  const [loader, setLoader] = useState(true);
  const columns: TableColumn<FileFullPayload>[] = [
    {
      name: "Name",
      selector: (row) => row.filename,
      sortable: true,
    },
    {
      name: "Genre",
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Link",
      selector: (row) => row.path,
      sortable: true,
    },
    {
      name: "description",
      selector: (row) => row.description ?? "none",
      sortable: true,
    },
    {
      name: "CreatAt",
      selector: (row) => row.createdAt.toUTCString(),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-x-3">
          <button
            onClick={() => EditUser(row)}
            title="Edit"
            className="p-2 bg-blue-900 text-white rounded-lg hover:scale-110 active:scale-105 duration-150">
            edit
          </button>
          <button
            onClick={() => DeleteUserById(row.id)}
            title="Delete"
            className="p-2.5 bg-red-500 text-white rounded-md hover:scale-110 active:scale-105 duration-150">
            delete
          </button>
        </div>
      ),
    },
  ];
  const EditUser = async (data: FileFullPayload) => {
    setModal(true);
    setModalData(data);
  };

  const DeleteUserById = async (id: string) => {
    if (!confirm("Anda yakin ingin menghapus file ini?")) return;
    const toastId = toast.loading("Loading...");
    const result = await DeleteFile(id);
    if (result) {
      toast.success(result.message, { id: toastId });
    }
  };

  useEffect(() => {
    setLoader(false);
  }, []);

  if (loader) return <div>Loading</div>;
  return (
    <PageContainer>
      <section className="max-w-full min-h-full w-full bg-[#F6F6F6] p-4 outline outline-1 outline-slate-200 ml-6">
        <div className="w-full border-b-2 border-black "></div>
        <div className="mt-6">
          <DataTable data={fileData} columns={columns} />
        </div>
        {modal && <UploadForm setIsOpenModal={setModal} fileData={modalData as FileFullPayload} genre={genre} />}
      </section>
    </PageContainer>
  );
}
