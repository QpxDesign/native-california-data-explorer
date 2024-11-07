import { Item } from "./Item";

export interface Row {
  display: boolean;
  values: Array<Item>;
}
export function getItemIndex(r: Row, needle: Item): number {
  var i = -1;
  r.values.forEach((r2, index) => {
    if (r2.value === needle.value) {
      i = index;
      return;
    }
  });
  return i;
}
