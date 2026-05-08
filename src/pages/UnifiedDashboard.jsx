import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import '../css/UnifiedDashboard.css';

const UnifiedDashboard = () => {
  const [animatedStats, setAnimatedStats] = useState({
    activeDrug: 0,
    // quarantineDrug: 0,
    nearExpiry: 0,
    stockOut: 0,
    totalValue: 0,
    expiringToday: 0
  });

  // Animation effect for stats
  useEffect(() => {
    const targets = {
      activeDrug: 7050,
    //   quarantineDrug: 505,
      nearExpiry: 283,
      stockOut: 1194,
      totalValue: 2450000,
      expiringToday: 13
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        activeDrug: Math.min(Math.floor(targets.activeDrug * progress), targets.activeDrug),
        // quarantineDrug: Math.min(Math.floor(targets.quarantineDrug * progress), targets.quarantineDrug),
        nearExpiry: Math.min(Math.floor(targets.nearExpiry * progress), targets.nearExpiry),
        stockOut: Math.min(Math.floor(targets.stockOut * progress), targets.stockOut),
        totalValue: Math.min(Math.floor(targets.totalValue * progress), targets.totalValue),
        expiringToday: Math.min(Math.floor(targets.expiringToday * progress), targets.expiringToday)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Demand vs Consumption Chart Configuration
  const demandChartOptions = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      animation: {
        duration: 1500
      },
      borderRadius: 12
    },
    title: {
      text: null
    },
    xAxis: {
      categories: ['Oct 2025', 'Nov 2025', 'Dec 2025'],
      crosshair: true,
      labels: {
        style: {
          color: '#64748B',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      lineColor: '#E2E8F0',
      tickColor: '#E2E8F0'
    },
    yAxis: {
      min: 0,
      max: 2000,
      tickInterval: 400,
      title: {
        text: null
      },
      gridLineColor: '#E2E8F0',
      gridLineDashStyle: 'dash',
      labels: {
        style: {
          color: '#64748B',
          fontSize: '11px'
        }
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#1E293B',
        fontWeight: 500,
        fontSize: '12px'
      },
      symbolRadius: 6,
      symbolHeight: 12,
      symbolWidth: 12
    },
    series: [{
      name: 'Demand',
      data: [1628, 1500, 1314],
      color: '#3B82F6',
      borderRadius: 8,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{y}',
        style: {
          color: '#1E293B',
          fontWeight: 600,
          fontSize: '11px',
          textOutline: 'none'
        },
        y: -10
      }
    }, {
      name: 'Supplied',
      data: [1450, 1380, 1200],
      color: '#F59E0B',
      borderRadius: 8,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{y}',
        style: {
          color: '#1E293B',
          fontWeight: 600,
          fontSize: '11px',
          textOutline: 'none'
        },
        y: -10
      }
    }],
    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.1,
        groupPadding: 0.2,
        maxPointWidth: 50
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      shared: true,
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      borderRadius: 12,
      shadow: true,
      style: {
        color: '#1E293B',
        fontSize: '12px'
      }
    }
  };

  // Critical Insights Bar Chart
  const insightsChartOptions = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      animation: {
        duration: 1500
      },
      borderRadius: 12
    },
    title: {
      text: null
    },
    xAxis: {
      categories: ['Expiry Status'],
      labels: {
        enabled: false
      },
      lineColor: '#E2E8F0'
    },
    yAxis: {
      min: 0,
      max: 350,
      title: {
        text: null
      },
      gridLineColor: '#E2E8F0',
      gridLineDashStyle: 'dash',
      labels: {
        style: {
          color: '#64748B',
          fontSize: '11px'
        }
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#1E293B',
        fontWeight: 500,
        fontSize: '12px'
      },
      symbolRadius: 6
    },
    series: [{
      name: 'Expiring in 30 Days',
      data: [50],
      color: '#EF4444',
      borderRadius: 8,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{y} drugs',
        style: {
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '12px',
          textOutline: 'none'
        },
        inside: true
      }
    }, {
      name: 'Expiring in 1-6 Months',
      data: [283],
      color: '#F97316',
      borderRadius: 8,
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{y} drugs',
        style: {
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '12px',
          textOutline: 'none'
        },
        inside: true
      }
    }],
    credits: {
      enabled: false
    }
  };

  // Inventory Distribution Pie Chart
  const inventoryPieOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      animation: {
        duration: 1500
      },
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b> ({point.y})',
      backgroundColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      borderRadius: 12,
      shadow: true
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: {
            color: '#1E293B',
            fontWeight: 500,
            fontSize: '11px'
          }
        },
        showInLegend: true,
        innerSize: '60%',
        depth: 35
      }
    },
    series: [{
      name: 'Inventory',
      data: [
        {
          name: 'Active Stock',
          y: 7050,
          color: '#3B82F6'
        },
        {
          name: 'Quarantine',
          y: 505,
          color: '#F59E0B'
        },
        {
          name: 'Near Expiry',
          y: 283,
          color: '#EF4444'
        }
      ]
    }],
    credits: {
      enabled: false
    }
  };

  // Monthly Trend Line Chart
  const trendChartOptions = {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      animation: {
        duration: 1500
      }
    },
    title: {
      text: null
    },
    xAxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: {
        style: {
          color: '#64748B',
          fontSize: '11px'
        }
      },
      lineColor: '#E2E8F0'
    },
    yAxis: {
      title: {
        text: null
      },
      gridLineColor: '#E2E8F0',
      gridLineDashStyle: 'dash',
      labels: {
        style: {
          color: '#64748B',
          fontSize: '11px'
        }
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#1E293B',
        fontWeight: 500,
        fontSize: '11px'
      }
    },
    series: [{
      name: 'Consumption',
      data: [320, 415, 380, 470],
      color: '#10B981',
      lineWidth: 3,
      marker: {
        enabled: true,
        radius: 4,
        fillColor: '#FFFFFF',
        lineWidth: 2,
        lineColor: '#10B981'
      }
    }, {
      name: 'Demand',
      data: [350, 440, 410, 520],
      color: '#8B5CF6',
      lineWidth: 3,
      marker: {
        enabled: true,
        radius: 4,
        fillColor: '#FFFFFF',
        lineWidth: 2,
        lineColor: '#8B5CF6'
      }
    }],
    credits: {
      enabled: false
    }
  };

  // Gauge Chart for Stock Health
  const gaugeOptions = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      height: '200px'
    },
    title: null,
    pane: {
      center: ['50%', '70%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: '#E2E8F0',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, '#EF4444'],
        [0.5, '#F59E0B'],
        [0.9, '#10B981']
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
        style: {
          fontSize: '12px'
        }
      }
    },
    // plotOptions: {
    //   solidgauge: {
    //     dataLabels: {
    //       enabled: true,
    //       format: '<div style="text-align:center"><span style="font-size:25px">{y}%</span><br/><span style="font-size:12px;color:#64748B">Stock Health</span></div>',
    //       backgroundColor: 'none',
    //       borderWidth: 0,
    //       style: {
    //         color: '#1E293B',
    //         textOutline: 'none'
    //       }
    //     }
    //   }
    // },
    series: [{
      name: 'Health',
      data: [78],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px">{point.y}%</span><br/><span style="font-size:12px;color:#64748B">Stock Health</span></div>'
      }
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="p-4">
        {/* Top Stats Row */}
        <Row className="g-3 mb-4">
          <Col lg={3} md={4} sm={6}>
            <Card className="stat-card primary">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-capsules"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Active Stock</span>
                  <h3 className="stat-value">{animatedStats.activeDrug.toLocaleString()}</h3>
                  <div className="stat-trend positive">
                    <i className="fas fa-arrow-up"></i> 12% vs last month
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={4} sm={6}>
            <Card className="stat-card info">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Stock Out</span>
                  <h3 className="stat-value">{animatedStats.stockOut}</h3>
                  <div className="stat-trend critical">
                    <i className="fas fa-bell"></i> Critical
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={4} sm={6}>
            <Card className="stat-card success">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Inventory Value</span>
                  <h3 className="stat-value">${(animatedStats.totalValue / 1000000).toFixed(1)}M</h3>
                  <div className="stat-trend positive">
                    <i className="fas fa-arrow-up"></i> +5.2%
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={4} sm={6}>
            <Card className="stat-card purple">
              <Card.Body>
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Expiring Today</span>
                  <h3 className="stat-value">{animatedStats.expiringToday}</h3>
                  <div className="stat-trend danger">
                    <i className="fas fa-exclamation-circle"></i> Action needed
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="chart-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Demand vs Supply Analysis</h5>
                  <small className="text-muted">Last 3 months comparison</small>
                </div>
                <Badge bg="primary" pill className="px-3 py-2">
                  <i className="fas fa-chart-bar me-1"></i> Q4 2025
                </Badge>
              </Card.Header>
              <Card.Body>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={demandChartOptions}
                />
              </Card.Body>
              <Card.Footer className="bg-white border-0 pt-0">
                <div className="d-flex justify-content-between">
                  <div><small className="text-muted">Demand Fulfillment Rate: 87.5%</small></div>
                  <div><small className="text-muted">vs 84.2% last quarter</small></div>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="chart-card">
              <Card.Header>
                <h5 className="mb-0">Inventory Distribution</h5>
                <small className="text-muted">Current stock breakdown</small>
              </Card.Header>
              <Card.Body>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={inventoryPieOptions}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row className="g-4 mb-4">
          <Col lg={4}>
            <Card className="chart-card">
              <Card.Header>
                <h5 className="mb-0">Stock Health Gauge</h5>
                <small className="text-muted">Overall inventory status</small>
              </Card.Header>
              <Card.Body className="text-center">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={gaugeOptions}
                />
                <div className="health-indicators mt-3">
                  <div className="d-flex justify-content-between px-4">
                    <span><Badge bg="success" className="p-2"></Badge> Good</span>
                    <span><Badge bg="warning" className="p-2"></Badge> Warning</span>
                    <span><Badge bg="danger" className="p-2"></Badge> Critical</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="chart-card">
              <Card.Header>
                <h5 className="mb-0">Expiry Insights</h5>
                <small className="text-muted">Critical expiry alerts</small>
              </Card.Header>
              <Card.Body>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={insightsChartOptions}
                />
                <div className="expiry-summary mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Urgent (30 days)</span>
                    <span className="fw-bold text-danger">50 drugs</span>
                  </div>
                  <ProgressBar now={15} variant="danger" className="mb-3" style={{ height: '8px' }} />
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Near Expiry (1-6 months)</span>
                    <span className="fw-bold text-warning">283 drugs</span>
                  </div>
                  <ProgressBar now={85} variant="warning" className="mb-3" style={{ height: '8px' }} />
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Healthy Stock</span>
                    <span className="fw-bold text-success">4717 drugs</span>
                  </div>
                  <ProgressBar now={92} variant="success" style={{ height: '8px' }} />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="chart-card">
              <Card.Header>
                <h5 className="mb-0">Weekly Trends</h5>
                <small className="text-muted">Consumption vs Demand</small>
              </Card.Header>
              <Card.Body>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={trendChartOptions}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts and Activity Section */}
        <Row className="g-4">
          <Col lg={8}>
            <Card className="alerts-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Active Alerts & Notifications</h5>
                  <small className="text-muted">Real-time system alerts</small>
                </div>
                <Badge bg="danger" pill>13 New</Badge>
              </Card.Header>
              <Card.Body>
                <div className="alerts-grid">
                  <div className="alert-item urgent">
                    <div className="alert-icon bg-danger">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="alert-details">
                      <h6>Near Expiry (Last 30 Days)</h6>
                      <p>13 drugs are expiring within 30 days in active stock</p>
                      <div className="alert-meta">
                        <Badge bg="danger" pill>Urgent</Badge>
                        <small className="text-muted">2 min ago</small>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item warning">
                    <div className="alert-icon bg-warning">
                      <i className="fas fa-truck"></i>
                    </div>
                    <div className="alert-details">
                      <h6>PO & Delivery Delays</h6>
                      <p>0 PO delay | 0 Partial delay - All on schedule</p>
                      <div className="alert-meta">
                        <Badge bg="success" pill>On Track</Badge>
                        <small className="text-muted">15 min ago</small>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item info">
                    <div className="alert-icon bg-info">
                      <i className="fas fa-snowflake"></i>
                    </div>
                    <div className="alert-details">
                      <h6>Freeze Pending Items</h6>
                      <p>38 items awaiting freeze confirmation</p>
                      <div className="alert-meta">
                        <Badge bg="warning" pill>Pending</Badge>
                        <small className="text-muted">1 hour ago</small>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item primary">
                    <div className="alert-icon bg-primary">
                      <i className="fas fa-flask"></i>
                    </div>
                    <div className="alert-details">
                      <h6>Sample Batch Pending</h6>
                      <p>24 sample batches waiting at warehouse</p>
                      <div className="alert-meta">
                        <Badge bg="info" pill>In Review</Badge>
                        <small className="text-muted">3 hours ago</small>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item secondary">
                    <div className="alert-icon bg-secondary">
                      <i className="fas fa-ship"></i>
                    </div>
                    <div className="alert-details">
                      <h6>Freight Pending</h6>
                      <p>0 shipments pending (1 active in 3 days)</p>
                      <div className="alert-meta">
                        <Badge bg="success" pill>All Clear</Badge>
                        <small className="text-muted">5 hours ago</small>
                      </div>
                    </div>
                  </div>

                  <div className="alert-item dark">
                    <div className="alert-icon bg-dark">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div className="alert-details">
                      <h6>Documentation Pending</h6>
                      <p>12 invoices awaiting approval</p>
                      <div className="alert-meta">
                        <Badge bg="warning" pill>Action Required</Badge>
                        <small className="text-muted">1 day ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <div className="text-center">
                  <a href="/alerts" className="text-decoration-none">View All Alerts <i className="fas fa-arrow-right ms-1"></i></a>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="quick-actions-card">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
                <small className="text-muted">Frequently used operations</small>
              </Card.Header>
              <Card.Body>
                <div className="action-buttons">
                  <button className="action-btn">
                    <div className="action-icon bg-primary">
                      <i className="fas fa-plus"></i>
                    </div>
                    <span>Add Stock</span>
                  </button>
                  <button className="action-btn">
                    <div className="action-icon bg-success">
                      <i className="fas fa-search"></i>
                    </div>
                    <span>Check Expiry</span>
                  </button>
                  <button className="action-btn">
                    <div className="action-icon bg-warning">
                      <i className="fas fa-file-export"></i>
                    </div>
                    <span>Generate Report</span>
                  </button>
                  <button className="action-btn">
                    <div className="action-icon bg-info">
                      <i className="fas fa-truck"></i>
                    </div>
                    <span>Track Order</span>
                  </button>
                  <button className="action-btn">
                    <div className="action-icon bg-danger">
                      <i className="fas fa-exclamation"></i>
                    </div>
                    <span>Report Issue</span>
                  </button>
                  <button className="action-btn">
                    <div className="action-icon bg-purple">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    <span>Analytics</span>
                  </button>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <div className="recent-activity">
                  <h6 className="mb-3">Recent Activity</h6>
                  <div className="activity-item">
                    <div className="activity-dot bg-success"></div>
                    <div className="activity-text">
                      <p className="mb-0">Stock updated for Paracetamol</p>
                      <small className="text-muted">5 minutes ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot bg-warning"></div>
                    <div className="activity-text">
                      <p className="mb-0">New order #INV-2025-0012</p>
                      <small className="text-muted">15 minutes ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot bg-info"></div>
                    <div className="activity-text">
                      <p className="mb-0">3 items near expiry</p>
                      <small className="text-muted">25 minutes ago</small>
                    </div>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnifiedDashboard;