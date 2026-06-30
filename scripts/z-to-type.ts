import fs from "node:fs";
import path from "node:path";
import { env } from "../env";

const Z_SCHEMA_PATH = path.join(env.ABS_BASEPATH, "src/types/schema");
const Z_SUFFIX = "Schema";

const zodSchemaList = (content: string): string[] => {
  let schemas: string[] = [];

  const split = content.split(/ * const /);
  const schemaIncludes = split.filter((text) => text.includes(Z_SUFFIX));

  for (const schema of schemaIncludes) {
    const zschema_i = schema.indexOf(Z_SUFFIX);
    schemas = [...schemas, schema.substring(0, zschema_i) + Z_SUFFIX];
  }

  return schemas;
};

const gen_zInfer = (content: string): string[] => {
  const schemas = zodSchemaList(content);
  let inferList: string[] = [];
  for (const schema of schemas) {
    const inferTxtIndex = schema.indexOf(Z_SUFFIX);
    const inferName = schema.substring(0, inferTxtIndex);
    const inferText = `export type ${inferName} = z.infer<typeof ${schema}>`;
    inferList = [...inferList, inferText];
  }

  return inferList;
};

const gen_import = (content: string, filename: string): string => {
  const schemas = zodSchemaList(content);
  const inferText = `import { ${schemas.join(", ")} } from "@schema/${filename.replace(".ts", "")}"`;
  return inferText;
};

fs.readdir(Z_SCHEMA_PATH, { encoding: "utf-8" }, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  if (!files) return;

  for (const filename of files) {
    const buf = fs.readFileSync(path.join(Z_SCHEMA_PATH, filename));
    const content = buf.toString().trim();
    const newTsName = `${filename.split(".")[0]}.types.ts`;

    const newPathName = path.join(
      Z_SCHEMA_PATH.replace(Z_SUFFIX.toLowerCase(), ""),
      newTsName,
    );

    // zodのimport
    fs.writeFile(newPathName, `import { z } from "zod"\n`, (err) => {
      if (err) {
        console.log("Write file error", err);
        throw new Error();
      }
    });

    // schemaのimport
    fs.appendFile(newPathName, `${gen_import(content, filename)}\n`, (err) => {
      if (err) {
        console.log("Append file error", err);
        throw new Error();
      }
    });

    // 生成した型の反映
    fs.appendFile(newPathName, gen_zInfer(content).join("\n"), (err) => {
      if (err) {
        console.log("Append file error", err);
        throw new Error();
      }
    });

    console.log(`Generating ${newPathName} successfully!`);
  }
});
