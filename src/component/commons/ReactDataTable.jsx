import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { InputField } from './FormElements';


const ReactDataTable = (props) => {

    const { title, column, data, isSearchReq, isPagination } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortedData, setSortedData] = useState(data);

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSearch = event => {
        const query = event.target.value.toLowerCase();

        setSearchQuery(query);
        if (query && query !== '') {
            const filtered = data.filter(row =>
                column.some(col => {
                    const cellValue =
                        typeof col.selector === "function"
                            ? col.selector(row)
                            : row[col.selector];
                    return cellValue && cellValue.toString().toLowerCase().includes(query);
                })
            );
            setSortedData(filtered);
        } else {
            setSortedData(data);
            setSearchQuery(query);
        }



    };

    const tableCustomStyles = {
        table: {
            style: {
                border: '1px solid #d0d7de',
            },
        },
        headRow: {
            style: {
                color: '#ffffff',
                backgroundColor: '#097080 ',
                borderBottomColor: '#faf7f7ff',
                // paddingTop: "1px",
                fontWeight: "bold",
                //  paddingBottom:"1px"
            },
        },
        headCells: {
            style: {
                whiteSpace: "normal",
                wordBreak: "break-word",
                textOverflow: "unset",
                lineHeight: "1.2",
                paddingTop: "18px",
                paddingBottom: "8px",
                fontWeight: "bold"
            },
        },
    }

    return (
        <div>
            {/* <b><h4 className='datatable-header mx-3 py-1 mt-1 px-1'>{title}</h4></b> */}
            <div className='datatable-btns-his row mx-0 my-1 '>

                <div className="col-6 align-items-center p-0">
                    {/* <label className="col-form-label me-2">{dt('Search')} :</label> */}
                    <div className=''>
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
                    </div>
                </div>

            </div>

            <div className='py-0'>
                <DataTable
                    // title="User Data"
                    dense
                    striped
                    fixedHeader
                    persistTableHead={true}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    fixedHeaderScrollHeight='65vh'
                    columns={column}
                    data={sortedData}
                    pagination={isPagination}
                    // pointerOnHover
                    customStyles={tableCustomStyles}
                />
            </div>
        </div>
    );
};

export default ReactDataTable;
