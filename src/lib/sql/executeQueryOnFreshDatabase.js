import { createNovatesDatabase } from "./createNovatesDatabase.js";
import { formatSqlResult } from "./formatSqlResult.js";

export function executeQueryOnFreshDatabase( SQL, sql, rows, ) {
    const database = createNovatesDatabase(SQL, rows);

    try {
        const resultSets = database.exec(sql);

        return formatSqlResult(resultSets);
    } finally {
        database.close();
    }
}