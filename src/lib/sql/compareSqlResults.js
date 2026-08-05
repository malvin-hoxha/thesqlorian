function haveSameColumns(actualRow, expectedRow) {
    const actualColumns = Object.keys(actualRow);
    const expectedColumns = Object.keys(expectedRow);

    if (actualColumns.length !== expectedColumns.length) {
        return false;
    }

    return actualColumns.every((column, index) => column === expectedColumns[index]);
}

function areRowsEqual( actualRow, expectedRow, columnNamesSensitive,) {
    const actualColumns = Object.keys(actualRow);
    const expectedColumns = Object.keys(expectedRow);

    if (actualColumns.length !== expectedColumns.length) {
        return false;
    }

    if (columnNamesSensitive) {
        if (!haveSameColumns(actualRow, expectedRow)) {
            return false;
        }

        return actualColumns.every((column) => actualRow[column] === expectedRow[column],);
    }

    const actualValues = Object.values(actualRow);
    const expectedValues = Object.values(expectedRow);

    return actualValues.every(
        (value, index) => value === expectedValues[index],
    );
}

export function compareSqlResults(actualRows, expectedRows, options = {}) {

    const {orderSensitive = true, columnNamesSensitive = true,} = options;

    if (actualRows.length !== expectedRows.length) {
        return false;
    }

    if(orderSensitive) {
        return actualRows.every((actualRow, index) => areRowsEqual(actualRow, expectedRows[index], columnNamesSensitive))
    }

    const unmatchedExpectedRows = [...expectedRows];

    return actualRows.every((actualRow) => {
        const matchingRowIndex = unmatchedExpectedRows.findIndex(
            (expectedRow) => areRowsEqual(actualRow, expectedRow, columnNamesSensitive),
        );

        if (matchingRowIndex === -1) {
            return false;
        }

        unmatchedExpectedRows.splice(matchingRowIndex, 1);
        return true;
    });
}

/* To be equal
*   1. ίδιο αριθμό γραμμών,
*   2. ίδιες στήλες,
*   3. ίδια σειρά στηλών,
*   4. ίδιες τιμές,
*   5. ίδια σειρά γραμμών.   
*/