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

describe("evaluateQuery", () => {
  it("accepts a query that returns the expected rows", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM novates WHERE age > 100;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
      rows,
    });

    expect(evaluation.correct).toBe(true);

    expect(evaluation.actualRows).toEqual([
      {
        name: "Praxen",
      },
    ]);
  });

  it("rejects a query that returns different rows", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM novates WHERE age < 100;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
      rows,
    });

    expect(evaluation.correct).toBe(false);
  });

  it("can ignore column aliases", () => {
    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name AS novate_name FROM novates WHERE age > 100;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
      rows,
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(true);
  });

  it("rejects a query that only works for the visible dataset", () => {
    const hiddenRows = [
      {
        id: 1,
        name: "Nera",
        species: "Human",
        age: 150,
        resonance_color: "Cyan",
      },
      {
        id: 2,
        name: "Praxen",
        species: "Selyx",
        age: 20,
        resonance_color: "Cyan",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql: "SELECT 'Praxen' AS name;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
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
        name: "Nera",
        species: "Human",
        age: 150,
        resonance_color: "Cyan",
      },
      {
        id: 2,
        name: "Praxen",
        species: "Selyx",
        age: 20,
        resonance_color: "Cyan",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM novates WHERE age > 100;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
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
        name: "Nera",
        species: "Human",
        age: 150,
        resonance_color: "Cyan",
      },
      {
        id: 2,
        name: "Praxen",
        species: "Selyx",
        age: 20,
        resonance_color: "Cyan",
      },
    ];

    const evaluation = evaluateQuery({
      SQL,
      userSql:
        "SELECT name FROM novates WHERE age > 200;",
      expectedSql:
        "SELECT name FROM novates WHERE age > 100;",
      rows,
      hiddenDatasets: [hiddenRows],
      columnNamesSensitive: false,
    });

    expect(evaluation.correct).toBe(false);
  });
});