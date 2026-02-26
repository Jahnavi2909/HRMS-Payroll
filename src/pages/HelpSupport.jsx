import { useState } from "react";
import { Container, Card, Accordion, Badge, Button, Row, Col, Alert } from "react-bootstrap";
import { FaQuestionCircle, FaSearch, FaEnvelope, FaPhone, FaBook, FaUserShield, FaClock, FaFileAlt, FaMoneyBillWave, FaUsers, FaKey, FaDesktop, FaMobileAlt, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import './HelpSupport.css';
import { useNavigate } from "react-router-dom";

const HelpSupport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("general");

  const navigate = useNavigate();

  const faqCategories = [
    {
      id: "general",
      name: "General",
      icon: <FaInfoCircle />,
      color: "primary",
      questions: [
        {
          id: "g1",
          question: "What is Raynx HRMS System?",
          answer: "Raynx HRMS is a comprehensive Human Resource Management System developed by Raynx Systems. It handles employee data, payroll processing, attendance tracking, leave management, and organizational operations in one centralized platform."
        },
        {
          id: "g2",
          question: "How do I reset my password in Raynx HRMS?",
          answer: "Click on 'Forgot Password' on the Raynx HRMS login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. For immediate assistance, contact your Raynx HRMS administrator."
        },
        {
          id: "g3",
          question: "What are the system requirements for Raynx HRMS?",
          answer: "Raynx HRMS works on any modern web browser (Chrome, Firefox, Safari, Edge) with internet connection. For mobile, use the latest versions of iOS or Android browsers. Recommended screen resolution: 1366x768 or higher."
        },
        {
          id: "g4",
          question: "Is Raynx HRMS available as a mobile app?",
          answer: "Yes! Raynx HRMS offers mobile apps for both Android and iOS devices. Download from Google Play Store or Apple App Store by searching 'Raynx HRMS'. Mobile apps provide core features like attendance marking, leave requests, and payslip viewing."
        }
      ]
    },
    {
      id: "account",
      name: "Account Management",
      icon: <FaUserShield />,
      color: "success",
      questions: [
        {
          id: "a1",
          question: "How do I update my profile information?",
          answer: "Navigate to your profile by clicking on your name in the top-right corner, then select 'Profile'. You can update personal information, contact details, and upload a profile picture."
        },
        {
          id: "a2",
          question: "How do I change my role permissions?",
          answer: "Role permissions can only be changed by administrators. Contact your HR department or system administrator if you need different access levels."
        },
        {
          id: "a3",
          question: "Is my data secure?",
          answer: "Yes, we use industry-standard encryption and security measures. All data is transmitted securely and stored in protected servers with regular backups."
        }
      ]
    },
    {
      id: "payroll",
      name: "Payroll",
      icon: <FaMoneyBillWave />,
      color: "warning",
      questions: [
        {
          id: "p1",
          question: "When will I receive my salary through Raynx HRMS?",
          answer: "Salaries are processed through Raynx HRMS typically on the last working day of each month. The exact date may vary based on your company's payroll schedule configured in Raynx HRMS and banking processing times."
        },
        {
          id: "p2",
          question: "How do I download my payslip from Raynx HRMS?",
          answer: "Log into Raynx HRMS, go to Payroll > Employee Payslips. Find the desired month and click 'Download PDF' when the status shows 'PAID'. Payslips are digitally signed and can be used for official purposes."
        },
        {
          id: "p3",
          question: "What deductions are shown in Raynx HRMS payslip?",
          answer: "Raynx HRMS deductions may include income tax (TDS), Provident Fund (PF), Employee State Insurance (ESI), professional tax, loans, and other authorized deductions. Each payslip provides a detailed breakdown of all deductions as per company policy."
        },
        {
          id: "p4",
          question: "How is overtime calculated in Raynx HRMS?",
          answer: "Overtime in Raynx HRMS is calculated based on hours worked beyond regular working hours, as per company policy configured in the system. Rates may vary for weekends and holidays. All overtime calculations comply with labor laws."
        },
        {
          id: "p5",
          question: "Can I access my salary history in Raynx HRMS?",
          answer: "Yes! Raynx HRMS maintains complete salary history. Go to Payroll > Employee Payslips to view all your historical payslips. You can also download Form 16, investment declarations, and other salary-related documents."
        }
      ]
    },
    {
      id: "attendance",
      name: "Attendance",
      icon: <FaClock />,
      color: "info",
      questions: [
        {
          id: "at1",
          question: "How do I mark my attendance in Raynx HRMS?",
          answer: "Attendance in Raynx HRMS can be marked through multiple methods: web dashboard login, mobile app check-in/out, biometric devices (if configured), or GPS-based location tracking. Contact your supervisor for the specific method used in your organization."
        },
        {
          id: "at2",
          question: "What if I forget to mark attendance in Raynx HRMS?",
          answer: "Contact your immediate supervisor or HR department immediately. They can help you mark attendance manually through Raynx HRMS admin panel or guide you through the correction process. Regular attendance marking is important for accurate payroll calculation."
        },
        {
          id: "at3",
          question: "How do I apply for leave through Raynx HRMS?",
          answer: "Navigate to Attendance > Leave Application in Raynx HRMS. Select leave type (casual, sick, earned, etc.), choose dates, provide reason, and upload supporting documents if required. Submit for approval. You'll receive notifications about the approval status via email and in-app notifications."
        },
        {
          id: "at4",
          question: "Can I view my attendance history in Raynx HRMS?",
          answer: "Yes! Raynx HRMS provides comprehensive attendance reports. Go to Attendance > Attendance History to view daily attendance, monthly summaries, leave balance, and attendance percentage. You can also download attendance reports for official purposes."
        }
      ]
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: <FaDesktop />,
      color: "danger",
      questions: [
        {
          id: "t1",
          question: "Raynx HRMS is running slow. What should I do?",
          answer: "Try clearing your browser cache, disabling browser extensions, or using a different browser. Check your internet connection speed. Ensure you're using the latest version of Raynx HRMS. If issues persist, contact Raynx Systems technical support at support@raynxsystems.com."
        },
        {
          id: "t2",
          question: "I can't log in to my Raynx HRMS account.",
          answer: "Verify your username and password are correct. Check if Caps Lock is on. Try resetting your password using 'Forgot Password'. Ensure your account is active and not locked. If still unable to login, contact your Raynx HRMS system administrator."
        },
        {
          id: "t3",
          question: "Raynx HRMS mobile app is not working properly.",
          answer: "Ensure you have the latest Raynx HRMS app version installed. Check your internet connection. Try restarting the app or your device. Clear app cache if needed. For specific issues, report to Raynx Systems support with error screenshots and device details."
        },
        {
          id: "t4",
          question: "How do I report bugs or suggest features in Raynx HRMS?",
          answer: "Raynx Systems values user feedback! Send your bug reports or feature suggestions to feedback@raynxsystems.com. Include screenshots, error messages, and detailed descriptions. Our development team reviews all submissions for future updates."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const contactOptions = [
    {
      icon: <FaEnvelope />,
      title: "Email Support",
      description: "Get help via email",
      value: "support@raynxsystems.com",
      action: "mailto:support@raynxsystems.com"
    },
    {
      icon: <FaPhone />,
      title: "Phone Support",
      description: "Call us for immediate help",
      value: "+91-98765-43210",
      action: "tel:+919876543210"
    },
    {
      icon: <FaBook />,
      title: "User Manual",
      description: "Download Raynx HRMS guide",
      value: "PDF Manual",
      action: "#"
    }
  ];

  return (
    <div className="help-support">
      <Container fluid className="p-4">
        {/* Header */}
        <div className="help-header text-center mb-5">
          <div className="help-icon mb-3">
            <FaQuestionCircle size={48} />
          </div>
          <h1 className="help-title">Help & Support Center</h1>
          <p className="help-subtitle">Find answers to common questions or get in touch with our support team</p>
        </div>

        {/* Search Bar */}
        <div className="search-section mb-4">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <Row className="quick-stats mb-5">
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <FaBook className="stat-icon text-primary mb-2" />
                <h3>{faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}</h3>
                <p>Total Articles</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <FaUsers className="stat-icon text-success mb-2" />
                <h3>24/7</h3>
                <p>Support Available</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <FaCheckCircle className="stat-icon text-info mb-2" />
                <h3>95%</h3>
                <p>Issues Resolved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <FaClock className="stat-icon text-warning mb-2" />
                <h3>&lt; 2hrs</h3>
                <p>Avg Response Time</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Categories */}
        <Row className="faq-section mb-5">
          <Col lg={8}>
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            
            {filteredCategories.length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaExclamationTriangle className="me-2" />
                No results found for "{searchTerm}". Try different keywords.
              </Alert>
            ) : (
              <Accordion activeKey={expandedCategory} onSelect={setExpandedCategory} >
                {filteredCategories.map((category) => (
                  <Accordion.Item 
                    key={category.id} 
                    eventKey={category.id}
                    className="faq-category p-3"
                  >
                    <Accordion.Header className="category-header">
                      <div className="d-flex align-items-center">
                        <div className={`category-icon bg-${category.color} text-white me-3`}>
                          {category.icon}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0">{category.name}</h5>
                          <small className="text-muted">{category.questions.length} articles</small>
                        </div>
                        <Badge bg={category.color} pill>
                          {category.questions.length}
                        </Badge>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="category-body">
                      {category.questions.map((item) => (
                        <Card key={item.id} className="faq-item mb-3">
                          <Card.Header className="faq-question">
                            <FaQuestionCircle className="me-2 text-primary" />
                            {item.question}
                          </Card.Header>
                          <Card.Body className="faq-answer">
                            {item.answer}
                          </Card.Body>
                        </Card>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Col>

          <Col lg={4}>
            <div className="contact-section">
              <h3 className="section-title mb-4">Need More Help?</h3>
              
              {contactOptions.map((option, index) => (
                <Card key={index} className="contact-card mb-3">
                  <Card.Body className="text-center">
                    <div className="contact-icon mb-3">
                      {option.icon}
                    </div>
                    <h5 className="contact-title">{option.title}</h5>
                    <p className="contact-description">{option.description}</p>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      href={option.action}
                      className="contact-btn"
                    >
                      {option.value}
                    </Button>
                  </Card.Body>
                </Card>
              ))}

              {/* Emergency Contact */}
              <Card className="emergency-contact mt-4">
                <Card.Header className="bg-danger text-white">
                  <FaExclamationTriangle className="me-2" />
                  Raynx HRMS Emergency Support
                </Card.Header>
                <Card.Body>
                  <p className="text-center mb-3">
                    For critical Raynx HRMS issues affecting multiple users or system downtime:
                  </p>
                  <Button variant="danger" className="w-100">
                    <FaPhone className="me-2" />
                    Raynx Emergency Hotline
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Quick Links */}
        <div className="quick-links-section p-3">
          <h3 className="section-title mb-4">Quick Links</h3>
          <Row className="p-3">
            <Col md={3} sm={6} className="mb-3">
              <Card className="quick-link-card text-center h-100" onClick={() => navigate("/payroll/documents")}>
                <Card.Body>
                  <FaFileAlt className="quick-link-icon text-primary mb-2" />
                  <h6>User Documentation</h6>
                  <small className="text-muted">Complete user guide</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="quick-link-card text-center h-100" onClick={() => navigate("/employee/settings")}>
                <Card.Body>
                  <FaKey className="quick-link-icon text-success mb-2" />
                  <h6>Password Reset</h6>
                  <small className="text-muted">Reset your password</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="quick-link-card text-center h-100">
                <Card.Body>
                  <FaEnvelope className="quick-link-icon text-warning mb-2" />
                  <h6>Contact HR</h6>
                  <small className="text-muted">HR department contact</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HelpSupport;
