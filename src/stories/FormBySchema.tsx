"use client";
/**
  @共通props :
    Schema : Zodで定義したスキーマ
    labelText : フォームのラベルとinputのname属性に対応
  @description :
      Zodのスキーマを引数にとり、useFormとスキーマからバリデーション。
      labelTextというpropsをオブジェクトで渡すと、
    フォームのラベルとそのTextが対応。
      FormActionではServerActionの関数
      FormOnSubmitではuseFormのhandleSubmitの中に入れる関数を代入します。
  
  @notice :
    "use client"必須
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { cva, type VariantProps } from "class-variance-authority";
import {
  FieldErrors,
  type FieldValues,
  type Path,
  SubmitHandler,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertZod } from "@/stories/Alert";
import { Action } from "@/types/global/FormAction";
import { type ReactNode, useActionState, useEffect, useRef } from "react";

const formVariants = cva("grid", {
  variants: {
    variant: {
      default: "gap-5",
      compact: "gap-3",
      panel:
        "gap-5 rounded-lg border border-border/80 bg-card p-5 shadow-sm shadow-foreground/5",
      elevated:
        "gap-5 rounded-lg border border-border/70 bg-card p-6 shadow-xl shadow-foreground/10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const formFieldVariants = cva("grid", {
  variants: {
    variant: {
      default: "gap-2",
      compact: "gap-1.5",
      panel: "gap-2",
      elevated: "gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const formLabelVariants = cva("text-muted-foreground transition-colors", {
  variants: {
    variant: {
      default: "",
      compact: "text-xs",
      panel: "text-xs font-semibold tracking-wide text-foreground/80",
      elevated: "text-xs font-semibold tracking-wide text-foreground/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const formInputVariants = cva("", {
  variants: {
    variant: {
      default: "",
      compact: "h-7 text-sm",
      panel:
        "border-border/70 bg-muted/20 shadow-inner shadow-foreground/[0.03] focus-visible:bg-background",
      elevated:
        "border-border/70 bg-muted/20 shadow-inner shadow-foreground/[0.03] focus-visible:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const actionStateSubmitButtonVariants = cva(
  "mt-1 h-10 w-full rounded-lg text-sm font-semibold shadow-sm shadow-foreground/10 transition-transform hover:-translate-y-0.5 disabled:translate-y-0",
  {
    variants: {
      variant: {
        default: "",
        compact: "h-8 text-xs",
        panel: "shadow-md shadow-foreground/10",
        elevated: "shadow-lg shadow-foreground/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type FormSchema = z.ZodObject;
type FormShape<ZS> = ZS extends z.ZodObject<infer Shape> ? Shape : never;
type FormLabelText<ZS> = {
  [K in Extract<keyof FormShape<ZS>, string>]: string;
};

interface FormBySchemaProps<ZS> extends VariantProps<typeof formVariants> {
  Schema: ZS;
  labelText: FormLabelText<ZS>;
  submitText?: string;
  className?: string;
}

interface FormActionProps<ZS> extends FormBySchemaProps<ZS> {
  action: Action;
}

interface FormOnsubmitProps<
  ZS extends FormSchema,
> extends FormBySchemaProps<ZS> {
  onSubmit: SubmitHandler<z.output<ZS>>;
}

interface FormFieldsProps<
  TInput extends FieldValues,
  TOutput,
> extends VariantProps<typeof formFieldVariants> {
  labelText: FormLabelText<TOutput>;
  register: UseFormRegister<TInput>;
  errors?: FieldErrors<TInput>;
}

type ActionStateHandler<TState> = (
  previousState: TState,
  formData: FormData,
) => TState | Promise<TState>;

type ResetOnSuccess<TState> = boolean | ((state: TState) => boolean);

interface FormActionStateProps<
  ZS extends FormSchema,
  TState extends object,
> extends FormBySchemaProps<ZS> {
  action: ActionStateHandler<TState>;
  initialState: TState;
  pendingText?: string;
  renderState?: (state: TState) => ReactNode;
  resetOnSuccess?: ResetOnSuccess<TState>;
}

function isSuccessfulActionState<TState>(state: TState) {
  if (typeof state !== "object" || state === null) {
    return false;
  }

  return (
    ("ok" in state && state.ok === true) ||
    ("success" in state && state.success === true)
  );
}

function shouldResetActionState<TState>(
  state: TState,
  resetOnSuccess: ResetOnSuccess<TState> | undefined,
) {
  if (typeof resetOnSuccess === "function") {
    return resetOnSuccess(state);
  }

  return resetOnSuccess === true && isSuccessfulActionState(state);
}

function FormFields<TInput extends FieldValues, TOutput>({
  labelText,
  register,
  variant,
  errors,
}: FormFieldsProps<TInput, TOutput>) {
  return (Object.entries(labelText) as Array<[Path<TInput>, string]>).map(
    ([name, label]) => (
      <div key={name} className={cn(formFieldVariants({ variant }))}>
        <Label htmlFor={name} className={cn(formLabelVariants({ variant }))}>
          {label}
        </Label>
        <Input
          id={name}
          className={cn(formInputVariants({ variant }))}
          {...register(name)}
        />
        <AlertZod error={errors?.[name]} />
      </div>
    ),
  );
}

export function ActionForm<ZS extends FormSchema>({
  Schema,
  labelText,
  action,
  variant,
  className,
  submitText,
}: FormActionProps<ZS>) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.input<ZS>, unknown, z.output<ZS>>({
    resolver: zodResolver(Schema),
  });

  return (
    <form action={action} className={cn(formVariants({ variant, className }))}>
      <FormFields
        labelText={labelText}
        register={register}
        variant={variant}
        errors={errors}
      />
      <Button
        type="submit"
        className="text-xl px-4 py-2"
        disabled={isSubmitting}
      >
        {submitText ?? "送信"}
      </Button>
    </form>
  );
}
export function OnSubmitForm<ZS extends FormSchema>({
  Schema,
  labelText,
  onSubmit,
  variant,
  className,
  submitText,
}: FormOnsubmitProps<ZS>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<ZS>, unknown, z.output<ZS>>({
    resolver: zodResolver(Schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
      className={cn(formVariants({ variant, className }))}
    >
      <FormFields
        labelText={labelText}
        register={register}
        variant={variant}
        errors={errors}
      />
      <Button
        type="submit"
        className="text-shadow-white px-8 py-4"
        disabled={isSubmitting}
      >
        {submitText ?? "送信"}
      </Button>
    </form>
  );
}

export function ActionStateForm<ZS extends FormSchema, TState extends object>({
  action,
  initialState,
  Schema,
  labelText,
  submitText,
  pendingText,
  className,
  variant,
  renderState,
  resetOnSuccess,
}: FormActionStateProps<ZS, TState>) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialStateRef = useRef(initialState);
  const [state, formAction, isPending] = useActionState<TState, FormData>(
    action,
    initialState as Awaited<TState>,
  );
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<ZS>, unknown, z.output<ZS>>({
    resolver: zodResolver(Schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (Object.is(state, initialStateRef.current)) {
      return;
    }

    if (shouldResetActionState(state, resetOnSuccess)) {
      reset();
      formRef.current?.reset();
    }
  }, [reset, resetOnSuccess, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn(formVariants({ variant, className }))}
    >
      <FormFields
        labelText={labelText}
        errors={errors}
        register={register}
        variant={variant}
      />
      {renderState?.(state)}

      <Button
        type="submit"
        className={cn(actionStateSubmitButtonVariants({ variant }))}
        disabled={isSubmitting || isPending}
      >
        {isPending ? (pendingText ?? "送信中...") : (submitText ?? "送信")}
      </Button>
    </form>
  );
}

export {
  ActionForm as ActionFormBySchema,
  formVariants,
  OnSubmitForm as OnSubmitFormBySchema,
};
