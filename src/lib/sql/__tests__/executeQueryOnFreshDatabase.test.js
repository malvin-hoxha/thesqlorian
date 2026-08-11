import fs from "node:fs";
import { createRequire } from "node:module";

import initSqlJs from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";

import { executeQueryOnFreshDatabase } from "../executeQueryOnFreshDatabase.js";

const require = createRequire(import.meta.url);

let SQL;

beforeAll(async () => {
  const wasmPath = require.resolve(
    "sql.js/dist/sql-wasm.wasm",
  );

  const wasmBinary = fs.readFileSync(wasmPath);

  SQL = await initSqlJs({
    wasmBinary,
  });
});

describe("executeQueryOnFreshDatabase", () => {
  it("executes a query and returns formatted rows", () => {
    const rows = [
      {
        id: 1,
        name: "Ahsoka",
        species: "Togruta",
        age: 17,
        lightsaber_color: "Green",
      },
      {
        id: 2,
        name: "Yoda",
        species: "Unknown",
        age: 900,
        lightsaber_color: "Green",
      },
    ];

    const result = executeQueryOnFreshDatabase(
      SQL,
      "SELECT name FROM padawans WHERE age > 100;",
      rows,
    );

    expect(result).toEqual([
      {
        name: "Yoda",
      },
    ]);
  });

  it("uses a fresh database for every execution", () => {
    const rows = [
      {
        id: 1,
        name: "Yoda",
        species: "Unknown",
        age: 900,
        lightsaber_color: "Green",
      },
    ];

    const firstResult = executeQueryOnFreshDatabase(
      SQL,
      "SELECT name FROM padawans;",
      rows,
    );

    const secondResult = executeQueryOnFreshDatabase(
      SQL,
      "SELECT age FROM padawans;",
      rows,
    );

    expect(firstResult).toEqual([
      {
        name: "Yoda",
      },
    ]);

    expect(secondResult).toEqual([
      {
        age: 900,
      },
    ]);
  });
});