export function formatSqlResult(resultSets) {
    if (resultSets.length === 0) {
        return [];
    }

    const { columns, values } = resultSets[0];
    //columns: ["name", "age"]
    /*values: [
    *       ["Yoda", 900],
    *       ["Grogu", 50],
    *   ],
    */  

    return values.map((row) =>
        Object.fromEntries(
            row.map((value, index) => [
                columns[index],
                value,
            ]),
        ),
    );
};