"use server";

import { BlogFormSchema } from "@/types/schema/BlogSchema";
import { zFormGetter } from "barikata";
import { redirect } from "next/navigation";

export async function blogAction(fd: FormData) {
  const { parsed: blog } = zFormGetter(fd, BlogFormSchema);
  if (blog.success) {
    console.log(blog.data);
  } else {
    console.log(blog.error);
  }

  redirect("/");
}
