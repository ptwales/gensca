#!/usr/bin/env node

const fs = require("fs");
const GenerateSchema = require("generate-schema");
const SchemaConverter = require("json-schema-to-case-class");
const cli = require("cli");
const util = require("util");

const scalaModelsFromJsonData = (name, config, json) =>
  new Promise((resolve) => resolve(GenerateSchema.json(name, json)))
    .then((schema) => (schema.type === "array" ? schema.items : schema))
    .then((schema) => SchemaConverter.convert(schema, config));

const readStdin = () =>
  new Promise((resolve) => cli.withStdin((text) => resolve(text)));

const jsonFromStdin = () => readStdin().then((text) => JSON.parse(text));

const jsonFromFile = (path) =>
  util
    .promisify(fs.readFile)(path, "utf-8")
    .then((data) => JSON.parse(data));

const main = () => {
  const options = cli.parse({
    file: ["f", "A json file to read", "file", false],
  });
  const scalaConfig = { classParamsTextCase: "ignoreCase" };
  let json = options.file ? jsonFromFile(options.file) : jsonFromStdin();
  json
    .then((json) => scalaModelsFromJsonData("name", scalaConfig, json))
    .then((scala) => console.log(scala))
    .catch((err) => console.error(err));
};

main();
