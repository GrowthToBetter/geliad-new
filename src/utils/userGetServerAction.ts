"use server";
import { getServerSession } from "@/auth";
import { Class, Gender, Role, Status } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createUser, updateUser } from "./user.query";

export const UpdateGeneralProfileById = async (data: FormData) => {
  try {
    const session = await getServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("clasess") as Class;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const ClassNumber = data.get("classDetail") as string;
    const status = data.get("status") as Status;
    const gender = data.get("gender") as Gender;

    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        ClassNumber,
        Phone,
        status,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });

      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          ClassNumber: ClassNumber ?? findUserWithId?.ClassNumber,
          Phone: Phone ?? findUserWithId?.Phone,
          role: role ?? findUserWithId?.role,
          status: status ?? findUserWithId?.status,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const UpdateCoverProfile = async (url: string) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    const update = await prisma.user.update({
      where: { id: session?.user?.id as string },
      data: {
        cover: url,
      },
    });
    if (!update) {
      return { status: false, message: "Failed to update Photo Profile" };
    }
    revalidatePath("/profile");
    return { status: true, message: "Success to update Photo Profile" };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};
