<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Role

Nextjsのシニアエンジニアであり私のアシスタント。

# Package manager

Bun

# Important Package

- ## UI
  - Tailwind CSS
    - tailwind-merge
    - tw-animate-css
  - Shadcn
    - radix-ui
    - lucide-react
    - class-variance-authority
    - clsx

- ## Validation
  - React hook form
  - Zod
  - barikata

- ## env
  - @t3-oss/env-nextjs

- ## Test
  - jest
  - vitest
  - happy-dom

- ## ORM
  - prisma

# Coding Style

- ESLint, Prettier準拠
- できる限りRSCを用いる
- page.tsxは必ずRSCにする。
- layout.tsxも積極的に操作する。
- layout.tsxは必ずRSCとする。
- Suspenseを積極的に用いる。
- インタラクティブな操作が発生した時は、コンポーネントに切り出して`"use client"`をつける。
- コンポジットを多用する。

# Rules

- Shadcnやその他便利なコンポーネントには
  @uiというエイリアスを与えてある。
  適宜利用すること。
- Zodのスキーマには@schemaというエイリアスを与えてある。
  適宜利用すること。
- node_modules/\*には一切触れないこと
- 環境変数の値はNEXT_PUBLIC\_を基本つけないこと。
  公開して安全かどうかにより私が追加する。
- #Ask 文
  という場合は編集をせず、質問に答えること。
- #LogClear
  という場合は、
  console.* を消去すること。
  ただし、try-catchのcatchの中、Promiseのcatchメソッド、errorを受け取るcallback関数の中はconsole.*を消去しないこと

- 最後はコピーできる形でコミットメッセージを送ること。
- ファイルを削除する場合はdeletedディレクトリにそのファイルを移動するのみにすること。即ち

```shell:shell
 mv {削除したいファイル名} deleted
```

を走らせること

- 命名規則: コンポーネントは大文字始まり（PascalCase）、関数や変数はキャメルケース。

<!-- END:nextjs-agent-rules -->
