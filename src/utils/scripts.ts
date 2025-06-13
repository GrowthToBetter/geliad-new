/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

// run tsc src/utils/scripts.ts
// node src/utils/scripts.js

async function exportData() {
  const data: Record<string, any> = {};

  // List your models as defined in schema.prisma (case-sensitive)
  const models = [
    'user',
    'fileWork',
    'comment',
    'genre',
    'userAuth',
  ];

  for (const model of models) {
    try {
      const rows = await (prisma as any)[model].findMany({
        include: {}, // you can include relations if needed
      });
      data[model] = rows;
    } catch (error) {
      console.error(`❌ Error exporting model ${model}:`, (error as Error).message);
    }
  }

  await fs.writeFile('data.json', JSON.stringify(data, null, 2));
  console.log('✅ Exported MySQL data to data.json');

  await prisma.$disconnect();
}

exportData();
