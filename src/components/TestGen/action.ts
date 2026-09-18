"use server";

import { BlogFormSchema } from "@/types/schema/BlogSchema";
import { zFormGetter } from "barikata";

export async function testGenAction(
  // prevState: ,
  fd: FormData,
): Promise<void> {
  zFormGetter(fd, BlogFormSchema).field("body");
}
