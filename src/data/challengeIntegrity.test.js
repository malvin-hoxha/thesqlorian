import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import initSqlJs from "sql.js";

import challenges from "./data.js";
import { createNovatesDatabase } from "../lib/sql/createNovatesDatabase.js";
import { formatSqlResult } from "../lib/sql/formatSqlResult.js";
import validationDatasets from "./validationDatasets.js";
import { evaluateQuery } from "../lib/sql/evaluateQuery.js";

const require = createRequire(import.meta.url);
const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");

const SQL = await initSqlJs({
  wasmBinary: await readFile(wasmPath),
});

function toSqlLiteral(value) {
  if (value === null) {
    return "NULL";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    return `'${value.replaceAll("'", "''")}'`;
  }

  throw new Error(`Unsupported SQL literal type: ${typeof value}`);
}

function createHardcodedResultQuery(rows) {
  if (rows.length === 0) {
    throw new Error("Cannot create a hardcoded query from an empty result.");
  }

  const columns = Object.keys(rows[0]);

  const selectStatements = rows.map((row, rowIndex) => {
    const values = columns.map((column) => {
      const literal = toSqlLiteral(row[column]);

      if (rowIndex === 0) {
        return `${literal} AS ${column}`;
      }

      return literal;
    });

    return `SELECT ${values.join(", ")}`;
  });

  return `${selectStatements.join("\nUNION ALL\n")};`;
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
      const database = createNovatesDatabase(SQL);

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

  it.each(challenges)(
    "challenge $id reference query works across validation datasets",
    (challenge) => {
      const evaluation = evaluateQuery({
        SQL,
        userSql: challenge.expected_sql,
        expectedSql: challenge.expected_sql,
        hiddenDatasets: validationDatasets,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
      });

      expect(evaluation.correct).toBe(true);
    },
  );

  it.each(challenges)(
    "challenge $id rejects a hardcoded copy of the displayed result",
    (challenge) => {
      const hardcodedSql = createHardcodedResultQuery(
        challenge.resulted_table,
      );

      const visibleOnlyEvaluation = evaluateQuery({
        SQL,
        userSql: hardcodedSql,
        expectedSql: challenge.expected_sql,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
      });

      expect(visibleOnlyEvaluation.correct).toBe(true);

      const behavioralEvaluation = evaluateQuery({
        SQL,
        userSql: hardcodedSql,
        expectedSql: challenge.expected_sql,
        hiddenDatasets: validationDatasets,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
      });

      expect(behavioralEvaluation.correct).toBe(false);
    },
  );
});