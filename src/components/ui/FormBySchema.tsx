"use client";
/**
  @共通props :
    Schema : Zodで定義したスキーマ
    labelText : フォームのラベルとinputのname属性に対応
  @description :
      Zodのスキーマを引数にとり、useFormとスキーマからバリデーション。
      labelTextというpropsをオブジェクトで渡すと、
    フォームのラベルとそのTextが対応。
      FormActionBySchemaではServerActionの関数
      FormOnSubmitBySchemaではuseFormのhandleSubmitの中に入れる関数を代入します。
  
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
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { AlertZod } from "./alert";
import { Action } from "@/types/global/FormAction";

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

interface FormActionBySchemaProps<ZS> extends FormBySchemaProps<ZS> {
  action: Action;
}

interface FormOnsubmitBySchemaProps<
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

export function ActionFormBySchema<ZS extends FormSchema>({
  Schema,
  labelText,
  action,
  variant,
  className,
  submitText,
}: FormActionBySchemaProps<ZS>) {
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
export function OnSubmitFormBySchema<ZS extends FormSchema>({
  Schema,
  labelText,
  onSubmit,
  variant,
  className,
  submitText,
}: FormOnsubmitBySchemaProps<ZS>) {
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

export { formVariants };
