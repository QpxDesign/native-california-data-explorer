import { Row } from "../structs/Row";
import { Item } from "../structs/Item";

function parseData(data: string): Array<Row> {
  var out: Array<Row> = [];
  data.split("\n").forEach((line: string) => {
    var a = line.split(",");
    var b: Array<Item> = [];
    a.forEach((i) => {
      let c: Item = {
        value: i,
      };
      b.push(c);
    });
    var r: Row = {
      display: true,
      values: b,
    };
    out.push(r);
  });
  return out;
}

export async function ReadFile(file: File): Promise<Array<Row>> {
  return file
    .text()
    .then((t) => {
      return parseData(t);
    })
    .catch((e: any) => {
      return [];
    });
}
