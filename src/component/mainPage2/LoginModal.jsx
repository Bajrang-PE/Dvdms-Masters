import React, { useState } from 'react';

const LoginModal = ({ show, onClose, onLogin, setUsername, username }) => {

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!username?.trim() || username?.trim() === "") {
      setError('Username is required!')
      isValid = false;
    }

    if (isValid) {
      onLogin();
    }
  }

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title"><i className="fas fa-sign-in-alt me-2"></i>State Portal Login</h4>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-4">
              <i className="fas fa-user-circle fa-4x text-primary"></i>
              <p className="text-muted mt-2 fw-bold">Enter your username to access your state's DVDMS portal</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label required-label">Username :</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter your username"
                  required
                />
                {error &&
                  <div className="required">
                    {error}
                  </div>
                }
              </div>

              {/* <div className="mb-3">
                <label htmlFor="stateCode" className="form-label">State Code (Auto-detected)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="stateCode" 
                  value={stateCode}
                  placeholder="Will be auto-detected from username" 
                  readOnly 
                />
              </div> */}

              <button type="submit" className="login-btn mt-3">
                <i className="fas fa-sign-in-alt me-2"></i>Login to State Portal
              </button>
            </form>

            {/* <div className="mt-4">
              <p className="text-muted small">Examples of state codes:</p>
              <div className="d-flex flex-wrap">
                {stateExamples.map((state, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2">
                    {state.code} - {state.name}
                  </span>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;