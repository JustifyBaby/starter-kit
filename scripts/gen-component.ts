import fs from "node:fs/promises";
import { env } from "../env";
import path from "node:path";
import { Stdin } from "tslib-stdin";

const COMPONENTS_DIR_PATH = path.join(env.ABS_BASEPATH, "src", "components");

const args = process.argv.slice(2);
const rawComponentName = args[0];

if (!rawComponentName) {
  console.error("Component name is required.");
  process.exit(1);
}

const isProps = args.includes("-p") || args.includes("--props");

const componentName = rawComponentName
  .split(" ")
  .map((cname) => {
    const chars = Array.from(cname);
    chars[0] = chars[0].toUpperCase();
    return chars.join("");
  })
  .join("");

const description = Stdin.streamReadText(
  "Description? Double Enter Click is Finish to edit  >> \n",
);

const newPath = path.join(COMPONENTS_DIR_PATH, componentName);

try {
  const files = await fs.readdir(COMPONENTS_DIR_PATH);

  if (files.includes(componentName)) {
    throw new Error(`${componentName} already exists.`);
  }

  await fs.mkdir(newPath);

  const componentContent = `/**
@description:
  ${description}
 */

${isProps ? `type ${componentName}Props = {};` : ""}
export default function ${componentName}(${isProps ? `{}: ${componentName}Props` : ""}) {
  return (
    <div></div>
  );
}
`;

  const testContent = `
import { describe, test, expect } from "vitest";

describe("${componentName}", () => {
  test("", () => {

  });
});
`;

  await fs.writeFile(
    path.join(newPath, `${componentName}.tsx`),
    componentContent,
  );
  await fs.writeFile(
    path.join(newPath, `${componentName}.test.tsx`),
    testContent,
  );
} catch (err) {
  console.error(err);
  process.exit(1);
}
