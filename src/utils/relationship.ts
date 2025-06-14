import { Prisma } from "@/generated/prisma";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true } } };
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {
    userAuth: true;
    File: {
      include: {
        user: { include: { userAuth: true } };
        TaskValidator: true;
        comment: { include: { user: true } };
      };
    };
    taskValidator: { include: { user: true } };
    comment: { include: { file: true } };
  };
}>;
export type FileFullPayload = Prisma.fileWorkGetPayload<{
  include: {
    user: { include: { userAuth: true } };
    TaskValidator: true;
    comment: { include: { user: true } };
  };
}>;
export type GenreFullPayload = Prisma.GenreGetPayload<{
  select: { Genre: true; id: true };
}>;
