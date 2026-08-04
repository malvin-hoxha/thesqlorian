import padawans from "../../data/table.js";

export function createPadawansDatabase(SQL, rows = padawans) {
  const database = new SQL.Database();

  database.run(`
    CREATE TABLE padawans (
      id INTEGER,
      name TEXT,
      species TEXT,
      age INTEGER,
      lightsaber_color TEXT
    );
  `);

  rows.forEach((padawan) => {
    database.run(
      `
        INSERT INTO padawans (
          id,
          name,
          species,
          age,
          lightsaber_color
        )
        VALUES (?, ?, ?, ?, ?);
      `,
      [
        padawan.id,
        padawan.name,
        padawan.species,
        padawan.age,
        padawan.lightsaber_color,
      ],
    );
  });

  return database;
}