const data = [
  {
    id: 1,
    hint: "Wise, the elders are. Older than 100, find them you must.",
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
    hint: "Masters, 40 years or more, they must be.",
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
    hint: "Green blade, and Human — rare, that is.",
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
    hint: "Togruta or Zabrak — allies from distant worlds.",
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
    hint: "From many species they come — Togruta, Nautolan, Kel Dor.",
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
    hint: "Different, the lightsaber colors are. List them, you must.",
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
    hint: "Begins with 'Lu', the name must. Seek them, you will.",
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
    hint: "Ends with 'Ti', their names do. Find them, you must.",
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
    hint: "Only one letter hidden, the name has. 'A_soka' it must match.",
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
    hint: "Mysterious is a name: '_i_ Fisto', it sounds.",
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
    hint: "The average age of Jedi learners, know it you must.",
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
    hint: "The oldest, who is? Maximum age, find you shall.",
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
    hint: "The youngest Padawan, curious you are.",
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
    hint: "Total the ages, for strength in numbers there is.",
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
  hint: "Padawans not Human, reveal them you must.",
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
  hint: "Top 3 oldest, ranked they are.",
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
  hint: "Names contain 'Sky', they do. Search within, you must.",
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
  hint: "Species, group by them. Count, you will.",
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
  hint: "No lightsaber, some have. Reveal them, you will.",
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
    speaker: "vader",
    text: "You are trapped in the SQL prison. You can't escape."
  },
  {
    speaker: "yoda",
    text: "Simple, the path may not be. But impossible, it is not.",
  },
  {
    speaker: "vader",
    text: "The only way forward is through knowledge... of SQL.",
  },
  {
    speaker: "yoda",
    text: "Strong in the database, one must be. Or trapped, one will stay.",
  },
  {
    speaker: "vader",
    text: "Fail, and you will remain in my grasp forever. As others have before you.",
  },
  {
    speaker: "yoda",
    text: "Believe in the code, young learner. The Force is with you.",
  },
  {
    speaker: "yoda",
    text: "Your journey begins. Solve, you must, to be free.",
  },
];

export const outroDialogues = [
  {
    speaker: "vader",
    text: "Impossible... You broke through the queries. You escaped.",
  },
  {
    speaker: "yoda",
    text: "Through knowledge and code, free you are.",
  },
  {
    speaker: "vader",
    text: "The data bends to your will. But know this... the dark side lurks in lazy joins.",
  },
  {
    speaker: "yoda",
    text: "Clever with clauses, precise with logic — a true master, you’ve become.",
  },
  {
    speaker: "vader",
    text: "This prison can hold you no longer. But the database... is endless.",
  },
  {
    speaker: "yoda",
    text: "Always more to learn, there is. But this challenge, conquered you have.",
  },
  {
    speaker: "yoda",
    text: "May the SQL be with you, always."
  }
];


export default data;