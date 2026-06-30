import { Stdin } from "tslib-stdin";

const CONFIG_NOTICE = "const firebaseConfig";

const firebases = Stdin.streamReads(
  "Firebase text >> \n",
  (line) => line === "EOF" || line === "eof",
);

// const startConfig_i = firebases.findIndex((value) =>
//   value.includes(CONFIG_NOTICE),
// );

// if (startConfig_i === -1) {
//   throw new Error(`${firebases.join("\n")}
//   have to include "${CONFIG_NOTICE}"`);
// }

// const endConfig_i =
//   startConfig_i +
//   firebases
//     .slice(startConfig_i, firebases.length)
//     .findIndex((value) => value.includes("}"));

// if (endConfig_i === -1) {
//   throw new Error(`May be syntax error! "}" is necessary!`);
// }
// const configs = firebases.slice(startConfig_i, endConfig_i);

const configs = firebases.filter(
  (value) => value.split(":").length === 2 && !value.includes("//"),
);

console.log(configs);
// configs.forEach((config) => {
//   config.split(":");
// });
