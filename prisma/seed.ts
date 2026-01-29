import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// SQLiteアダプターを作成（.envと同じパスを使用）
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'
});

// アダプターを渡してPrismaClientを初期化
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Ritsu', balance: 100000 },
      { name: 'Mina', balance: 500000 },
      { name: 'Nori', balance: 5606568 },
      { name: 'Takumi', balance: 57254225 },
      { name: 'Taishi', balance: 453677 },
      { name: 'Kei', balance: 7892441 },
    ],
  });
  console.log('✅ Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
