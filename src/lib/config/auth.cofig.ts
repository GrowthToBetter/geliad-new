import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/env";
import { Gender, Role, Status } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const authConfig = {
  providers: [
    Google({
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.email,
          role: Role.SISWA,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        const role = determineUserRole(user.email);
        if (role === null) {
          return false;
        }
        if (!existingUser) {
          // Create new user with default role Pembeli and link pembeli
          const newUser = await prisma.user.create({
            data: {
              name: user.name as string,
              email: user.email,
              photo_profile:
                user.image ||
                "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png",
              role: role,
              status: Status.NOTGRADUATE,
              gender: Gender.Male,
              cover:
                "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png",
              userAuth: {
                create: {
                  last_login: new Date(),
                },
              },
            },
          });

          // Link OAuth account to the newly created user
          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state?.toString(),
            },
          });

          user.id = newUser.id; // Override NextAuth's user.id
        } else {
          // Check if this OAuth account is already linked
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state?.toString(),
              },
            });
          }

          user.id = existingUser.id;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id!;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;

function determineUserRole(email: string): Role | null {
  if (["chusniarin12@gmail.com", "dummyakun12311@gmail.com"].includes(email)) {
    return Role.ADMIN;
  }

  if (email.includes("student") && email.includes("smktelkom-mlg")) {
    return Role.SISWA;
  }

  if (email.includes("smktelkom-mlg")) {
    return Role.GURU;
  }

  if (email === "dummysiswa5@gmail.com") {
    return Role.SISWA;
  }

  // Return null if role cannot be determined
  // This will trigger access denied
  return null;
}
