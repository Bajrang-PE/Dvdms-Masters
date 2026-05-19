import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const DataTable1 = ({ columns, data, isPagination = true }) => {
  const [sortedData, setSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  useEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  // Generic Sorting logic
  const handleSort = (col) => {
    let direction = 'asc';
    if (sortConfig.field === col.field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sorted = [...sortedData].sort((a, b) => {
      if (a[col.field] > b[col.field]) return direction === 'asc' ? 1 : -1;
      if (a[col.field] < b[col.field]) return direction === 'asc' ? -1 : 1;
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ field: col.field, direction });
  };

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const currentRows = isPagination 
    ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) 
    : sortedData;

  return (
    <div className="datatable__container--forTable">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-2">
                  {col.header}
                  {sortConfig.field === col.field && (
                    <FontAwesomeIcon icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown} size="xs" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.isJSX ? col.ele(row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '1rem' }}>
                No Data Found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isPagination && totalPages > 1 && (
        <div className="datatable__paginationContainer">
          <button 
            className="datatable__paginationContainer-buttons--btn"
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
          > Previous </button>
          <span className="p-2">Page {currentPage} of {totalPages}</span>
          <button 
            className="datatable__paginationContainer-buttons--btn"
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
          > Next </button>
        </div>
      )}
    </div>
  );
};

export default DataTable1;