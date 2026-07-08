"use server";

import { Action } from "@/types/global/FormAction";
import { BlogFormSchema } from "@schema/BlogSchema";
import { zFormGetter } from "barikata";
import { redirect } from "next/navigation";

export const blogAction: Action = async (fd) => {
  const { parsed: blog } = zFormGetter(fd, BlogFormSchema);
  if (blog.success) {
    console.log(blog.data);
    return;
  } else {
    console.log(blog.error);
  }

  redirect("/");
};
