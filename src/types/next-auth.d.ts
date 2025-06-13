import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"
import { role_user } from "@/generated/prisma"

// 1. Extend the User object returned in the session
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string
    role: role_user
  }

  interface Session {
    user: {
      id: string
      role: role_user
    } & DefaultSession["user"]
  }
}

// 2. Extend the JWT type used in callbacks
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: role_user
    tokenUpdatedAt?: number
  }
}
