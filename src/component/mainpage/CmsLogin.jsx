import { useState } from 'react';
import { Modal } from 'react-bootstrap'


const CmsLogin = ({ isShow, onClose, setUsername, username, handleSubmit }) => {

    const [error, setError] = useState('');

    const submitUserName = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!username?.trim() || username?.trim() === "") {
            setError('Username is required!')
            isValid = false;
        }

        if (isValid) {
            handleSubmit();
        }
    }

    return (
        <>
            <Modal show={isShow} onHide={onClose} size='md'>
                <Modal.Header closeButton className='p-1'>
                    <b><h5 className='mx-2 mt-1 px-1'>State Login Form</h5></b>
                </Modal.Header>
                <Modal.Body className='px-2 py-0'>
                    <form onSubmit={submitUserName}>
                        <div className="ps-0 align-content-center m-3">
                            <label htmlFor="username" className='p-1 required-label'>Login id :</label>
                            <input
                                type="text"
                                className="aliceblue-bg form-control"
                                placeholder="Enter Username..."
                                name='username'
                                id='username'
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                            />
                            {error &&
                                <div className="required">
                                    {error}
                                </div>
                            }
                        </div>

                        <button type='submit' className='btn cms-login-btn w-100 mb-1'>
                            <b> <span>Login</span></b>
                        </button>

                    </form>


                </Modal.Body>
            </Modal>
        </>
    )
}

export default CmsLogin
