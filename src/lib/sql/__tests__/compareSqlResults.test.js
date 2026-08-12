import { describe, expect, it } from "vitest";

import { compareSqlResults } from "../compareSqlResults.js"; 

describe("compareSqlResults", () => {
  it("accepts identical result sets", () => {
    const actual = [
      { name: "Praxen", age: 203 },
      { name: "Nexa", age: 27 },
    ];

    const expected = [
      { name: "Praxen", age: 203 },
      { name: "Nexa", age: 27 },
    ];

    expect(compareSqlResults(actual, expected)).toBe(true);
  });

  it("rejects result sets with different row counts", () => {
    const actual = [
      { name: "Praxen" },
    ];

    const expected = [
      { name: "Praxen" },
      { name: "Nexa" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("rejects rows with different values", () => {
    const actual = [
      { name: "Praxen", age: 146 },
    ];

    const expected = [
      { name: "Praxen", age: 203 },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("rejects rows with different columns", () => {
    const actual = [
      { name: "Praxen" },
    ];

    const expected = [
      { species: "Selyx" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("currently treats row order as significant", () => {
    const actual = [
      { name: "Nexa" },
      { name: "Praxen" },
    ];

    const expected = [
      { name: "Praxen" },
      { name: "Nexa" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("accepts two empty result sets", () => {
    expect(compareSqlResults([], [])).toBe(true);
  });

  it("can ignore row order when configured", () => {
    const actual = [
      { name: "Nexa" },
      { name: "Praxen" },
    ];

    const expected = [
      { name: "Praxen" },
      { name: "Nexa" },
    ];

    expect(
      compareSqlResults(actual, expected, {
        orderSensitive: false,
      }),
    ).toBe(true);
  });

  it("preserves duplicate row counts when order is ignored", () => {
    const actual = [
      { species: "Human" },
      { species: "Human" },
    ];

    const expected = [
      { species: "Human" },
      { species: "Avren" },
    ];

    expect(
      compareSqlResults(actual, expected, {
        orderSensitive: false,
      }),
    ).toBe(false);

  });

  it("rejects different column names by default", () => {
    const actual = [
      { novate_name: "Praxen" },
    ];

    const expected = [
      { name: "Praxen" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("can ignore column names when configured", () => {
    const actual = [
      { novate_name: "Praxen" },
    ];

    const expected = [
      { name: "Praxen" },
    ];

    expect(
      compareSqlResults(actual, expected, {
        columnNamesSensitive: false,
      }),
    ).toBe(true);
  });

});
