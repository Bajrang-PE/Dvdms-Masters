import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-money-check-alt',
      title: 'Online Payment',
      description: 'Real-time payment processing from state accounts to suppliers with secure transaction tracking.'
    },
    {
      icon: 'fas fa-chart-pie',
      title: 'Dynamic Reports',
      description: 'Generate state-specific reports with real-time data visualization and custom parameters.'
    },
    {
      icon: 'fas fa-bell',
      title: 'Alert Management',
      description: 'Event-based and job-based alerts for inventory, expiry, and distribution notifications.'
    },
    {
      icon: 'fas fa-barcode',
      title: 'Barcode & Digital Signature',
      description: 'Inventory tracking with barcode scanning and secure document signing for authenticity.'
    }
  ];

  return (
    <section id="features" className="slider-section animate-on-scroll">
      <div className="container">
        <h2 className="text-center section-title">Key Features</h2>
        <p className="text-center text-muted mb-5">
          Advanced features designed to optimize drug distribution management across all states
        </p>
        
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="slider-item">
                <div className="slider-icon">
                  <i className={feature.icon}></i>
                </div>
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;