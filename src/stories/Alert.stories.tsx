import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertError, AlertZod } from "./Alert";
const meta: Meta = {
  title: "Components/Alerts",
  parameters: {
    layout: "centered",
  },
};

export default meta;

/* ==========================================================================
   1. AlertError のストーリー
   ========================================================================== */
type AlertErrorStory = StoryObj<typeof AlertError>;

export const ErrorInstance: AlertErrorStory = {
  render: (args) => <AlertError {...args} />,
  args: {
    error: new Error(
      "サーバーとの通信に失敗しました。時間をおいて再度お試しください。",
    ),
  },
};

export const StringMessage: AlertErrorStory = {
  render: (args) => <AlertError {...args} />,
  args: {
    error: "パスワードが間違っています。",
  },
};

export const ObjectJsonMessage: AlertErrorStory = {
  render: (args) => <AlertError {...args} />,
  args: {
    error: { code: "AUTH_001", status: 401, detail: "Unauthorized access" },
  },
};

export const CustomChildren: AlertErrorStory = {
  render: (args) => <AlertError {...args} />,
  args: {
    children: (
      <div className="flex items-center gap-2 font-bold">
        <span>⚠️</span>
        <span>独自の子要素（Children）を優先して表示しています</span>
      </div>
    ),
  },
};

/* ==========================================================================
   2. AlertZod のストーリー
   ========================================================================== */
type AlertZodStory = StoryObj<typeof AlertZod>;

// Zod や React Hook Form のバリデーションエラーを模したモックデータ
const mockZodErrors = {
  username: {
    message: "ユーザー名は3文字以上で入力してください。",
  },
  email: {
    message: "有効なメールアドレスの形式で入力してください。",
  },
  password: {
    nested: {
      message: "パスワードには英数字を含めてください。",
    },
  },
};

// 重複したエラーメッセージがユニーク（Set）に処理されるかの検証用
const mockDuplicateErrors = [
  { message: "必須項目です。" },
  { message: "必須項目です。" },
  { info: { message: "必須項目です。" } },
];

export const ZodFieldErrors: AlertZodStory = {
  render: (args) => <AlertZod {...args} />,
  args: {
    error: mockZodErrors,
  },
};

export const ZodDuplicateFilter: AlertZodStory = {
  render: (args) => <AlertZod {...args} />,
  args: {
    error: mockDuplicateErrors,
  },
};
