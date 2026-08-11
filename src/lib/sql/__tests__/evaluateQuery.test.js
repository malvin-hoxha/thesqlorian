import fs from "node:fs";
import { createRequire } from "node:module";

import initSqlJs from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";

import { evaluateQuery } from "../evaluateQuery.js";

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

describe("evaluateQuery", () => {
  it("accepts a query that returns the expected rows", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM padawans WHERE age > 100;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
    });

    expect(evaluation.correct).toBe(true);

    expect(evaluation.actualRows).toEqual([
      {
        name: "Yoda",
      },
    ]);
  });

  it("rejects a query that returns different rows", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM padawans WHERE age < 100;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
    });

    expect(evaluation.correct).toBe(false);
  });

  it("can ignore column aliases", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name AS padawan_name FROM padawans WHERE age > 100;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(true);
  });

  it("rejects a query that only works for the visible dataset", () => {
    const hiddenRows = [
      {
        id: 1,
        name: "Ahsoka",
        species: "Togruta",
        age: 250,
        lightsaber_color: "Green",
      },
      {
        id: 2,
        name: "Yoda",
        species: "Unknown",
        age: 20,
        lightsaber_color: "Green",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql: "SELECT 'Yoda' AS name;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
      hiddenDatasets: [hiddenRows],
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(false);
  });

  it("accepts a correct query across visible and hidden datasets", () => {
    const hiddenRows = [
      {
        id: 1,
        name: "Ahsoka",
        species: "Togruta",
        age: 250,
        lightsaber_color: "Green",
      },
      {
        id: 2,
        name: "Yoda",
        species: "Unknown",
        age: 20,
        lightsaber_color: "Green",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM padawans WHERE age > 100;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
      hiddenDatasets: [hiddenRows],
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(true);
  });

  it("rejects a query with the wrong condition even if it matches the visible result", () => {
    const hiddenRows = [
      {
        id: 1,
        name: "Ahsoka",
        species: "Togruta",
        age: 250,
        lightsaber_color: "Green",
      },
      {
        id: 2,
        name: "Yoda",
        species: "Unknown",
        age: 20,
        lightsaber_color: "Green",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM padawans WHERE age > 500;",
      expectedSql:
        "SELECT name FROM padawans WHERE age > 100;",
      rows,
      hiddenDatasets: [hiddenRows],
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(false);
  });
});