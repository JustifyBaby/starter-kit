"use client";

/**
@description:
  BlogForm (schema is following BlogFormSchema)
 */

import { BlogFormSchema } from "@schema/BlogSchema";
import { blogAction } from "./action";
import {
  ActionFormBySchema,
  OnSubmitFormBySchema,
} from "@/stories/FormBySchema";

export default function BlogForm() {
  return (
    <div>
      <div>
        <p>Action</p>
        <ActionFormBySchema
          Schema={BlogFormSchema}
          labelText={{ title: "タイトル", body: "本文" }}
          action={blogAction}
          className="mx-auto w-full max-w-md"
        />
      </div>
      <div className="flex flex-col justify-center items-center pt-8">
        <p>OnSubmit</p>
        <OnSubmitFormBySchema
          Schema={BlogFormSchema}
          labelText={{ title: "タイトル", body: "本文" }}
          onSubmit={(data) => {
            console.log(data);
          }}
          className="mx-auto w-full max-w-md"
        />
      </div>
    </div>
  );
}
