import { describe, expect, it } from "vitest";

import { compareSqlResults } from "../compareSqlResults.js"; 

describe("compareSqlResults", () => {
  it("accepts identical result sets", () => {
    const actual = [
      { name: "Yoda", age: 900 },
      { name: "Grogu", age: 50 },
    ];

    const expected = [
      { name: "Yoda", age: 900 },
      { name: "Grogu", age: 50 },
    ];

    expect(compareSqlResults(actual, expected)).toBe(true);
  });

  it("rejects result sets with different row counts", () => {
    const actual = [
      { name: "Yoda" },
    ];

    const expected = [
      { name: "Yoda" },
      { name: "Grogu" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("rejects rows with different values", () => {
    const actual = [
      { name: "Yoda", age: 800 },
    ];

    const expected = [
      { name: "Yoda", age: 900 },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("rejects rows with different columns", () => {
    const actual = [
      { name: "Yoda" },
    ];

    const expected = [
      { species: "Yoda's Species" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("currently treats row order as significant", () => {
    const actual = [
      { name: "Grogu" },
      { name: "Yoda" },
    ];

    const expected = [
      { name: "Yoda" },
      { name: "Grogu" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("accepts two empty result sets", () => {
    expect(compareSqlResults([], [])).toBe(true);
  });

  it("can ignore row order when configured", () => {
    const actual = [
      { name: "Grogu" },
      { name: "Yoda" },
    ];

    const expected = [
      { name: "Yoda" },
      { name: "Grogu" },
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
      { species: "Kel Dor" },
    ];

    expect(
      compareSqlResults(actual, expected, {
        orderSensitive: false,
      }),
    ).toBe(false);

  });

  it("rejects different column names by default", () => {
    const actual = [
      { padawan_name: "Yoda" },
    ];

    const expected = [
      { name: "Yoda" },
    ];

    expect(compareSqlResults(actual, expected)).toBe(false);
  });

  it("can ignore column names when configured", () => {
    const actual = [
      { padawan_name: "Yoda" },
    ];

    const expected = [
      { name: "Yoda" },
    ];

    expect(
      compareSqlResults(actual, expected, {
        columnNamesSensitive: false,
      }),
    ).toBe(true);
  });

});

