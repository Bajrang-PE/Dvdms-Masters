import React from 'react';

const States = ({ openLoginModal }) => {
  return (
    <section id="states" className="py-5 animate-on-scroll">
      <div className="container">
        <h2 className="text-center section-title">State Portal Access</h2>
        <p className="text-center text-muted mb-5">
          Login to your state-specific portal to access your dedicated drug management system
        </p>
        
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-map-marked-alt fa-3x text-primary mb-3"></i>
                  <h3>State-Specific Access</h3>
                  <p className="text-muted">
                    Each state has a dedicated portal. Enter your username to be redirected to 
                    your state's application with your state-specific data.
                  </p>
                </div>
                
                <div className="text-center">
                  <button className="btn btn-primary btn-lg px-5" onClick={openLoginModal}>
                    <i className="fas fa-sign-in-alt me-2"></i>Access State Portal
                  </button>
                  {/* <p className="text-muted mt-3">
                    Username format: <code>statecode_username</code> (e.g., MH_rajesh for Maharashtra)
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default States;