import React from "react";
import { isISODateString, parseDate } from "./utilFunctions";

export default function MiniTable({ columns, data }) {
  if (data.length === 0) {
    return <div className="mini-table-wrapper no-data">No data available</div>;
  }

  return (
    <div className="mini-table-wrapper vertical-table">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="vertical-table-row">
          {columns.map(({ key, label }) => {
            console.log(typeof row[key]);
            return (
              <div key={key} className="vertical-table-cell">
                <span className="label">{label}</span>
                <span className="value">
                  {" "}
                  {isISODateString(row[key]) ? parseDate(row[key]) : row[key]}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
