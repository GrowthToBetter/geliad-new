"use server";

import { getServerSession } from "@/auth";
import { Class, Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { userFullPayload } from "./relationship";

export const addLike = async (id: string, like: number) => {
  try {
    const update = await prisma.fileWork.update({
      where: {
        id: id,
      },
      data: {
        Like: like,
      },
    });
    if (!update) {
      throw new Error("Gagal Menambahkan Like");
    }
    revalidatePath("/");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const addViews = async (id: string, views: number) => {
  try {
    const update = await prisma.fileWork.update({
      where: {
        id: id,
      },
      data: {
        views,
      },
    });
    if (!update) {
      throw new Error("Gagal Menambahkan Like");
    }
    revalidatePath("/");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const UpdateCoverFile = async (id: string, url: string) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    const update = await prisma.fileWork.update({
      where: { id: id },
      data: {
        coverFile: url,
      },
    });
    if (!update) {
      return { status: false, message: "Failed to update Cover" };
    }
    revalidatePath("/");
    return { status: true, message: "Success to update Cover" };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};

export const updateUploadFileByLink = async (
  data: FormData,
  userData: userFullPayload
) => {
  try {
    const name = data.get("name") as string;
    const type = data.get("type") as string;
    const Classes = data.get("kelas") as Class;
    const Genre = data.get("Genre");
    if (!Genre) {
      throw new Error("eror");
    }
    const size = 0;
    const url = data.get("url") as string;
    const userId = data.get("userId") as string;
    const fileName = `${userData?.name}_${name}_${userData?.SchoolOrigin}`;
    const role = data.get("role") as Role;
    const uploadedFile = await prisma.fileWork.create({
      data: {
        filename: fileName,
        mimetype: type,
        size: size,
        userClasses: Classes as Class,
        path: url,
        genre: Genre as string,
        userId: userId,
        status: "PENDING",
        userRole: role,
      },
    });
    if (!uploadedFile) {
      throw new Error("eror");
    }
    revalidatePath("/AjukanKarya");
    return uploadedFile;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// server function
export const updateUploadFile = async (
  data: FormData,
  userData: userFullPayload
) => {
  try {
    const mimetype = data.get("mimetype") as string;
    const Classes = data.get("class") as Class;
    const Genre = data.get("genre") as string;
    const path = data.get("path") as string;
    const size = parseInt(data.get("size") as string);
    const userId = data.get("userId") as string;
    const originalFileName = data.get("filename") as string;

    if (!Genre || !mimetype || !path || !userId || !originalFileName) {
      throw new Error("Missing required fields");
    }

    const fileName = `${userData.name}_${originalFileName}_${userData.SchoolOrigin}`;

    const uploadedFile = await prisma.fileWork.create({
      data: {
        filename: fileName,
        mimetype,
        size,
        userClasses: Classes,
        path,
        genre: Genre,
        userId,
        status: "PENDING",
        userRole: userData.role,
      },
    });

    if (!uploadedFile) {
      throw new Error("Failed to create fileWork");
    }

    revalidatePath("/AjukanKarya");
    return uploadedFile;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
