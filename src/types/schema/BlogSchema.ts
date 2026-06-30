import z from "zod";

const RANGE_ERROR = `タイトルは1～255文字で、内容は1文字以上で必須です。`;
export const BlogFormSchema = z.object({
  title: z
    .string()
    .min(1, { error: RANGE_ERROR })
    .max(255, { error: RANGE_ERROR }),
  body: z.string().min(1, { error: RANGE_ERROR }),
});

export const BlogSchema = BlogFormSchema.extend({
  id: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
});
