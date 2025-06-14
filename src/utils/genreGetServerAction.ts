"use server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "@/auth";
import { revalidatePath } from "next/cache";

export const UpdateGenreByIdInAdmin = async (id: string, data: FormData) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const Genre = data.get("Genre") as string;

    const findEmail = await prisma.genre.findFirst({
      where: { Genre },
    });

    if (!findEmail && id == null) {
      const create = await prisma.genre.create({
        data: {
          Genre,
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.genre.findUnique({
        where: { id },
      });
      if (findUser) {
        const update = await prisma.genre.update({
          where: { id: id ?? findUser?.id },
          data: {
            Genre,
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};

export const DeleteGenre = async (id: string) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role === "SISWA") {
      return { status: 401, message: "Unauthorize" };
    }
    const del = await prisma.genre.delete({
      where: { id },
    });
    if (!del) {
      return { status: 400, message: "Failed to delete user!" };
    }
    revalidatePath("/admin/student");
    revalidatePath("/admin");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error((error as Error).message);
  }
};
