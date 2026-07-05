import fs from "node:fs/promises";
import { env } from "../env";
import { Stdin } from "tslib-stdin";
import path from "node:path";

const COMPONENTS_DIR_PATH = path.join(env.ABS_BASEPATH, "src", "components");

const args = process.argv.slice(2);
const rawInput = args[0]; // 例: "ui/button" や "Button"

if (!rawInput) {
  console.error("Component name is required.");
  process.exit(1);
}

const isProps = args.includes("-p") || args.includes("--props");

// 入力されたパスを解析 (例: dir='ui', name='button')
const parsedPath = path.parse(rawInput);
const subDir = parsedPath.dir; // ない場合は空文字 ""
const rawComponentName = parsedPath.name;

// パス部分を除いた純粋なコンポーネント名をPascalCaseに変換
const componentName = rawComponentName
  .split(" ")
  .map((cname) => {
    const chars = Array.from(cname);
    if (chars.length === 0) return "";
    chars[0] = chars[0].toUpperCase();
    return chars.join("");
  })
  .join("");

const description = Stdin.streamReadText(
  "Description? Double Enter Click is Finish to edit  >> \n",
);

// 作成先ディレクトリの最終パス (src/components/ui/Button など)
const newPath = path.join(COMPONENTS_DIR_PATH, subDir, componentName);

try {
  // ディレクトリの重複・存在チェック
  try {
    await fs.stat(newPath);
    throw new Error(`${componentName} already exists at ${newPath}.`);
  } catch (error) {
    // 型ガード
    if (error && typeof error === "object" && Object.hasOwn(error, "code")) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") throw err;
    } else {
      throw error;
    }
  }

  // recursive: true で途中の ui/ ディレクトリなども自動作成
  await fs.mkdir(newPath, { recursive: true });

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

describe(${"`"}
  Component: ${componentName}
${"`"}, () => {
  test(${"`"}${"`"}, () => {});
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
