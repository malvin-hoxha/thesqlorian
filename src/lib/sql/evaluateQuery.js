import { compareSqlResults } from "./compareSqlResults.js";
import { executeQueryOnFreshDatabase } from "./executeQueryOnFreshDatabase.js";

export function evaluateQuery({
    SQL,
    userSql, expectedSql,
    rows, hiddenDatasets = [],
    orderSensitive = false,
    columnNamesSensitive = false
}) {
    const actualRows = executeQueryOnFreshDatabase( SQL, userSql, rows );
        
    const expectedRows = executeQueryOnFreshDatabase( SQL, expectedSql, rows );

    const visibleResultIsCorrect = compareSqlResults( actualRows, expectedRows,
        {
            orderSensitive,
            columnNamesSensitive,
        },
    );

    if (!visibleResultIsCorrect) {
        return {
            correct: false,
            actualRows,
            expectedRows,
        };
    }

    for (const hiddenRows of hiddenDatasets) {
        const hiddenActualRows = executeQueryOnFreshDatabase( SQL, userSql, hiddenRows );

        const hiddenExpectedRows = executeQueryOnFreshDatabase( SQL, expectedSql, hiddenRows );

        const hiddenResultIsCorrect = compareSqlResults( hiddenActualRows, hiddenExpectedRows,
            {
                orderSensitive,
                columnNamesSensitive,
            },
        );

        if (!hiddenResultIsCorrect) {
            return {
                correct: false,
                actualRows,
                expectedRows,
            };
        }
    }

    return {
        correct: true,
        actualRows,
        expectedRows,
    };
}