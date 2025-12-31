import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'fas fa-capsules',
      title: 'Drug Section',
      description: 'Unified procurement and management of drugs, surgical items, and medical equipment for all state health facilities.'
    },
    {
      icon: 'fas fa-warehouse',
      title: 'Warehouses',
      description: 'State-specific storage and distribution networks ensuring timely delivery of drugs to health facilities across each state.'
    },
    {
      icon: 'fas fa-user-check',
      title: 'Empanelment',
      description: 'Registration and management of Indenters, Manufacturers, QC Labs, and other stakeholders with state-wise categorization.'
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Reports Section',
      description: 'Dynamic report generation based on state-specific requirements and user permissions with real-time data.'
    },
    {
      icon: 'fas fa-vial',
      title: 'QA Section',
      description: 'Quality assurance protocols and tracking for drugs across all states with standardized measurement systems.'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Account Section',
      description: 'Payment processing, bill management, and financial accounting with state-specific financial tracking.'
    }
  ];

  return (
    <section id="services" className="services-section animate-on-scroll">
      <div className="container">
        <h2 className="text-center section-title">Our Services</h2>
        <p className="text-center text-muted mb-5">
          Unified DVDMS provides a comprehensive suite of services to manage 
          the entire drug supply chain across all states efficiently.
        </p>
        
        <div className="row g-4">
          {services.map((service, index) => (
            <div key={index} className="col-md-4">
              <div className="service-card card p-4 h-100">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h4 className="text-center mb-3">{service.title}</h4>
                <p className="text-center">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;