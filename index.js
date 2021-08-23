const fs = require("fs");
const GenerateSchema = require("generate-schema");
const SchemaConverter = require("json-schema-to-case-class");

const scalaConfig = { classParamsTextCase: "ignoreCase" };

const addJsonCodecs = (scalaText) =>
  scalaText
    .split("\n")
    .map((line) =>
      line.startsWith("case class") ? "@JsonCodec " + line : line
    )
    .join("\n");

const addPrefixes = (scalaText) =>
  `package datasembly.galactus.sources

import io.circe.generic.JsonCodec

${scalaText}`;

new Promise((resolve) =>
  resolve(fs.readFileSync("./clubhouse-members.json", "utf-8"))
)
  .then((text) => JSON.parse(text))
  .then((json) => GenerateSchema.json("Members", json))
  .then((schema) => (schema.type === "array" ? schema.items : schema))
  .then((schema) => SchemaConverter.convert(schema, scalaConfig))
  .then((scala) => addJsonCodecs(scala))
  .then((scala) => addPrefixes(scala))
  .then((scala) => console.log(scala))
  .catch((err) => console.error(err));
