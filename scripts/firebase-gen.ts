import { Stdin } from "tslib-stdin";
import fs from "node:fs";
import { env } from "../env";
import path from "node:path";

const firebases = Stdin.streamReads(
  "Firebase text >> \n",
  (line) => line === "EOF" || line === "eof",
);

const fmtSymbol = (sym: string): [string, string] => {
  const [key, value] = sym
    .split(":")
    .map((elm) => elm.replaceAll(/[\s\\",]/g, ""));

  return [key, value];
};

const configs = firebases
  .filter((value) => value.split(":").length === 2 && !value.includes("//"))
  .map((value) => fmtSymbol(value));

const genEnvName = (key: string): `NEXT_PUBLIC_${string}` => {
  const keyToUpper = Array.from(key)
    .map((char) => {
      if (/[A-Z]/.test(char)) {
        return `_${char}`;
      }
      return char.toUpperCase();
    })
    .join("");

  return `NEXT_PUBLIC_${keyToUpper}`;
};

const fmtConfigs = configs.map(([name, value]) => {
  const envName = genEnvName(name);
  return [envName, value];
});

// fmtConfigs.forEach(([name, value]) => {
//   fs.writeFile(path.join(env.ABS_BASEPATH, "src", "lib", "firebase.ts"),name,);
//   fs.writeFile(path.join(env.ABS_BASEPATH, ".env"));
// });

console.log(fmtConfigs);
