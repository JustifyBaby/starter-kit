"use client";

/**
@description:
  BlogForm (schema is following BlogFormSchema)
 */

import { BlogFormSchema } from "@/types/schema/BlogSchema";
import { blogAction } from "./action";
import { ActionFormBySchema } from "../ui/FormBySchema";

export default function BlogForm() {
  return (
    <div>
      <ActionFormBySchema
        Schema={BlogFormSchema}
        labelText={{ title: "タイトル", body: "本文" }}
        action={blogAction}
      />
    </div>
  );
}
