import React, { useState, useEffect } from "react";
import { Row } from "../structs/Row";
interface TableProps {
  data: Array<Row>;
}

export function Table(props: TableProps) {
  return (
    <table>
      {" "}
      {props.data.map((item1, index1) => {
        if (
          item1.display ||
          index1 === 0 //&&
          //item1.values.length === props.data[0].values.length
        )
          return (
            <tr key={index1}>
              {item1.values.map((item2) => {
                if (index1 == 0) {
                  return <th>{item2.value}</th>;
                } else {
                  return <td>{item2.value}</td>;
                }
              })}
            </tr>
          );
      })}
    </table>
  );
}
