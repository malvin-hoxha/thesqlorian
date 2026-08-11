import { describe, expect, it } from "vitest";

import { formatSqlResult } from "../formatSqlResult.js";

describe("formatSqlResult", () => {
  it("converts a SQL.js result into row objects", () => {
    const sqlResult = [
      {
        columns: ["name", "age"],
        values: [
          ["Yoda", 900],
          ["Grogu", 50],
        ],
      },
    ];

    expect(formatSqlResult(sqlResult)).toEqual([
      {
        name: "Yoda",
        age: 900,
      },
      {
        name: "Grogu",
        age: 50,
      },
    ]);
  });

  it("returns an empty array when the query returns no result set", () => {
    expect(formatSqlResult([])).toEqual([]);
  });
});