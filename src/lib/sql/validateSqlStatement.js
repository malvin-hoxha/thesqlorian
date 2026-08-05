export function validateSqlStatement(sql) {
    const normalizedSql = sql.trim();

    if (normalizedSql == ""){
        return {
            valid: false,
            error: "Write a SQL query before running it."
        }
    }

    if (!/^SELECT\b/i.test(normalizedSql)) {
        return {
            valid: false,
            error: "Only SELECT queries are allowed.",
        };
    }

    return {
        valid: true,
        error: null
    }
}