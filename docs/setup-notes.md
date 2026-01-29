# Mock Pay - セットアップログ & トラブルシューティング

> **作成日**: 2026-01-30
> **目的**: 開発環境構築時に遭遇した問題と解決策を記録し、同じミスを防ぐ

---

## 📚 目次

1. [Prisma 7 セットアップで遭遇した問題](#prisma-7-セットアップで遭遇した問題)
2. [問題の詳細と解決策](#問題の詳細と解決策)
3. [正しいセットアップ手順](#正しいセットアップ手順)
4. [重要なポイント](#重要なポイント)

---

## Prisma 7 セットアップで遭遇した問題

### 🚨 発生した問題の流れ

1. **エラー1**: `@prisma/client did not initialize yet`
2. **エラー2**: `PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`
3. **エラー3**: `Cannot read properties of undefined (reading 'replace')`
4. **エラー4**: データベースファイルが2箇所に作成される問題

---

## 問題の詳細と解決策

### 問題1: カスタム出力先のインポートパスエラー

#### ❌ エラー内容

```
Error: @prisma/client did not initialize yet.
Please run "prisma generate" and try to import it again.
```

#### 🔍 原因

`prisma/schema.prisma`でカスタム出力先を指定していたが、デフォルトのパスからインポートしようとした。

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"  // カスタムパス指定
}
```

#### ✅ 解決策

カスタム出力先を指定した場合は、インポートパスも合わせる必要がある。

```typescript
// ❌ 間違い
import { PrismaClient } from '@prisma/client'

// ✅ 正解
import { PrismaClient } from '../src/generated/prisma'
```

#### 📝 教訓

- **Prisma 7では`output`フィールドが必須**になった
- カスタムパスを指定したら、すべてのインポート文を修正する必要がある
- デフォルトの`node_modules/@prisma/client`には生成されなくなった

---

### 問題2: Prisma 7のドライバーアダプター必須化

#### ❌ エラー内容

```
PrismaClientInitializationError: `PrismaClient` needs to be constructed
with a non-empty, valid `PrismaClientOptions`
```

#### 🔍 原因

**Prisma 7の破壊的変更**: すべてのデータベース（SQLite含む）でドライバーアダプターが必須になった。

#### ✅ 解決策

必要なパッケージをインストールし、アダプターを使用する。

```bash
npm install @prisma/adapter-better-sqlite3 better-sqlite3
npm install -D @types/better-sqlite3
```

```typescript
// ❌ Prisma 6までの書き方
const prisma = new PrismaClient()

// ✅ Prisma 7の書き方
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'
})
const prisma = new PrismaClient({ adapter })
```

#### 📝 教訓

- Prisma 7では`new PrismaClient()`だけでは初期化できない
- **全データベースでアダプター必須**（PostgreSQL、MySQL、SQLiteすべて）
- `new PrismaClient({ datasourceUrl: ... })`は廃止された

---

### 問題3: アダプターの引数形式エラー

#### ❌ エラー内容

```
TypeError: Cannot read properties of undefined (reading 'replace')
    at createBetterSQLite3Client
```

#### 🔍 原因

`PrismaBetterSqlite3`に間違った形式の引数を渡していた。

```typescript
// ❌ 間違い（Databaseインスタンスを渡す）
import Database from 'better-sqlite3'
const db = new Database('./prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
```

内部で`.url`プロパティの`.replace()`メソッドを呼ぼうとして、`undefined`エラーが発生。

#### ✅ 解決策

URLオブジェクトを渡す。

```typescript
// ✅ 正解（URLオブジェクトを渡す）
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'
})
```

#### 📝 教訓

- ライブラリのAPIドキュメントを正確に確認する
- `better-sqlite3`の`Database`インスタンスは**不要**
- アダプターが内部でデータベース接続を管理してくれる

---

### 問題4: データベースファイルが2箇所に作成される

#### 🚨 問題の状況

```
./dev.db          ← マイグレーション用
./prisma/dev.db   ← シーディング用
```

マイグレーションとシーディングが**別々のデータベース**を使用していた！

#### 🔍 原因

設定ファイル間でパスが統一されていなかった。

| ファイル | 設定 | 使用するDB |
|----------|------|-----------|
| `.env` | `DATABASE_URL="file:./dev.db"` | `./dev.db` |
| `seed.ts` | `url: 'file:./prisma/dev.db'` | `./prisma/dev.db` ❌ |

#### ✅ 解決策

**Prismaの公式ベストプラクティス**: データベースファイルは`prisma/`ディレクトリ内に配置する。

```bash
# .env
DATABASE_URL="file:./prisma/dev.db"
```

```typescript
// seed.ts
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'  // .envと同じパス
})
```

#### 📝 教訓

- **SQLiteファイルは`prisma/`ディレクトリ内に配置**することが推奨
- スキーマ、マイグレーション、データベースファイルを1箇所に集約
- `.env`、`prisma.config.ts`、`seed.ts`のパスを統一する
- 相対パスの起点に注意（プロジェクトルートから）

---

## 正しいセットアップ手順

### 1. Prismaの初期化

```bash
npm install prisma @prisma/client @prisma/adapter-better-sqlite3 better-sqlite3
npm install -D @types/better-sqlite3 tsx
```

### 2. 環境変数の設定（`.env`）

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 3. スキーマの作成（`prisma/schema.prisma`）

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
  // Prisma 7では url は prisma.config.ts で管理
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  balance   Int      @default(10000)
  createdAt DateTime @default(now())

  sentTransactions     Transaction[] @relation("Sender")
  receivedTransactions Transaction[] @relation("Receiver")

  @@map("users")
}

model Transaction {
  id         Int      @id @default(autoincrement())
  senderId   Int
  receiverId Int
  amount     Int
  createdAt  DateTime @default(now())

  sender   User @relation("Sender", fields: [senderId], references: [id])
  receiver User @relation("Receiver", fields: [receiverId], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([senderId])
  @@map("transactions")
}
```

### 4. Prisma設定ファイル（`prisma.config.ts`）

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"  // シードコマンド
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### 5. シードファイルの作成（`prisma/seed.ts`）

```typescript
import { PrismaClient } from '../src/generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// アダプターを作成（.envと同じパス）
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db'
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Ritsu', balance: 100000 },
      { name: 'Mina', balance: 500000 },
      // ... 他のユーザー
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
```

### 6. マイグレーションとシーディング

```bash
# マイグレーション実行
npx prisma migrate dev --name init

# Prisma Clientの生成
npx prisma generate

# シーディング実行
npx prisma db seed

# データ確認
npx prisma studio
```

---

## 重要なポイント

### ✅ チェックリスト

- [ ] カスタム出力先（`output`）を指定した場合、インポートパスを修正
- [ ] Prisma 7ではアダプターが必須（`new PrismaClient({ adapter })`）
- [ ] SQLiteファイルは`prisma/`ディレクトリ内に配置
- [ ] `.env`、`prisma.config.ts`、`seed.ts`のパスを統一
- [ ] `PrismaBetterSqlite3`には`{ url: "..." }`オブジェクトを渡す
- [ ] シードコマンドは`prisma.config.ts`の`migrations.seed`に記載

### 📚 参考資料

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [SQLite Connector Documentation](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [Seeding Documentation](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)
- [@prisma/adapter-better-sqlite3 - npm](https://www.npmjs.com/package/@prisma/adapter-better-sqlite3)

### 🎯 次回開発時の注意事項

1. **Prisma 7の変更点を理解する**
   - アダプター必須化
   - `output`フィールド必須化
   - `url`は`prisma.config.ts`で管理

2. **ファイル構成を統一する**
   - データベース関連ファイルは`prisma/`に集約
   - パスの不一致に注意

3. **ドキュメントを確認する**
   - 公式ドキュメントの最新バージョンを参照
   - バージョン間の破壊的変更に注意

4. **エラーメッセージを丁寧に読む**
   - エラーメッセージには解決のヒントが含まれている
   - スタックトレースから問題箇所を特定

---

## まとめ

Prisma 7への移行では、従来の初期化方法が大きく変更されました。特に：

1. **アダプターが全データベースで必須**になった
2. **カスタム出力先が推奨**され、インポートパスの管理が重要に
3. **SQLiteファイルの配置場所**は`prisma/`ディレクトリが推奨
4. **設定ファイル間のパス統一**が重要

これらのポイントを押さえれば、スムーズにセットアップできます。
