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
    <div className="flex flex-col justify-center items-center">
      <div className="w-2xl flex-col justify-center items-center">
        <div className="flex-col justify-center items-center">
          <p>Action</p>
          <ActionFormBySchema
            Schema={BlogFormSchema}
            labelText={{ title: "タイトル", body: "本文" }}
            action={blogAction}
          />
        </div>
        <div>
          <p>OnSubmit</p>
          <OnSubmitFormBySchema
            Schema={BlogFormSchema}
            labelText={{ title: "タイトル", body: "本文" }}
            onSubmit={(data) => {
              console.log(data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
