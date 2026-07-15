import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, waitFor } from "storybook/test";
import { createElement, type ComponentProps } from "react";
import z from "zod";

import { ActionForm, ActionStateForm, OnSubmitForm } from "./FormBySchema";

const contactSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.email("メールアドレスを入力してください"),
  message: z.string().min(10, "お問い合わせ内容は10文字以上で入力してください"),
});

type ContactValues = z.output<typeof contactSchema>;
type ActionState = {
  success: boolean;
  message: string;
};

const labelText = {
  name: "名前",
  email: "メールアドレス",
  message: "お問い合わせ内容",
} satisfies Record<keyof ContactValues, string>;

const ContactOnSubmitForm = OnSubmitForm<typeof contactSchema>;
const ContactActionForm = ActionForm<typeof contactSchema>;
const ContactActionStateForm = ActionStateForm<typeof contactSchema, ActionState>;
type ContactOnSubmitFormProps = ComponentProps<typeof ContactOnSubmitForm>;

const submitAction = async () => undefined;

const submitActionState = async (
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> => ({
  success: true,
  message: `${formData.get("name") ?? "ゲスト"}さん、送信しました`,
});

const meta = {
  parameters: {
    layout: "centered",
  },
  tags: ["ai-generated"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const OnSubmit: Story = {
  args: {
    Schema: contactSchema,
    labelText,
    onSubmit: fn(),
    submitText: "確認する",
    variant: "panel",
    className: "w-96",
  },
  render: (args) =>
    createElement(ContactOnSubmitForm, args as ContactOnSubmitFormProps),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("名前"), "山田太郎");
    await userEvent.type(
      canvas.getByLabelText("メールアドレス"),
      "taro@example.com",
    );
    await userEvent.type(
      canvas.getByLabelText("お問い合わせ内容"),
      "Storybookからの問い合わせです",
    );
    await userEvent.click(canvas.getByRole("button", { name: "確認する" }));

    await waitFor(() =>
      expect((args as ContactOnSubmitFormProps).onSubmit).toHaveBeenCalled(),
    );
  },
};

export const ValidationError: Story = {
  args: {
    Schema: contactSchema,
    labelText,
    onSubmit: fn(),
    submitText: "確認する",
    variant: "compact",
    className: "w-80",
  },
  render: (args) =>
    createElement(ContactOnSubmitForm, args as ContactOnSubmitFormProps),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "確認する" }));

    await expect(
      await canvas.findByText("名前を入力してください"),
    ).toBeVisible();
  },
};

export const Action: Story = {
  render: () =>
    createElement(ContactActionForm, {
      Schema: contactSchema,
      labelText,
      action: submitAction,
      submitText: "送信",
      variant: "default",
      className: "w-80",
    }),
};

export const ActionState: Story = {
  render: () =>
    createElement(ContactActionStateForm, {
      Schema: contactSchema,
      labelText,
      action: submitActionState,
      initialState: {
        success: false,
        message: "未送信です",
      },
      submitText: "保存する",
      pendingText: "保存中...",
      variant: "elevated",
      className: "w-96",
      resetOnSuccess: true,
      renderState: (state: ActionState) =>
        createElement(
          "p",
          {
            className: state.success ? "text-sm text-green-600" : "text-sm",
            role: "status",
          },
          state.message,
        ),
    }),
};

export const CssCheck: Story = {
  render: () =>
    createElement(ContactActionStateForm, {
      Schema: contactSchema,
      labelText,
      action: submitActionState,
      initialState: {
        success: false,
        message: "未送信です",
      },
      submitText: "スタイル確認",
      variant: "elevated",
      className: "w-96",
    }),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "スタイル確認" });

    await expect(getComputedStyle(button).height).toBe("40px");
  },
};
