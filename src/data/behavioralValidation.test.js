import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import initSqlJs from "sql.js";

import challenges from "./data.js";
import validationDatasets from "./validationDatasets.js";
import { evaluateQuery } from "../lib/sql/evaluateQuery.js";

const require = createRequire(import.meta.url);
const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");

const SQL = await initSqlJs({
  wasmBinary: await readFile(wasmPath),
});

function getChallenge(id) {
  const challenge = challenges.find(
    (challenge) => challenge.id === id,
  );

  if (!challenge) {
    throw new Error(`Challenge ${id} was not found.`);
  }

  return challenge;
}

describe("Behavioral challenge validation", () => {
  const adversarialCases = [
    {
      challengeId: 1,
      userSql:
        "SELECT name FROM novates WHERE age > 145;",
      description:
        "rejects an incorrect age threshold that matches the visible result",
    },
    {
      challengeId: 3,
      userSql: `
        SELECT name
        FROM novates
        WHERE resonance_color = 'Cyan'
          AND age < 40;
      `,
      description:
        "rejects an age condition that only coincides with Human Cyan on visible data",
    },
    {
      challengeId: 3,
      userSql: `
        SELECT name
        FROM novates
        WHERE species = 'Human'
          AND name LIKE 'Ne%';
      `,
      description:
        "rejects a name-prefix condition that only coincides with Human Cyan on visible data",
    },
    {
      challengeId: 3,
      userSql: `
        SELECT name
        FROM novates
        WHERE resonance_color = 'Cyan'
          AND name LIKE 'Ne%';
      `,
      description:
        "rejects a name-prefix substitute for the Human condition",
    },
    {
      challengeId: 4,
      userSql: `
        SELECT name
        FROM novates
        WHERE species IN ('Avren', 'Myrin')
          AND resonance_color != 'None';
      `,
      description:
        "rejects an extra resonance condition hidden by the visible species data",
    },
    {
      challengeId: 7,
      userSql:
        "SELECT name FROM novates WHERE name LIKE 'Ne_a';",
      description:
        "rejects a single-character pattern instead of a prefix pattern",
    },
    {
        challengeId: 8,
        userSql: `
            SELECT name
            FROM novates
            WHERE name LIKE '%ren'
            OR name LIKE '%den';
        `,
        description:
            "rejects an extra suffix condition that is invisible in the main dataset",
    },
    {
      challengeId: 9,
      userSql:
        "SELECT name FROM novates WHERE name LIKE 'Ne%';",
      description:
        "rejects a prefix pattern instead of an exact single-character pattern",
    },
    {
      challengeId: 10,
      userSql:
        "SELECT name FROM novates WHERE name LIKE '%ira';",
      description:
        "rejects an any-length wildcard instead of one leading character",
    },
    {
      challengeId: 11,
      userSql:
        "SELECT AVG(DISTINCT age) AS average_age FROM novates;",
      description:
        "rejects AVG DISTINCT when duplicate ages reveal different behavior",
    },
    {
      challengeId: 14,
      userSql:
        "SELECT SUM(DISTINCT age) AS total_age FROM novates;",
      description:
        "rejects SUM DISTINCT when duplicate ages reveal different behavior",
    },
    {
      challengeId: 16,
      userSql:
        "SELECT name FROM novates ORDER BY id DESC LIMIT 3;",
      description:
        "rejects ordering by id when it only happens to match age ordering",
    },
    {
      challengeId: 17,
      userSql:
        "SELECT name FROM novates WHERE name LIKE 'Ora%';",
      description:
        "rejects a prefix pattern that only happens to match the visible result",
    },
    {
      challengeId: 19,
      userSql: `
        SELECT name
        FROM novates
        WHERE resonance_color = 'None'
          AND species != 'Selyx';
      `,
      description:
        "rejects an extra species condition hidden by the visible None rows",
    },
  ];

  it.each(adversarialCases)(
    "$description",
    ({ challengeId, userSql }) => {
      const challenge = getChallenge(challengeId);

      const visibleOnlyEvaluation = evaluateQuery({
        SQL,
        userSql,
        expectedSql: challenge.expected_sql,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
      });

      expect(visibleOnlyEvaluation.correct).toBe(true);

      const behavioralEvaluation = evaluateQuery({
        SQL,
        userSql,
        expectedSql: challenge.expected_sql,
        hiddenDatasets: validationDatasets,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
      });

      expect(behavioralEvaluation.correct).toBe(false);
    },
  );

  const equivalentCases = [
    {
        challengeId: 1,
        userSql:
        "SELECT name FROM novates WHERE NOT age <= 100;",
        description:
        "accepts an equivalent age condition",
    },
    {
        challengeId: 4,
        userSql:
        "SELECT name FROM novates WHERE species IN ('Avren', 'Myrin');",
        description:
        "accepts IN instead of OR",
    },
    {
        challengeId: 6,
        userSql:
        "SELECT resonance_color FROM novates GROUP BY resonance_color;",
        description:
        "accepts GROUP BY as an alternative to DISTINCT",
    },
    {
        challengeId: 15,
        userSql: `
        SELECT name
        FROM novates
        WHERE species IN (
            'Avren',
            'Myrin',
            'Tavri',
            'Orren',
            'Selyx'
        );
        `,
        description:
        "accepts an equivalent explicit non-Human species set",
    },
  ];

  it.each(equivalentCases)(
    "$description",
    ({ challengeId, userSql }) => {
        const challenge = getChallenge(challengeId);

        const evaluation = evaluateQuery({
        SQL,
        userSql,
        expectedSql: challenge.expected_sql,
        hiddenDatasets: validationDatasets,
        orderSensitive: challenge.orderSensitive ?? false,
        columnNamesSensitive: false,
        });

        expect(evaluation.correct).toBe(true);
    },
  );
});
