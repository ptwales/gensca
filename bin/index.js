#!/usr/bin/env node

const fs = require("fs");
const cli = require("cli");
const util = require("util");
const transform = require("transform-json-types");

const main = () => {
  const options = cli.parse({
    file: ["f", "A json file to read", "file", false],
    name: ["n", "Root name of the class", "name", "Response"],
  });
  const transformConfig = { lang: "scala", objectName: options.name };
  let json = options.file ? jsonFromFile(options.file) : jsonFromStdin();
  json
    .then((json) => scalaModelsFromJsonData(transformConfig, json))
    .then((scala) => cleanUpCode(scala))
    .then((scala) => addCodecs(scala))
    .then((scala) => console.log(scala))
    .catch((err) => console.error(err));
};

const scalaModelsFromJsonData = (config, json) =>
  new Promise((resolve) => resolve(transform(json, config)));

const readStdin = () =>
  new Promise((resolve) => cli.withStdin((text) => resolve(text)));

const jsonFromStdin = () => readStdin().then((text) => JSON.parse(text));

const jsonFromFile = (path) =>
  util
    .promisify(fs.readFile)(path, "utf-8")
    .then((data) => JSON.parse(data));

const cleanUpCode = (scalaCode) => scalaCode.replace(/\s\(/g, "(");

const addCodecs = (scalaCode) => {
  const caseClasses = listCaseClasses(scalaCode);
  const codecs = caseClasses.map(formatCodec);
  return [scalaCode, ...codecs].join("\n");
};

const listCaseClasses = (scalaCode) =>
  [...scalaCode.matchAll(/case class (\w+)\(/g)].map((m) => m[1]);

const formatCodec = (className) => {
  const camelCase = className[0].toLowerCase() + className.slice(1);
  return `implicit val ${camelCase}Decoder: Decoder[${className}] = deriveDecoder[${className}]`;
}

// Execute
main();
