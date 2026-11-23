# scripts ドキュメント

`firebase-gen.ts` を除く、`scripts` 配下のスクリプトと設定ファイルについて説明します。
コマンド例は、依存パッケージをインストールした状態で、プロジェクトルートから Bun を使って実行します。

## 一覧

| ファイル | 用途 | 実行コマンド |
| --- | --- | --- |
| [gen-component.ts](./gen-component.ts) | コンポーネント・ページとテストのひな形を生成 | `bun run genc <名前> [オプション]` |
| [z-to-type.ts](./z-to-type.ts) | Zod スキーマから型定義ファイルを生成 | `bun run gtype` |
| [path.ts](./path.ts) | プロジェクトルートのパスを共有 | 他のスクリプトから import |
| [tsconfig.json](./tsconfig.json) | スクリプト用の TypeScript 設定 | TypeScript が参照 |
| `tsconfig.tsbuildinfo` | TypeScript の増分チェック用キャッシュ | 手動編集不要 |

## gen-component.ts

名前を指定して、React コンポーネントまたは App Router のページと、Vitest 用のテストファイルを生成します。

```bash
bun run genc UserCard
# 直接実行する場合
bun scripts/gen-component.ts UserCard
```

実行すると説明文の入力を求められます。案内に従って Enter を 2 回押して入力を終了します。入力した説明はコンポーネントの `@description` コメントに挿入されます。

### 引数・オプション

| 引数・オプション | 短縮形 | 動作 |
| --- | --- | --- |
| `<名前>` | — | 必須。`UserCard` や `features/UserCard` のように指定 |
| `--props` | `-p` | 空の Props 型と、引数の型指定を追加 |
| `--route` | `-r` | `src/app` 配下に `page.tsx` と `page.test.tsx` を生成 |
| `--client` | `-c` | コンポーネントの先頭に `"use client";` を追加 |
| `--action` | `-a` | 同じディレクトリに `action.ts` を追加 |

名前には、`-` で始まらない最初の引数が使われます。名前を省略すると終了コード `1` で終了します。オプションは個別に指定してください（例: `-p -c`）。

### コンポーネントの生成

```bash
bun run genc features/user-card --props --client
```

```text
src/components/features/UserCard/
├── UserCard.tsx
└── UserCard.test.tsx
```

末尾の名前は PascalCase に変換されます。通常のコンポーネント生成では、それより前のディレクトリ名は維持されます。コンポーネントは空の `<div>` を返す default export として生成され、`--client` を指定しなければ `"use client"` は付きません。

`--props` を指定した場合、上記の例では `UserCardProps` という空の型と、`{}: UserCardProps` という引数が追加されます。

### ページの生成

```bash
bun run genc Admin/UserProfile --route --props
```

```text
src/app/admin/user-profile/
├── page.tsx
└── page.test.tsx
```

ルート生成では各ディレクトリ名が kebab-case に変換され、コンポーネント名には `Page` が付きます。上記の例では `UserProfilePage` になります。

この変換は動的セグメントの `[]` やルートグループの `()` も置換するため、それらの記法を維持したルート生成には対応していません。

実装上は `--route --client` も指定できますが、このプロジェクトでは `page.tsx` を RSC にするルールがあります。ページ生成時には `--client` を付けず、操作が必要な部分を別の Client Component に切り出してください。

### Server Action のひな形

```bash
bun run genc ContactForm --props --action
```

`ContactForm.tsx`、`ContactForm.test.tsx` に加え、`action.ts` が生成されます。Action には `"use server";` が付き、関数名は `contactFormAction`、引数は `fd: FormData` になります。

生成直後の戻り値の型は `Promise<>` で未完成です。利用前に戻り値の型と処理を実装してください。コンポーネントへの import やフォームとの接続は自動では行いません。

### 生成後の作業・既存ファイルの扱い

- テストには描画処理のみがあり、テスト名は空でアサーションもありません。生成後にテスト内容を実装してください。
- 通常の生成では、出力先ディレクトリがすでに存在するとエラーになります。
- ルート生成では、出力先の `page.tsx` が存在するとエラーになります。ディレクトリだけが存在する場合は生成できますが、既存の `page.test.tsx` や、`--action` 指定時の `action.ts` は上書きされます。
- 生成中のエラーでは終了コード `1` で終了します。途中まで生成されたファイルを取り消す処理はありません。

## z-to-type.ts

`src/types/schema` 直下のファイルを読み込み、Zod スキーマに対応する `z.infer` の型定義を `src/types` に生成します。引数・オプションの指定は不要です。

```bash
bun run gtype
# 直接実行する場合
bun scripts/z-to-type.ts
```

### 入力と出力の例

入力ファイル `src/types/schema/user.ts`:

```ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
});
```

生成される型定義の内容（整形例）`src/types/user.types.ts`:

```ts
import { z } from "zod";
import { userSchema } from "@schema/user";
export type UserType = z.infer<typeof userSchema>;
```

スキーマ名の最初の `Schema` より前の部分を取り出し、先頭を大文字にして `Type` を付けます。たとえば `userProfileSchema` は `UserProfileType` になります。同じファイル内の複数スキーマも生成対象です。

### 入力の前提と制約

- スキーマは `export const userSchema = ...` のように、名前付き export と `Schema` という接尾辞を使って定義してください。
- TypeScript の構文解析ではなく、`const` 周辺の空白と `Schema` という文字列を使って抽出しています。コメントや文字列にも反応する可能性があり、任意の書式・宣言には対応していません。
- `src/types/schema` 直下の全エントリを処理します。拡張子の絞り込みやサブディレクトリの再帰処理はないため、対象のスキーマファイルだけを配置してください。
- 出力名には入力ファイル名の最初の `.` より前が使われます。`user.ts` は `user.types.ts` になりますが、`user.extra.ts` も同じ出力名になるため、名前の衝突に注意してください。
- 出力では `@schema/<入力ファイル名から .ts を除いた名前>` を import します。スキーマ側の export とエイリアス設定が必要です。
- 既存の型定義ファイルは上書きされます。生成ファイルへの手動追記は再生成で失われます。
- 現在の実装では初期書き込みと追記を非同期で個別に開始しており、完了順序は保証されません。成功ログも書き込み完了を待たずに表示されるため、実行後は import と型定義が揃っているか確認してください。

## path.ts

`import.meta.dirname` を基準に、`scripts` の親ディレクトリを `ROOT_PATH` として export します。各生成スクリプトが出力先を組み立てるための共通モジュールです。

```ts
import { ROOT_PATH } from "./path";
```

実行時のカレントディレクトリではなく、スクリプトの配置場所からプロジェクトルートを求めます。単独で実行してもファイル生成は行いません。

## tsconfig.json / tsconfig.tsbuildinfo

`tsconfig.json` はルートの `tsconfig.json` を継承し、スクリプト向けに次の設定を指定しています。

| 設定 | 値・対象 |
| --- | --- |
| `lib` | `esnext` |
| `types` | `node` |
| `include` | `scripts` 配下の `*.ts` と `*.mts` |
| `exclude` | `../node_modules` |

スクリプト用設定で型チェックする場合は、次のコマンドを実行します。このチェックには `firebase-gen.ts` も含まれます。

```bash
bunx tsc --project scripts/tsconfig.json --noEmit
```

`tsconfig.tsbuildinfo` は TypeScript が増分チェック用に生成・更新するキャッシュです。スクリプトの設定や使い方を変更するために編集する必要はありません。
