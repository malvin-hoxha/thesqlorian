import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import initSqlJs from "sql.js";

import challenges from "./data.js";
import { createPadawansDatabase } from "../lib/sql/createPadawansDatabase.js";

const require = createRequire(import.meta.url);
const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");

const SQL = await initSqlJs({
  wasmBinary: await readFile(wasmPath),
});

function formatSqlResult(result) {
  if (result.length === 0) {
    return [];
  }

  const { columns, values } = result[0];

  return values.map((row) =>
    Object.fromEntries(
      row.map((value, index) => [columns[index], value]),
    ),
  );
}

describe("Challenge data integrity", () => {
  it("uses a unique id for every challenge", () => {
    const challengeIds = challenges.map((challenge) => challenge.id);
    const uniqueChallengeIds = new Set(challengeIds);

    expect(uniqueChallengeIds.size).toBe(challengeIds.length);
  });

  it("has valid required fields for every challenge", () => {
    challenges.forEach((challenge) => {
      expect(typeof challenge.expected_sql).toBe("string");
      expect(challenge.expected_sql.trim()).not.toBe("");
      expect(Array.isArray(challenge.resulted_table)).toBe(true);
    });
  });

  it.each(challenges)(
    "challenge $id displays the result returned by its reference query",
    (challenge) => {
      const database = createPadawansDatabase(SQL);

      try {
        const result = database.exec(challenge.expected_sql);
        const actualResult = formatSqlResult(result);

        expect(result).toHaveLength(1);
        expect(actualResult).toEqual(challenge.resulted_table);
      } finally {
        database.close();
      }
    },
  );
});