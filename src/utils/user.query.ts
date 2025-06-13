"use server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  update: Prisma.UserUncheckedUpdateInput
) => {
  return await prisma.user.update({ where, data: update });
};
export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  return await prisma.user.create({ data });
};
