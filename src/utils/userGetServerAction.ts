"use server";
import { getServerSession } from "@/auth";
import { Class, Gender, Role, Status } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createUser, updateUser } from "./user.query";
import { hash } from "bcrypt";
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

export const UpdateAdminById = async (id: string, data: FormData) => {
  try {
    const session = await getServerSession();

    // Authorization check
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }

    if (session.user.role !== "ADMIN") {
      return { status: 403, message: "Unauthorized" };
    }

    // Get data from form
    const email = data.get("email")?.toString().toLowerCase().trim() || "";
    const name = data.get("name")?.toString().trim() || "";
    const rawPassword = data.get("password")?.toString() || "";
    const role = data.get("role") as Role;

    // Validate required fields
    if (!email || !name || !role) {
      return { status: 400, message: "Missing required fields" };
    }

    const password = rawPassword ? await hash(rawPassword, 10) : undefined;

    // If ID not provided, we are creating a new user
    if (!id) {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return { status: 409, message: "Email already in use" };
      }

      await prisma.user.create({
        data: {
          email,
          name,
          role,
          userAuth: {
            create: {
              password: password!,
              last_login: new Date(),
            },
          },
        },
      });

      revalidatePath("/admin");
      return { status: 200, message: "User created successfully" };
    }

    // Update existing user using upsert logic
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { userAuth: true },
    });

    if (!existingUser) {
      return { status: 404, message: "User not found" };
    }

    // Prevent email conflict
    const otherUserWithSameEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (otherUserWithSameEmail) {
      return { status: 409, message: "Email already in use by another user" };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        userAuth: {
          update: {
            ...(password && { password }),
            last_login: new Date(),
          },
        },
      },
    });

    revalidatePath("/admin");
    return { status: 200, message: "User updated successfully" };
  } catch (error) {
    console.error("Error in upsert user:", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
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

export const DeleteUser = async (id: string) => {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role === "SISWA") {
      return { status: 401, message: "Unauthorize" };
    }
    const del = await prisma.user.delete({
      where: { id },
    });
    if (!del) {
      return { status: 400, message: "Failed to delete user!" };
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/admin");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error((error as Error).message);
  }
};
