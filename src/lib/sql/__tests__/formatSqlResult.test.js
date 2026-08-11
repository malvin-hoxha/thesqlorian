import { describe, expect, it } from "vitest";

import { formatSqlResult } from "../formatSqlResult.js";

describe("formatSqlResult", () => {
  it("converts a SQL.js result into row objects", () => {
    const sqlResult = [
      {
        columns: ["name", "age"],
        values: [
          ["Nera", 19],
          ["Praxen", 203],
        ],
      },
    ];

    expect(formatSqlResult(sqlResult)).toEqual([
      {
        name: "Nera",
        age: 19,
      },
      {
        name: "Praxen",
        age: 203,
      },
    ]);
  });

  it("returns an empty array when the query returns no result set", () => {
    expect(formatSqlResult([])).toEqual([]);
  });
});