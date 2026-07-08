import { ComponentProps } from "react";

export type Action = Exclude<ComponentProps<"form">["action"], string>;
