import { describe, expect, it } from "vitest";

import { validateSqlStatement } from "../validateSqlStatement.js";

describe("validateSqlStatement", () => {
  it("accepts an uppercase SELECT query", () => {
    const result = validateSqlStatement(
      "SELECT name FROM padawans;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("accepts a lowercase SELECT query", () => {
    const result = validateSqlStatement(
      "select name from padawans;",
    );

    expect(result.valid).toBe(true);
  });

  it("accepts leading and trailing whitespace", () => {
    const result = validateSqlStatement(
      "   SELECT name FROM padawans;   ",
    );

    expect(result.valid).toBe(true);
  });

  it("rejects an empty query", () => {
    const result = validateSqlStatement("   ");

    expect(result).toEqual({
      valid: false,
      error: "Write a SQL query before running it.",
    });
  });

  it("rejects a non-SELECT query", () => {
    const result = validateSqlStatement(
      "DELETE FROM padawans;",
    );

    expect(result).toEqual({
      valid: false,
      error: "Only SELECT queries are allowed.",
    });
  });
});