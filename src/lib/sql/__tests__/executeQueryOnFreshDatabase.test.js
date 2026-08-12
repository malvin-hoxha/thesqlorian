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
        name: "Nera",
        species: "Human",
        age: 19,
        resonance_color: "Cyan",
      },
      {
        id: 2,
        name: "Praxen",
        species: "Selyx",
        age: 203,
        resonance_color: "Cyan",
      },
    ];

    const result = executeQueryOnFreshDatabase(
      SQL,
      "SELECT name FROM novates WHERE age > 100;",
      rows,
    );

    expect(result).toEqual([
      {
        name: "Praxen",
      },
    ]);
  });

  it("uses a fresh database for every execution", () => {
    const rows = [
      {
        id: 1,
        name: "Praxen",
        species: "Selyx",
        age: 203,
        resonance_color: "Cyan",
      },
    ];

    const firstResult = executeQueryOnFreshDatabase(
      SQL,
      "SELECT name FROM novates;",
      rows,
    );

    const secondResult = executeQueryOnFreshDatabase(
      SQL,
      "SELECT age FROM novates;",
      rows,
    );

    expect(firstResult).toEqual([
      {
        name: "Praxen",
      },
    ]);

    expect(secondResult).toEqual([
      {
        age: 203,
      },
    ]);
  });
});