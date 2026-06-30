import { z } from "zod"
import { BlogFormSchema, BlogSchema } from "@schema/BlogSchema"
export type BlogForm = z.infer<typeof BlogFormSchema>
export type Blog = z.infer<typeof BlogSchema>