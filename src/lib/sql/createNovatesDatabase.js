import novates from "../../data/table.js";

export function createNovatesDatabase(SQL, rows = novates) {
  const database = new SQL.Database();

  database.run(`
    CREATE TABLE novates (
      id INTEGER PRIMARY KEY,
      name TEXT,
      species TEXT,
      age INTEGER,
      resonance_color TEXT
    );
  `);

  rows.forEach((novate) => {
    database.run(
      `
        INSERT INTO novates (
          id,
          name,
          species,
          age,
          resonance_color
        )
        VALUES (?, ?, ?, ?, ?);
      `,
      [
        novate.id,
        novate.name,
        novate.species,
        novate.age,
        novate.resonance_color,
      ],
    );
  });

  return database;
}