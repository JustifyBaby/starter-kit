"use client";

/**
@description:
  BlogForm (schema is following BlogFormSchema)
 */

import { BlogFormSchema } from "@schema/BlogSchema";
import { BlogFormType } from "@/types/BlogSchema.types";
import { blogAction } from "./action";
import {
  ActionFormBySchema,
  OnSubmitFormBySchema,
} from "@/stories/FormBySchema";

export default function BlogForm() {
  const handleSubmit = (data: BlogFormType) => {
    console.log(data);
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center pt-6">
        <p>Action</p>
        <ActionFormBySchema
          Schema={BlogFormSchema}
          labelText={{ title: "タイトル", body: "本文" }}
          action={blogAction}
          fieldEachProps={{
            title: {
              labelProps: {
                className: "",
              },
            },
          }}
          className="mx-auto w-full max-w-md"
        />
      </div>
      <div className="flex flex-col justify-center items-center py-8">
        <p>OnSubmit</p>
        <OnSubmitFormBySchema
          Schema={BlogFormSchema}
          labelText={{ title: "タイトル", body: "本文" }}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md"
        />
      </div>
    </div>
  );
}
