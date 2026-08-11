import { describe, expect, it } from "vitest";

import { validateSqlStatement } from "../validateSqlStatement.js";

describe("validateSqlStatement", () => {
  it("accepts an uppercase SELECT query", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("accepts a lowercase SELECT query", () => {
    const result = validateSqlStatement(
      "select name from novates;",
    );

    expect(result.valid).toBe(true);
  });

  it("accepts leading and trailing whitespace", () => {
    const result = validateSqlStatement(
      "   SELECT name FROM novates;   ",
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
      "DELETE FROM novates;",
    );

    expect(result).toEqual({
      valid: false,
      error: "Only SELECT queries are allowed.",
    });
  });

  it("rejects multiple SQL statements", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates; DROP TABLE novates;",
    );

    expect(result).toEqual({
      valid: false,
      error: "Only one SQL statement is allowed.",
    });
  });

  it("allows a semicolon inside a string literal", () => {
    const result = validateSqlStatement(
      "SELECT ';' AS symbol;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("allows escaped single quotes inside a string literal", () => {
    const result = validateSqlStatement(
      "SELECT 'It''s valid' AS text;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("allows a semicolon after an escaped quote inside a string literal", () => {
    const result = validateSqlStatement(
      "SELECT 'It''s; valid' AS text;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("allows a trailing SQL line comment after the statement", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates; -- get all names",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("ignores semicolons inside a SQL line comment", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates -- ; not another statement",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("allows a trailing SQL block comment after the statement", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates; /* get all names */",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("ignores semicolons inside a SQL block comment", () => {
    const result = validateSqlStatement(
      "SELECT name FROM novates /* ; not another statement */;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });

  it("treats comment markers inside a string as normal text", () => {
    const result = validateSqlStatement(
      "SELECT '-- not a comment /* still text */' AS text;",
    );

    expect(result).toEqual({
      valid: true,
      error: null,
    });
  });
});