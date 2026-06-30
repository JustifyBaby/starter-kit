import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    ABS_BASEPATH: z.string(),
  },
  server: {},
  client: {},
  runtimeEnv: {
    ABS_BASEPATH: process.env.ABS_BASEPATH,
  },
});
