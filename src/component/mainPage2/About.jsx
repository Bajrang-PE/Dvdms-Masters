import React from 'react';

const About = () => {
  return (
    <section id="about" className="about-section animate-on-scroll">
      <div className="container">
        <h2 className="text-center section-title">About Unified DVDMS</h2>
        <p className="text-center text-muted mb-5">
          The Unified Drug & Vaccine Distribution Management System (DVDMS) is a unified platform 
          designed to streamline pharmaceutical supply chain management across all states. 
          Our system ensures efficient procurement, storage, quality control, and distribution of 
          medicines and medical supplies to public health facilities nationwide.
        </p>
        
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="feature-card card p-4 h-100">
              <div className="feature-icon">
                <i className="fas fa-database"></i>
              </div>
              <h4 className="text-center mb-3">Unified Platform</h4>
              <p className="text-center">
                Single application for all states with state-specific access and data segregation. 
                Users login with state credentials to access their dedicated portal.
              </p>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="feature-card card p-4 h-100">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 className="text-center mb-3">Secure & Compliant</h4>
              <p className="text-center">
                Built with security protocols to protect sensitive health data. 
                Compliant with pharmaceutical regulations and quality standards across all states.
              </p>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="feature-card card p-4 h-100">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h4 className="text-center mb-3">Real-time Analytics</h4>
              <p className="text-center">
                Comprehensive dashboard with real-time data visualization for inventory, 
                distribution, and quality metrics across all states.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;