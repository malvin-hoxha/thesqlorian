function removeSqlComments(sql) {
  let insideSingleQuote = false;
  let result = "";

  for (let i = 0; i < sql.length; i++) {
    const character = sql[i];
    const nextCharacter = sql[i + 1];

    if (character === "'") {
      result += character;

      if (insideSingleQuote && nextCharacter === "'") {
        result += nextCharacter;
        i++;
        continue;
      }

      insideSingleQuote = !insideSingleQuote;
      continue;
    }

    if (
      !insideSingleQuote &&
      character === "-" &&
      nextCharacter === "-"
    ) {
      while (i < sql.length && sql[i] !== "\n") {
        i++;
      }

      if (i < sql.length) {
        result += "\n";
      }

      continue;
    }

    if (
      !insideSingleQuote &&
      character === "/" &&
      nextCharacter === "*"
    ) {
      i += 2;

      while (
        i < sql.length &&
        !(sql[i] === "*" && sql[i + 1] === "/")
      ) {
        i++;
      }

      i++;
      result += " ";
      continue;
    }

    result += character;
  }

  return result;
}

function hasMultipleStatements(sql) {
  const sqlWithoutComments = removeSqlComments(sql);

  let insideSingleQuote = false;

  for (let i = 0; i < sqlWithoutComments.length; i++) {
    const character = sqlWithoutComments[i];

    if (character === "'") {
      insideSingleQuote = !insideSingleQuote;
      continue;
    }

    if (character === ";" && !insideSingleQuote) {
      const remainingSql =
        sqlWithoutComments.slice(i + 1).trim();

      if (remainingSql !== "") {
        return true;
      }
    }
  }

  return false;
}


export function validateSqlStatement(sql) {
    const normalizedSql = sql.trim();

    if (normalizedSql == ""){
        return {
            valid: false,
            error: "Write a SQL query before running it."
        }
    }

    if (hasMultipleStatements(normalizedSql)) {
        return {
            valid: false,
            error: "Only one SQL statement is allowed.",
        };
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