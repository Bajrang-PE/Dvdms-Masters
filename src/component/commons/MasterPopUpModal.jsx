import React from 'react'
import { Modal } from 'react-bootstrap'

const MasterPopUpModal = (props) => {
    const { title, onCloseModal, column, data } = props
    return (
        <Modal show={true} onHide={onCloseModal} size={'xl'} dialogClassName="dialog-min" style={{ zIndex: "1201" }}>
            <Modal.Header closeButton className='py-1 px-2 cms-login'>
                <b><h6 className='m-1 p-0'>{title}</h6></b>
            </Modal.Header>
            <Modal.Body className='px-2 py-1'>
                <table className="table text-center mb-0 table-bordered" style={{ borderColor: "#23646e" }}>
                    <thead className="text-white">
                        <tr className='m-0' style={{ fontSize: "13px", verticalAlign: "middle" }}>
                            {column?.length > 0 && column?.map((clm, index) => (
                                <th className='p-2' key={index}>{clm?.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 && data?.map((dt, index) => (
                            <tr className='' style={{ fontSize: "12px" }} key={index}>
                                {column?.length > 0 && column?.map((clm, index) => (
                                    <td className='p-2' key={index}>{clm?.isJSX && clm?.ele ? clm?.ele(dt) : dt[clm?.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr className='my-2' />
                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={onCloseModal}>
                        <i className="fa fa-broom me-1"></i> Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MasterPopUpModal
