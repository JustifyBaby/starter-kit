import fs from "node:fs/promises";
import { Stdin } from "tslib-stdin";
import path from "node:path";
import { ROOT_PATH } from "./path";

const COMPONENTS_DIR_PATH = path.join(ROOT_PATH, "src", "components");
const APP_DIR_PATH = path.join(ROOT_PATH, "src", "app");

const args = process.argv.slice(2);
const rawInput = args.find((arg) => !arg.startsWith("-")); // 例: "ui/button" や "Button"

if (!rawInput) {
  console.error("Component name is required.");
  process.exit(1);
}

const hasOption = (
  optionName: `--${string}`,
  shortOptionName?: `-${string}`,
) =>
  args.includes(optionName) ||
  (shortOptionName !== undefined && args.includes(shortOptionName));

// propsの空定義の自動挿入
const isProps = hasOption("--props", "-p");

// 実装予定のapp dirにpage.tsxを生成するロジックで用いる。
const isRoute = hasOption("--route", "-r");

// use clientの挿入
const isCSR = hasOption("--client", "-c");

// action.tsの導入
const hasAction = hasOption("--action", "-a");

const toKebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const toPascalCase = (value: string) =>
  toKebabCase(value)
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.substring(1)}`)
    .join("");

// 入力されたパスを解析 (例: dir='ui', name='button')
const parsedPath = path.posix.parse(rawInput.replaceAll("\\", "/"));
const subDirSegments = parsedPath.dir.split("/").filter(Boolean);
const rawComponentName = parsedPath.name;

// パス部分を除いた純粋なコンポーネント名をPascalCaseに変換
const baseComponentName = toPascalCase(rawComponentName);
const componentName = isRoute ? `${baseComponentName}Page` : baseComponentName;

const newPath = isRoute
  ? path.join(
      APP_DIR_PATH,
      ...subDirSegments.map(toKebabCase),
      toKebabCase(rawComponentName),
    )
  : path.join(COMPONENTS_DIR_PATH, ...subDirSegments, componentName);
const componentFileName = isRoute ? "page.tsx" : `${componentName}.tsx`;
const testFileName = isRoute
  ? "page.test.tsx"
  : `${componentName}.test.tsx`;
const componentImportPath = isRoute ? "./page" : `./${componentName}`;

const description = Stdin.streamReadText(
  "Description? Double Enter Click is Finish to edit  >> \n",
);

try {
  // ディレクトリの重複・存在チェック
  const duplicateCheckPath = isRoute
    ? path.join(newPath, componentFileName)
    : newPath;
  try {
    await fs.stat(duplicateCheckPath);
    throw new Error(`${componentName} already exists at ${duplicateCheckPath}.`);
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

  const componentContent = `
${isCSR ? `"use client";` : ""}
/**
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
import { render, screen } from "@testing-library/react";
import ${componentName} from "${componentImportPath}";

describe(${"`"}
  Component: ${componentName}
${"`"}, () => {
  test(${"`"}${"`"}, () => {
    render(<${componentName} />);
  });
});
`;

  await fs.writeFile(
    path.join(newPath, componentFileName),
    componentContent,
  );
  await fs.writeFile(
    path.join(newPath, testFileName),
    testContent,
  );
  if (hasAction) {
    const actionContent = `"use server";

export async function ${componentName[0].toLowerCase()}${componentName.substring(1)}Action(
  // prevState: ,
  fd: FormData
): Promise<> {

}
    `;
    await fs.writeFile(path.join(newPath, "action.ts"), actionContent);
  }

  console.log(`Successful to create ${componentName}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
