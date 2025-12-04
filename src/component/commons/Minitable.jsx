import React from 'react';

export default function MiniTable({ columns, data }) {
  if (data.length === 0) {
    return <div className="mini-table-wrapper no-data">No data available</div>;
  }

  return (
    <div className="mini-table-wrapper vertical-table">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="vertical-table-row">
          {columns.map(({ key, label }) => (
            <div key={key} className="vertical-table-cell">
              <span className="label">{label}</span>
              <span className="value">{row[key]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
