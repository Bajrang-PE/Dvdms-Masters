import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5>Unified DVDMS</h5>
            <p>
              A unified drug and vaccine distribution management system for all states 
              ensuring efficient healthcare supply chain management.
            </p>
            {/* <div className="social-icons mt-3">
              <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
            </div> */}
          </div>
          
          <div className="col-lg-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white-50 text-decoration-none">Home</a></li>
              <li><a href="#about" className="text-white-50 text-decoration-none">About System</a></li>
              <li><a href="#services" className="text-white-50 text-decoration-none">Services</a></li>
              <li><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
              <li><a href="#states" className="text-white-50 text-decoration-none">State Access</a></li>
            </ul>
          </div>
          
          <div className="col-lg-4 mb-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2 text-primary">
                </i> Ministry of Health & Family Welfare, (Govt. of India)</li>
              <li className="mb-2"><i className="fas fa-phone me-2 text-primary"></i> +91-11-2306 0000</li>
              <li className="mb-2"><i className="fas fa-envelope me-2 text-primary"></i> support304@dvdms.gov.in</li>
              {/* <li><i className="fas fa-clock me-2 text-primary"></i> Mon-Fri: 9:00 AM - 6:00 PM</li> */}
            </ul>
          </div>
        </div>
        
        <hr className="mt-2 mb-2 bg-light" />
        
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-white-50">&copy; 2026 Unified DVDMS. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50">Developed and Hosted by CDAC, Noida</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;