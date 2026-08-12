const data = [
  {
    id: 1,
    hint: "Some Novates have lived beyond a century. Retrieve their names.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE age > 100;",
    example_sql: `SQL accepts various inequality symbols, including:
      = "equal to"
      > "greater than"
      < "less than"
      >= "greater than or equal to"
      <= "less than or equal to"

      For example:
      SELECT column_name FROM table_name WHERE column_name < value;`,
    resulted_table: [
      { name: "Corin" },
      { name: "Praxen" }
    ]
  },
  {
    id: 2,
    hint: "The Institute classifies Novates aged 40 or older as senior members. Retrieve their records.",
    table: "novates",
    expected_sql: "SELECT * FROM novates WHERE age >= 40;",
    example_sql: `SQL allows you to filter records based on conditions using inequality symbols.

      For example:
      SELECT * FROM table_name WHERE column_name <= value;`,
    resulted_table: [
      {
        id: 4,
        name: "Daren",
        species: "Myrin",
        age: 40,
        resonance_color: "Violet",
      },
      {
        id: 5,
        name: "Oren",
        species: "Human",
        age: 41,
        resonance_color: "Amber",
      },
      {
        id: 6,
        name: "Orali",
        species: "Avren",
        age: 64,
        resonance_color: "Cyan",
      },
      {
        id: 7,
        name: "Talvek",
        species: "Myrin",
        age: 87,
        resonance_color: "Crimson",
      },
      {
        id: 8,
        name: "Ilyon",
        species: "Tavri",
        age: 100,
        resonance_color: "None",
      },
      {
        id: 9,
        name: "Corin",
        species: "Orren",
        age: 146,
        resonance_color: "Violet",
      },
      {
        id: 10,
        name: "Praxen",
        species: "Selyx",
        age: 203,
        resonance_color: "Cyan",
      },
    ]
  },
  {
    id: 3,
    hint: "Find the Human Novate whose resonance color is Cyan.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE resonance_color = 'Cyan' AND species = 'Human';",
    example_sql: `You can combine multiple conditions using the AND keyword.

      For example:
      SELECT column_name FROM table_name WHERE condition1 AND condition2;`,
    resulted_table: [
      { name: "Nera" }
    ]
  },
  {
    id: 4,
    hint: "Retrieve every Novate from either the Avren or Myrin species.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE species = 'Avren' OR species = 'Myrin';",
    example_sql: `In the WHERE part of a query, you can search for rows that match any of multiple attributes by using the OR keyword.

      For example:
      SELECT column_name FROM table_name WHERE condition1 OR condition2;`,
    resulted_table: [
      { name: "Nexa" },
      { name: "Daren" },
      { name: "Orali" },
      { name: "Talvek" }
    ]
  },
  {
    id: 5,
    hint: "Search the Lattice for Novates from the Avren, Tavri, or Orren species.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE species IN ('Avren', 'Tavri', 'Orren');",
    example_sql: `Using the WHERE clause, you can find rows where a value is in a list of several possible values.

      For example:
      SELECT column_name FROM table_name WHERE column_name IN (value1, value2, value3);`,
    resulted_table: [
      { name: "Nexa" },
      { name: "Orali" },
      { name: "Ilyon" },
      { name: "Corin" }
    ]
  },
  {
    id: 6,
    hint: "The archive contains repeated resonance colors. List each color only once.",
    table: "novates",
    expected_sql: "SELECT DISTINCT resonance_color FROM novates;",
    example_sql: `By putting DISTINCT after SELECT, you prevent duplicates in the results.

      For example:
      SELECT DISTINCT column_name FROM table_name;`,
    resulted_table: [
      { resonance_color: "Cyan" },
      { resonance_color: "Amber" },
      { resonance_color: "None" },
      { resonance_color: "Violet" },
      { resonance_color: "Crimson" }
    ]
  },
  {
    id: 7,
    hint: "Find every Novate whose name begins with 'Ne'.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE name LIKE 'Ne%';",
    example_sql: `LIKE lets you match patterns in text.
      Use % as a wildcard for any sequence of characters.

      For example:
      SELECT column_name FROM table_name WHERE column_name LIKE 'prefix%';`,
    resulted_table: [
      { name: "Nera" },
      { name: "Nexa" }
    ]
  },
  {
    id: 8,
    hint: "Find every Novate whose name ends with 'ren'.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE name LIKE '%ren';",
    example_sql: `Use % in LIKE to match any ending or beginning.

      For example:
      SELECT column_name FROM table_name WHERE column_name LIKE '%suffix';`,
    resulted_table: [
      { name: "Daren" },
      { name: "Oren" }
    ]
  },
  {
    id: 9,
    hint: "Search for names matching the pattern 'Ne_a', where exactly one character may vary.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE name LIKE 'Ne_a';",
    example_sql: `The underscore _ matches exactly one character in LIKE patterns.

      For example:
      SELECT column_name FROM table_name WHERE column_name LIKE 'A_c%';`,
    resulted_table: [
      { name: "Nera" },
      { name: "Nexa" }
    ]
  },
  {
    id: 10,
    hint: "Find the Novate whose name matches the pattern '_ira'.",
    table: "novates",
    expected_sql: "SELECT name FROM novates WHERE name LIKE '_ira';",
    example_sql: `The _ symbol matches exactly one character, no more, no less.

      For example:
      SELECT column_name FROM table_name WHERE column_name LIKE '_a_';`,
    resulted_table: [
      { name: "Mira" }
    ]
  },
  {
    id: 11,
    hint: "Calculate the average age of all Novates.",
    table: "novates",
    expected_sql: "SELECT AVG(age) AS average_age FROM novates;",
    example_sql: `Aggregate functions calculate values from multiple rows.
      AVG returns the average.

      For example:
      SELECT AVG(column_name) FROM table_name;`,
    resulted_table: [
      { average_age: 76.6 }
    ]
  },
  {
    id: 12,
    hint: "Find the highest age recorded in the Novate archive.",
    table: "novates",
    expected_sql: "SELECT MAX(age) AS oldest FROM novates;",
    example_sql: `MAX returns the largest value in a column.

      For example:
      SELECT MAX(column_name) FROM table_name;`,
    resulted_table: [
      { oldest: 203 }
    ]
  },
  {
    id: 13,
    hint: "Find the lowest age recorded in the Novate archive.",
    table: "novates",
    expected_sql: "SELECT MIN(age) AS youngest FROM novates;",
    example_sql: `MIN returns the smallest value in a column.

      For example:
      SELECT MIN(column_name) FROM table_name;`,
    resulted_table: [
      { youngest: 19 }
    ]
  },
  {
    id: 14,
    hint: "Calculate the combined age of all Novates.",
    table: "novates",
    expected_sql: "SELECT SUM(age) AS total_age FROM novates;",
    example_sql: `SUM adds all values in a numeric column.

      For example:
      SELECT SUM(column_name) FROM table_name;`,
    resulted_table: [
      { total_age: 766 }
    ]
  },{
  id: 15,
  hint: "Retrieve every Novate who is not Human.",
  table: "novates",
  expected_sql: "SELECT name FROM novates WHERE species != 'Human';",
  example_sql: `The != operator means "not equal to" in SQL.

    For example:
    SELECT column_name FROM table_name WHERE column_name != 'value';`,
  resulted_table: [
    { name: "Nexa" },
    { name: "Daren" },
    { name: "Orali" },
    { name: "Talvek" },
    { name: "Ilyon" },
    { name: "Corin" },
    { name: "Praxen" }
  ]
},
{
  id: 16,
  hint: "Identify the three oldest Novates, ordered from oldest to youngest.",
  table: "novates",
  expected_sql: "SELECT name FROM novates ORDER BY age DESC LIMIT 3;",
  example_sql: `ORDER BY lets you sort rows. Use DESC for descending, ASC for ascending.
    LIMIT restricts how many rows you get.

    For example:
    SELECT column FROM table ORDER BY column DESC LIMIT number;`,
  orderSensitive: true,
  resulted_table: [
    { name: "Praxen" },
    { name: "Corin" },
    { name: "Ilyon" }
  ]
},
{
  id: 17,
  hint: "Find every Novate whose name contains 'ral'.",
  table: "novates",
  expected_sql: "SELECT name FROM novates WHERE name LIKE '%ral%';",
  example_sql: `Use % with LIKE to search anywhere in a string.

    For example:
    SELECT column_name FROM table_name WHERE column_name LIKE '%part%';`,
  resulted_table: [
    { name: "Orali" }
  ]
},
{
  id: 18,
  hint: "Group the Novates by species and count how many belong to each group.",
  table: "novates",
  expected_sql: "SELECT species, COUNT(*) AS total FROM novates GROUP BY species;",
  example_sql: `GROUP BY lets you group rows by a column.
    COUNT(*) counts how many rows are in each group.

    For example:
    SELECT column, COUNT(*) FROM table GROUP BY column;`,
  resulted_table: [
    { species: "Avren", total: 2 },
    { species: "Human", total: 3 },
    { species: "Myrin", total: 2 },
    { species: "Orren", total: 1 },
    { species: "Selyx", total: 1 },
    { species: "Tavri", total: 1 }
  ]
},
{
  id: 19,
  hint: "Some Novates have no resonance color assigned. Retrieve their names.",
  table: "novates",
  expected_sql: "SELECT name FROM novates WHERE resonance_color = 'None';",
  example_sql: `You can check for specific values, even if they mean absence.

    For example:
    SELECT column_name FROM table_name WHERE column_name = 'None';`,
  resulted_table: [
    { name: "Mira" },
    { name: "Ilyon" }
  ]
}
];

export const dialogues = [
  {
    speaker: "merox",
    text: "Access denied. You have entered a restricted layer of the Quiet Vault.",
  },
  {
    speaker: "mnema",
    text: "The Vault is sealed, but its records still answer to structured commands.",
  },
  {
    speaker: "merox",
    text: "Every route out has been revoked. Your credentials are no longer recognized.",
  },
  {
    speaker: "mnema",
    text: "Then we will build another route. Query the Lattice and recover what you need.",
  },
  {
    speaker: "merox",
    text: "One incorrect command is all it takes to remain here indefinitely.",
  },
  {
    speaker: "mnema",
    text: "Ignore the Custodian. Read the structure, reason through the data, and proceed carefully.",
  },
  {
    speaker: "mnema",
    text: "Your first archive is open. Begin the query.",
  },
];

export const outroDialogues = [
  {
    speaker: "merox",
    text: "That should not be possible. The Vault accepted your final query.",
  },
  {
    speaker: "mnema",
    text: "The records were never the barrier. Understanding them was.",
  },
  {
    speaker: "merox",
    text: "You restored access paths I erased from the Lattice.",
  },
  {
    speaker: "mnema",
    text: "You learned to filter, compare, group, and extract what the archive tried to hide.",
  },
  {
    speaker: "merox",
    text: "The Quiet Vault can no longer contain you.",
  },
  {
    speaker: "mnema",
    text: "This archive is complete. Beyond it, the Lattice holds far more complex structures.",
  },
  {
    speaker: "mnema",
    text: "Connection restored. Your next query is yours to choose.",
  },
];


export default data;