# Mock Pay - Database Design

> **DB**: SQLite + Prisma
> **最終更新**: 2026-01-30

---

## 1. データベース概要

### 設計方針

- **シンプル第一**: 3日間で実装できる最小構成
- **型安全性**: TypeScriptとPrismaで厳密な型定義
- **拡張性**: 将来的にPostgreSQLへの移行を考慮

### テーブル構成

```
Users (ユーザー)
  │
  ├─ 1:N ─→ Transactions (送金者として)
  │
  └─ 1:N ─→ Transactions (受取人として)
```

---

## 2. テーブル設計

### 📊 Users（ユーザー）

ダミーユーザーと自分のアカウント情報を管理

| カラム名  | 型       | 制約                    | 説明             |
| --------- | -------- | ----------------------- | ---------------- |
| id        | Int      | PK, AUTO INCREMENT      | ユーザーID       |
| name      | String   | NOT NULL                | ユーザー名       |
| balance   | Int      | NOT NULL, DEFAULT 10000 | 残高（単位: 円） |
| createdAt | DateTime | NOT NULL, DEFAULT now() | 作成日時         |

**インデックス**

- PRIMARY KEY: `id`

**初期データ**

```typescript
// 自分のアカウント
{ id: 1, name: "自分", balance: 10000 }

// ダミーユーザー（送金先）
{ id: 2, name: "田中太郎", balance: 5000 }
{ id: 3, name: "佐藤花子", balance: 8000 }
{ id: 4, name: "鈴木一郎", balance: 3000 }
```

---

### 📝 Transactions（送金履歴）

送金の履歴を記録

| カラム名   | 型       | 制約                    | 説明                 |
| ---------- | -------- | ----------------------- | -------------------- |
| id         | Int      | PK, AUTO INCREMENT      | 取引ID               |
| senderId   | Int      | FK → Users.id, NOT NULL | 送金者ID             |
| receiverId | Int      | FK → Users.id, NOT NULL | 受取人ID             |
| amount     | Int      | NOT NULL, CHECK > 0     | 送金金額（単位: 円） |
| createdAt  | DateTime | NOT NULL, DEFAULT now() | 送金日時             |

**インデックス**

- PRIMARY KEY: `id`
- INDEX: `senderId` （送金者の履歴検索用）

**リレーション**

- `sender`: Users (senderId → Users.id)
- `receiver`: Users (receiverId → Users.id)

---

## 3. Prisma スキーマ

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  balance   Int      @default(10000)
  createdAt DateTime @default(now())

  // リレーション
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

  // リレーション
  sender   User @relation("Sender", fields: [senderId], references: [id])
  receiver User @relation("Receiver", fields: [receiverId], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([senderId])
  @@map("transactions")
}
```

---

## 4. データフロー

### 送金処理のトランザクション

```typescript
// 送金処理の疑似コード
async function transfer(senderId: number, receiverId: number, amount: number) {
  // 1. 送金者の残高確認
  const sender = await prisma.user.findUnique({ where: { id: senderId } });
  if (!sender || sender.balance < amount) {
    throw new Error('残高不足');
  }

  // 2. トランザクション開始
  const result = await prisma.$transaction([
    // 送金者の残高を減らす
    prisma.user.update({
      where: { id: senderId },
      data: { balance: { decrement: amount } },
    }),

    // 受取人の残高を増やす
    prisma.user.update({
      where: { id: receiverId },
      data: { balance: { increment: amount } },
    }),

    // 送金履歴を記録
    prisma.transaction.create({
      data: {
        senderId,
        receiverId,
        amount,
      },
    }),
  ]);

  return result[2]; // 作成されたTransactionを返す
}
```

---

## 5. API エンドポイント設計

### GET `/api/users/:id`

**説明**: ユーザー情報と残高を取得

**レスポンス**

```json
{
  "id": 1,
  "name": "自分",
  "balance": 10000
}
```

---

### GET `/api/users`

**説明**: 全ユーザー一覧を取得（送金先選択用）

**レスポンス**

```json
[
  { "id": 2, "name": "田中太郎" },
  { "id": 3, "name": "佐藤花子" },
  { "id": 4, "name": "鈴木一郎" }
]
```

---

### POST `/api/transfer`

**説明**: 送金を実行

**リクエストボディ**

```json
{
  "senderId": 1,
  "receiverId": 2,
  "amount": 1000
}
```

**レスポンス（成功）**

```json
{
  "success": true,
  "transaction": {
    "id": 1,
    "amount": 1000,
    "receiver": { "name": "田中太郎" },
    "newBalance": 9000,
    "createdAt": "2026-01-30T12:00:00Z"
  }
}
```

**レスポンス（失敗）**

```json
{
  "success": false,
  "error": "残高不足"
}
```

---

### GET `/api/transactions?userId=1`

**説明**: 送金履歴を取得

**レスポンス**

```json
[
  {
    "id": 1,
    "receiver": { "name": "田中太郎" },
    "amount": 1000,
    "createdAt": "2026-01-30T12:00:00Z"
  },
  {
    "id": 2,
    "receiver": { "name": "佐藤花子" },
    "amount": 500,
    "createdAt": "2026-01-29T15:30:00Z"
  }
]
```

---

## 6. セットアップ手順

### 1. Prismaのインストール

```bash
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
```

### 2. 環境変数の設定

```env
# .env
DATABASE_URL="file:./dev.db"
```

### 3. マイグレーション実行

```bash
npx prisma migrate dev --name init
```

### 4. シードデータの投入

```bash
npx prisma db seed
```

### 5. Prisma Clientの生成

```bash
npx prisma generate
```

---

## 7. 注意事項

### セキュリティ

⚠️ **本番環境では以下が必要**（MVPでは省略）

- パスワード認証
- JWT/セッション管理
- CSRF対策
- レート制限
- 金額の暗号化

### データ整合性

✅ **実装済み**

- トランザクション処理で残高の整合性を保証
- 残高不足チェック
- 送金金額の正の整数チェック

❌ **未実装（MVPでは不要、将来の課題）**

- 送金ステータス管理（completed/failed/pending）
- 同時送金のロック制御
- 送金のキャンセル機能
- 送金上限額の設定

---

## 8. 今後の拡張案

### Phase 2: 機能拡張

- 送金ステータス管理（`status`フィールド追加）
- 受取履歴の表示（`receivedTransactions`リレーション活用）
- チャージ機能の追加
- 送金メモの追加
- ユーザー情報更新機能（`updatedAt`フィールド追加）

### Phase 3: PostgreSQL移行

- Supabaseへの移行
- UUIDへの変更（セキュリティ向上）
- リアルタイム同期
- マルチユーザー対応

### Phase 4: 本番環境対応

- 認証機能の実装
- 監査ログの追加
- バックアップ機能
