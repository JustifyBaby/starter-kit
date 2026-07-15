"use server";

import { Action } from "@/types/global/FormAction";
import { BlogFormSchema } from "@schema/BlogSchema";
import { zFormGetter } from "barikata";

export const blogAction: Action = async (fd) => {
  const { parsed: blog } = zFormGetter(fd, BlogFormSchema);
  if (blog.success) {
    new Promise((r) => setTimeout(r, 500));
    console.log(blog.data);
    return;
  } else {
    new Promise((r) => setTimeout(r, 1000));
    console.log(blog.error);
  }
};
