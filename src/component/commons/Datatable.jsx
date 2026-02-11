import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { InputField } from './FormElements';
import jsPDF from 'jspdf';

const DataTable = forwardRef(({ masterName, columns, data, isSearchReq = true, isPagination = true, isReport = true, handleRowSelect }, ref) => {
  const [sortedData, setSortedData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]); // now global indexes
  const [selectAll, setSelectAll] = useState(false);
  const [toggleToolbar, setToggleToolbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc',
  });

  // Expose selected rows' full data via ref
  useEffect(() => {
    setSortedData(data);
    setCurrentPage(1);
    setSelectedRows([]);
    setSelectAll(false);
  }, [data]);

  useImperativeHandle(ref, () => ({
    getSelectedRowsData: () => {
      return selectedRows.map(globalIndex => sortedData[globalIndex]);
    },
  }));

  useEffect(() => {
    if (handleRowSelect) {
      const selectedData = selectedRows.map(i => sortedData[i]);
      handleRowSelect(selectedData);
    }
  }, [selectedRows, sortedData]);

  // Handle Search
  const handleSearch = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = data.filter(row =>
      columns.some(col => {
        if (col?.isJSX) return false;
        const cellValue = row[col.field];
        return cellValue && cellValue.toString().toLowerCase().includes(query);
      })
    );

    setSortedData(filtered);
    setCurrentPage(1);
    setSelectedRows([]);
    setSelectAll(false);
  };

  // Handle Sorting
  const handleSort = column => {
    let direction = 'asc';
    if (sortConfig.field === column.field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (a[column.field] > b[column.field])
        return direction === 'asc' ? 1 : -1;
      if (a[column.field] < b[column.field])
        return direction === 'asc' ? -1 : 1;
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ field: column.field, direction });
    setCurrentPage(1); // reset page after sorting if you want
  };

  // Handle Page Change
  const handlePageChange = pageNumber => {
    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(sortedData.length / rowsPerPage)
    )
      return;
    setCurrentPage(pageNumber);
    setSelectAll(false);
    setSelectedRows([]); // Optional: reset selection on page change
  };
  // Handle Select Row by global index
  const handleSelectRow = localIndex => {
    const globalIndex = (currentPage - 1) * rowsPerPage + localIndex;

    if (selectedRows[0] === globalIndex) {
      setSelectedRows([]);
    } else {
      setSelectedRows([globalIndex]);
    }

    // console.log('globalIndex', globalIndex)
    // console.log('localIndex', localIndex)
    // let updatedSelectedRows = [...selectedRows];
    // if (updatedSelectedRows.includes(globalIndex)) {
    //   updatedSelectedRows = updatedSelectedRows.filter(i => i !== globalIndex);
    // } else {
    //   updatedSelectedRows.push(globalIndex);
    // }
    // setSelectedRows(updatedSelectedRows);

    // Update selectAll checkbox if all visible rows are selected
    // const visibleGlobalIndexes = currentRows.map(
    //   (_, idx) => (currentPage - 1) * rowsPerPage + idx
    // );
    // const allSelected = visibleGlobalIndexes.every(i =>
    //   updatedSelectedRows.includes(i)
    // );
    // setSelectAll(allSelected);
  };

  function getPaginationPages(currentPage, totalPages) {
    const delta = 2; // pages to show around current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  // Handle Select All Rows on Current Page
  const handleSelectAll = () => {
    const visibleGlobalIndexes = currentRows.map(
      (_, idx) => (currentPage - 1) * rowsPerPage + idx
    );
    if (selectAll) {
      // Deselect all visible rows
      setSelectedRows(prevSelected =>
        prevSelected.filter(i => !visibleGlobalIndexes.includes(i))
      );
      setSelectAll(false);
    } else {
      // Select all visible rows (add to existing selected)
      setSelectedRows(prevSelected => {
        const newSelected = [...prevSelected];
        visibleGlobalIndexes.forEach(i => {
          if (!newSelected.includes(i)) newSelected.push(i);
        });
        return newSelected;
      });
      setSelectAll(true);
    }
  };

  // Handle Download as Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  // Handle Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    const exportColumns = columns.filter(
      (col) => !col.isJSX
    );

    // Prepare columns and rows for autoTable
    const tableColumn = exportColumns.map(col => col.header);

    const tableRows = sortedData.map(row =>
      exportColumns.map(col => row[col.field] ?? '')
    );

    // call the autoTable function, passing doc as first argument
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 10,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [18, 119, 181],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 20, left: 10, right: 10 },
    });

    doc.save(`${masterName}.pdf`);
  };

  function handleToggler() {
    setToggleToolbar(prev => !prev);
  }

  // Handle Download as HTML
  const downloadHTML = () => {
    const exportColumns = columns.filter(
      (col) => !col?.isJSX
    );

    const html = `
      <table border="1">
        <thead>
          <tr>${exportColumns?.map(col => `<th>${col.header}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${sortedData
            .map(
              row => `
              <tr>
                ${exportColumns?.map(col => `<td>${row[col.field]}</td>`).join('')}
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, 'table.html');
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = isPagination ? sortedData?.slice(indexOfFirstRow, indexOfLastRow) : sortedData;

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedRows([]);
  };

  // Pagination buttons count
  const totalPages = sortedData
    ? Math.ceil(sortedData.length / rowsPerPage)
    : 0;

  return (
    <div className="datatable__container">

      {(isSearchReq || isReport) &&
        <div className="datatable-actions">
          {isSearchReq &&
            <div className="datatable-actions-search">
              <InputField
                type={'text'}
                value={searchQuery}
                onChange={handleSearch}
                placeholder={'Search..'}
                className={'datatable-actions-search--input'}
                id={'DatatableSearch'}
              />
            </div>
          }
          {isReport &&
            <>
              <span className="datatable-actions-toggler" onClick={handleToggler}>
                <FontAwesomeIcon icon={faSave} />
              </span>

              {toggleToolbar && (
                <div className="datatable-actions-buttons">
                  <button className="datatable-actions--btn" onClick={downloadExcel}>
                    Download Excel
                  </button>
                  <button className="datatable-actions--btn" onClick={downloadPDF}>
                    Download PDF
                  </button>
                  <button className="datatable-actions--btn" onClick={downloadHTML}>
                    Download HTML
                  </button>
                </div>
              )}
            </>
          }
        </div>
      }

      <div className="datatable__container--forTable">
        <table className="datatable">
          <thead>
            <tr>
              <th className="checkbox__col">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled
                />
              </th>
              {columns.map(col => (
                <th key={col.field}>
                  <span
                    onClick={() => { col?.isJSX || col?.ele ? null : handleSort(col) }}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    {col.header}
                    {sortConfig.field === col.field && (
                      <FontAwesomeIcon
                        icon={
                          sortConfig.direction === 'asc'
                            ? faArrowUp
                            : faArrowDown
                        }
                        style={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentRows && currentRows.length > 0 ? (
              currentRows.map((row, localIndex) => {
                const globalIndex = indexOfFirstRow + localIndex;
                return (
                  <tr
                    key={globalIndex}
                    className={
                      selectedRows.includes(globalIndex) ? 'selected' : ''
                    }
                  >
                    <td className="checkbox__col">
                      <input
                        type="checkbox"
                        // checked={selectedRows.includes(globalIndex)}
                        checked={selectedRows[0] === globalIndex}
                        onChange={() => handleSelectRow(localIndex)}
                      />
                    </td>
                    {columns.map(col => (
                      <>
                        <td key={col.field}>{col.isJSX && col?.ele ? col?.ele(row) : row[col?.field]}</td>
                      </>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ textAlign: 'center', padding: '1rem' }}
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rows per page selector */}
      {(sortedData && isPagination) && (
        <div className="datatable__paginationContainer">
          <label className="datatable__paginationContainer-text">
            Showing {indexOfFirstRow + 1}-
            {Math.min(indexOfLastRow, sortedData.length)} of {sortedData.length}{' '}
            entries
          </label>

          <div>
            <div className="datatable__paginationContainer-controls">
              <label
                className="datatable__paginationContainer-text"
                htmlFor="rowsPerPage"
              >
                Rows per page : &nbsp;
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="datatable__paginationContainer-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="datatable__paginationContainer-buttons">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={
                  currentPage === 1
                    ? { cursor: 'not-allowed' }
                    : { cursor: 'pointer' }
                }
                className="datatable__paginationContainer-buttons--btn"
              >
                Previous
              </button>

              {/* Page number buttons */}
              {getPaginationPages(currentPage, totalPages).map(
                (page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="pagination-ellipsis"
                      >
                        &hellip;
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`datatable__paginationContainer-buttons--btn datatable__paginationContainer-buttons--btn-pages ${page === currentPage ? 'active' : ''
                        }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="datatable__paginationContainer-buttons--btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DataTable;
