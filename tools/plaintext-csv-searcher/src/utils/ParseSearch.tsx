// Queries in the format:
// __value__ OPERATOR __col__
// Search is a series of these queries seperated by commas
// OPERATORs ([] = done): [IN], BEFORE, AFTER, [EXACT], GREATER, LESS
// Queries can be grouped together, (like <query, query, etc>) so that entries must match all params in that group
// Values are either a string, number (float), amount of time (i.e 10y, 5m, 5w, 5d), or date (MM/DD/YYYY)
// col are any coloums in dataset in

import { Row, getItemIndex } from "../structs/Row";
import moment from "moment";

export interface ParsedQuery {
  value: string;
  col: string;
  opp: string;
}

// searches are case insenstive
export function ParseSearch(
  search_query: String,
  d: Array<Row>,
): Array<Row> | null {
  let coloums = d[0];
  var data = structuredClone(d);
  data.forEach((d: Row) => {
    d.display = false;
  });
  let query_groups = search_query.match(/(?<=<)(.*)(?=>)/g);
  search_query = search_query.replaceAll(/(?<=<)(.*)(?=>)/g, "");
  search_query = search_query.replaceAll("<", "");
  search_query = search_query.replaceAll(">", "");
  var general_queries: Array<Array<string>> = [];
  search_query.split(",").forEach((sq) => {
    var a = [];
    a.push(sq);
    if (sq !== "") {
      general_queries.push(a);
    }
  });
  query_groups?.forEach((qg) => {
    var a = qg.replaceAll("<", "");
    var a = a.replaceAll(">", "");
    general_queries.push(a.split(","));
  });
  console.log(general_queries);
  data.forEach((row: Row, rowIndex: number) => {
    var test_results: Array<boolean> = [];
    general_queries.forEach((query_group) => {
      var shouldKeep: boolean | null = null;
      query_group.forEach((query) => {
        var parsedQuery: ParsedQuery | null = parseQuery(query);
        if (parsedQuery === null) return;
        let c: number = getItemIndex(coloums, { value: parsedQuery.col });
        if (row.values.length !== coloums.values.length) {
          row.display = false;
          return;
        }
        if (keepRow(row, c, parsedQuery) && shouldKeep !== false) {
          shouldKeep = true;
        } else {
          shouldKeep = false;
        }
      });
      test_results.push(shouldKeep ?? false);
    });
    console.log(test_results);
    row.display = test_results.filter((a) => a === true).length !== 0;
  });
  return data;
}

function parseQuery(query: string): null | ParsedQuery {
  let head = query.match(/__(.*?)__/g);
  if (head === null || head.length != 2) {
    return null;
  }
  let value: string = head[0].toString();
  let col: string = head[1].toString();
  query = query.replaceAll(value, "");
  query = query.replaceAll(col, "");
  value = value.replaceAll("_", "");
  col = col.replaceAll("_", "");
  query = query.replaceAll(" ", "");
  let opp = query;
  return {
    value: value,
    opp: opp,
    col: col,
  };
}
function keepRow(
  row: Row,
  coloumIndex: number,
  parsedQuery: ParsedQuery,
): boolean {
  if (
    coloumIndex === -1 ||
    coloumIndex > row.values.length ||
    row.values[coloumIndex] === undefined ||
    row.values[coloumIndex].value === undefined
  ) {
    console.log("WHHOPS");
    console.log(coloumIndex);
    console.log(row.values);
    console.log(parsedQuery);
    return false;
  }
  if (
    parsedQuery.opp === "IN" &&
    row.values[coloumIndex].value
      .toLowerCase()
      .includes(parsedQuery.value.toLowerCase())
  ) {
    return true;
  }
  if (
    parsedQuery.opp === "EXACT" &&
    parsedQuery.value.toLowerCase() ===
      row.values[coloumIndex].value.toLowerCase()
  ) {
    return true;
  }
  if (parsedQuery.opp === "BEFORE" || parsedQuery.opp === "AFTER") {
    let value_date = moment(parsedQuery.value, "MM/DD/YYYY");
    let col_date = moment(
      row.values[coloumIndex].value.toString(),
      "MM/DD/YYYY",
    );
    if (!value_date.isValid() || !col_date.isValid()) {
      console.log(parsedQuery.value);
      console.log(row.values[coloumIndex].value.toString());
      console.log("INVALID-DATE");
      return false;
    }

    if (parsedQuery.opp === "BEFORE" && col_date.unix() < value_date.unix()) {
      return true;
    }
    if (parsedQuery.opp === "AFTER" && col_date.unix() > value_date.unix()) {
      return true;
    }
  }
  return false;
}
