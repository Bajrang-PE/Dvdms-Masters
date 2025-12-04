import React from 'react'
import DataTable from '../../../../commons/Datatable';
import DatePicker from 'react-datepicker';

const BankMaster = () => {
  return (
    <div>
       {/* <DataTable
          masterName={'Rate Contract'}
          ref={dataTableRef}
          columns={columns}
          data={data}
        /> */}

        <DatePicker selected={'02/01/2020'} onChange={(date) => console.log(date)} />
    </div>
  )
}

export default BankMaster;
