import React from 'react'
import { Modal } from 'react-bootstrap'

const GlobalModal = (props) => {

    const { title, Data, size, onClose } = props;


    return (
        <Modal show={true} onHide={onClose} size={size ? size : 'lg'} dialogClassName="dialog-min">
            <Modal.Header closeButton className='py-1 px-2'>
                {/* <b><h6 className='m-1 p-0'>
                    {`${title} >> View`}</h6></b> */}

            </Modal.Header>
            <Modal.Body className='px-2 py-1'>
                <Data />
                <hr className='my-2' />
                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={onClose}>
                        <i className="fa fa-broom me-1"></i> Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default GlobalModal;
