import { z } from "zod";
import { BlogFormSchema, blogSchema } from "@schema/BlogSchema";
export type BlogFormType = z.infer<typeof BlogFormSchema>;
export type BlogType = z.infer<typeof blogSchema>;
