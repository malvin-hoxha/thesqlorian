import { compareSqlResults } from "./compareSqlResults.js";
import { executeQueryOnFreshDatabase } from "./executeQueryOnFreshDatabase.js";

export function evaluateQuery({SQL, userSql, expectedSql, rows, orderSensitive = false, columnNamesSensitive = false,}) {
    const actualRows = executeQueryOnFreshDatabase( SQL, userSql, rows, );

    const expectedRows = executeQueryOnFreshDatabase( SQL, expectedSql, rows, );

    const correct = compareSqlResults( actualRows, expectedRows, {
        orderSensitive,
        columnNamesSensitive,
    },);

    return { correct, actualRows, expectedRows, };

}