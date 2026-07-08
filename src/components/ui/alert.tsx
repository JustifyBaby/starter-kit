import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertErrorProps extends ComponentProps<"div"> {
  children?: ReactNode;
  error?: unknown;
}

interface AlertZodProps extends ComponentProps<"div"> {
  error?: unknown;
}

function AlertFrame({
  children,
  className,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode;
}) {
  return (
    <div
      className={cn("text-sm text-red-600 shadow", className)}
      aria-live="polite"
      {...props}
    >
      {children}
    </div>
  );
}

function resolveErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "string" ||
    typeof error === "number" ||
    typeof error === "boolean" ||
    typeof error === "bigint"
  ) {
    return String(error);
  }

  if (typeof error === "object" && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  if (typeof error === "symbol") {
    return error.toString();
  }

  return null;
}

function collectFieldErrorMessages(error: unknown): string[] {
  if (!error) {
    return [];
  }

  if (Array.isArray(error)) {
    return error.flatMap((item) => collectFieldErrorMessages(item));
  }

  if (typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return [error.message];
    }

    const nestedMessages = Object.values(error).flatMap((value) =>
      collectFieldErrorMessages(value),
    );

    return nestedMessages;
  }

  return [];
}

export function AlertError({
  children,
  error,
  className,
  ...props
}: AlertErrorProps) {
  const content = children ?? resolveErrorMessage(error);

  if (!content) {
    return null;
  }

  return (
    <AlertFrame className={className} {...props}>
      {content}
    </AlertFrame>
  );
}

export function AlertZod({ error, className, ...props }: AlertZodProps) {
  const messages = Array.from(new Set(collectFieldErrorMessages(error)));

  if (messages.length === 0) {
    return null;
  }

  return (
    <AlertFrame className={className} {...props}>
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </AlertFrame>
  );
}

export default AlertError;
