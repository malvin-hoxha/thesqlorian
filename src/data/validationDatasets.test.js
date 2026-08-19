import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import initSqlJs from "sql.js";

import validationDatasets from "./validationDatasets.js";
import { createNovatesDatabase } from "../lib/sql/createNovatesDatabase.js";
import { executeQueryOnFreshDatabase } from "../lib/sql/executeQueryOnFreshDatabase.js";


const require = createRequire(import.meta.url);
const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");

const SQL = await initSqlJs({
  wasmBinary: await readFile(wasmPath),
});

const validSpecies = new Set([
  "Human",
  "Avren",
  "Myrin",
  "Tavri",
  "Orren",
  "Selyx",
]);

const validResonanceColors = new Set([
  "Cyan",
  "Amber",
  "Violet",
  "Crimson",
  "None",
]);

const requiredFields = [
  "id",
  "name",
  "species",
  "age",
  "resonance_color",
];

describe("Validation datasets", () => {
  it("contains exactly two deterministic datasets", () => {
    expect(validationDatasets).toHaveLength(2);
  });

  it("contains enough rows in every dataset", () => {
    validationDatasets.forEach((rows) => {
      expect(rows.length).toBeGreaterThanOrEqual(10);
    });
  });

  it("uses unique ids inside every dataset", () => {
    validationDatasets.forEach((rows) => {
      const ids = rows.map((row) => row.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  it("uses the required schema and valid universe values", () => {
    validationDatasets.forEach((rows) => {
      rows.forEach((row) => {
        requiredFields.forEach((field) => {
          expect(row).toHaveProperty(field);
        });

        expect(Number.isInteger(row.id)).toBe(true);
        expect(Number.isInteger(row.age)).toBe(true);

        expect(typeof row.name).toBe("string");
        expect(row.name.trim()).not.toBe("");

        expect(validSpecies.has(row.species)).toBe(true);
        expect(
          validResonanceColors.has(row.resonance_color),
        ).toBe(true);
      });
    });
  });

  it("can create a novates database from every dataset", () => {
    validationDatasets.forEach((rows) => {
      const database = createNovatesDatabase(SQL, rows);

      try {
        const result = database.exec(`
          SELECT COUNT(*) AS total
          FROM novates;
        `);

        expect(result[0].values[0][0]).toBe(rows.length);
      } finally {
        database.close();
      }
    });
  });

  it("distinguishes prefix matching from single-character LIKE matching", () => {
    const [datasetA] = validationDatasets;

    const prefixMatches = executeQueryOnFreshDatabase(
        SQL,
        "SELECT name FROM novates WHERE name LIKE 'Ne%';",
        datasetA,
    );

    const singleCharacterMatches = executeQueryOnFreshDatabase(
        SQL,
        "SELECT name FROM novates WHERE name LIKE 'Ne_a';",
        datasetA,
    );

    expect(prefixMatches).not.toEqual(singleCharacterMatches);

    expect(prefixMatches).toEqual([
        { name: "Nela" },
        { name: "Nexara" },
        { name: "Neo" },
    ]);

    expect(singleCharacterMatches).toEqual([
        { name: "Nela" },
    ]);
  });

  it("distinguishes exactly one leading character from any-length LIKE matching", () => {
    const [datasetA] = validationDatasets;

    const exactPatternMatches = executeQueryOnFreshDatabase(
        SQL,
        "SELECT name FROM novates WHERE name LIKE '_ira';",
        datasetA,
    );

    const suffixMatches = executeQueryOnFreshDatabase(
        SQL,
        "SELECT name FROM novates WHERE name LIKE '%ira';",
        datasetA,
    );

    expect(exactPatternMatches).not.toEqual(suffixMatches);

    expect(exactPatternMatches).toEqual([
        { name: "Kira" },
    ]);

    expect(suffixMatches).toEqual([
        { name: "Kira" },
        { name: "Alira" },
    ]);
  });

  it("distinguishes AVG from AVG DISTINCT", () => {
    const [, datasetB] = validationDatasets;

    const averageAge = executeQueryOnFreshDatabase(
        SQL,
        "SELECT AVG(age) AS average_age FROM novates;",
        datasetB,
    );

    const distinctAverageAge = executeQueryOnFreshDatabase(
        SQL,
        "SELECT AVG(DISTINCT age) AS average_age FROM novates;",
        datasetB,
    );

    expect(averageAge).not.toEqual(distinctAverageAge);
  });
});