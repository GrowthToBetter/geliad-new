import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Read and parse the JSON data file
    const raw = await fs.readFile("data.json", "utf-8");
    const data = JSON.parse(raw);

    // Seed Users
    if (data.user && Array.isArray(data.user)) {
      console.log("👥 Seeding users...");
      for (const user of data.user) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: user,
        });
      }
      console.log(`✅ Seeded ${data.user.length} users`);
    }

    // Seed Genres
    if (data.genre && Array.isArray(data.genre)) {
      console.log("🎭 Seeding genres...");
      for (const genre of data.genre) {
        await prisma.genre.upsert({
          where: { id: genre.id },
          update: {},
          create: genre,
        });
      }
      console.log(`✅ Seeded ${data.genre.length} genres`);
    }

    // Seed UserAuth
    if (data.userAuth && Array.isArray(data.userAuth)) {
      console.log("🔐 Seeding user authentications...");
      for (const ua of data.userAuth) {
        await prisma.userAuth.upsert({
          where: { id: ua.id },
          update: {},
          create: ua,
        });
      }
      console.log(`✅ Seeded ${data.userAuth.length} userAuths`);
    }

    // Seed FileWork
    if (data.fileWork && Array.isArray(data.fileWork)) {
      console.log("📄 Seeding file works...");
      for (const fw of data.fileWork) {
        // Ekstraksi permisionId dari fw.path jika null
        let permisionId = fw.permisionId;

        if (!permisionId && fw.path) {
          try {
            if (fw.path.includes("drive.google.com")) {
              // Google Drive format: /file/d/<ID>/
              const match = fw.path.match(/\/file\/d\/([^/]+)/);
              if (match) {
                permisionId = match[1];
              }
            } else if (fw.path.includes("1drv.ms")) {
              // OneDrive shortlink format: /s!<ID>
              const match = fw.path.match(/\/s!([^?]+)/);
              if (match) {
                permisionId = match[1];
              }
            }
          } catch {
            console.warn(`⚠️ Gagal ekstrak permisionId dari path: ${fw.path}`);
          }
        }

        await prisma.fileWork.upsert({
          where: { id: fw.id },
          update: {},
          create: {
            ...fw,
            permisionId: permisionId ?? null,
          },
        });
      }
      console.log(`✅ Seeded ${data.fileWork.length} fileWorks`);
    }

    // Seed Comments
    if (data.comment && Array.isArray(data.comment)) {
      console.log("💬 Seeding comments...");
      for (const comment of data.comment) {
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: {},
          create: comment,
        });
      }
      console.log(`✅ Seeded ${data.comment.length} comments`);
    }

    // 🆕 Seed NextAuth Accounts
    if (data.account && Array.isArray(data.account)) {
      console.log("🔗 Seeding OAuth accounts...");
      for (const account of data.account) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: account,
        });
      }
      console.log(`✅ Seeded ${data.account.length} accounts`);
    }

    // 🆕 Seed NextAuth Sessions
    if (data.session && Array.isArray(data.session)) {
      console.log("🎫 Seeding sessions...");
      for (const session of data.session) {
        await prisma.session.upsert({
          where: { id: session.id },
          update: {},
          create: session,
        });
      }
      console.log(`✅ Seeded ${data.session.length} sessions`);
    }

    // 🆕 Seed NextAuth Verification Tokens
    if (data.verificationToken && Array.isArray(data.verificationToken)) {
      console.log("🔑 Seeding verification tokens...");
      for (const vt of data.verificationToken) {
        await prisma.verificationToken.upsert({
          where: {
            identifier_token: {
              identifier: vt.identifier,
              token: vt.token,
            },
          },
          update: {},
          create: vt,
        });
      }
      console.log(
        `✅ Seeded ${data.verificationToken.length} verificationTokens`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("💥 Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seed()
  .then(() => {
    console.log("✨ Seeding process finished successfully");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seeder failed:", e);
    console.error("📍 Error details:", e.message);
    if (e.code) {
      console.error("🔍 Error code:", e.code);
    }
    prisma.$disconnect();
    process.exit(1);
  });
