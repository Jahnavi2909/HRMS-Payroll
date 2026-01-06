import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import { FaCalendarAlt,  FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone, FaUser, FaUserTag, FaUserTie } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";
import { employeeApi } from "../../api/employeeApi";




const EmployeeProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState({});


  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await employeeApi.getById(id || user.employeeId);
        setEmployee(response.data.data);
      } catch (error) {
        setError("Failed to load employee data");
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, [id, user.employeeId]);


  return (
    <div className="employee-profile">
      {error && <p className="text-danger">{error}</p>}

      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-avatar d-flex flex-column avatar" >
            
              <div className="avatar-placeholder">
                {`${employee?.firstName?.[0] || ""}${employee?.lastName?.[0] || ""}`.toUpperCase()}
              </div>

          </div>
          <div className="profile-meta">
            <h2>{employee.firstName || `${employee?.firstName || ""} ${employee.lastName || ""}`}</h2>
            <p className="text-muted">{employee.designation}</p>
            <div className="employee-meta">
              <span><FaIdCard className="me-2" /> Employee ID: {employee.employeeId || "N/A"}</span>
              <span><FaUserTie className="me-2" /> {employee.departmentName || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs className="mb-4 profile-tabs">
        <Tab eventKey="profile" title="Profile">
          <Row className="mt-4">
            <Col md={8}>
              <Card className="mb-4">
                <Card.Header>Personal Information</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-1"><FaUser className="me-2" /> <strong>First Name:</strong></p>
                      <p>{employee.firstName || "N/A"}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><FaUserTag className="me-2" /> <strong>Last Name:</strong></p>
                      <p>{employee.lastName || "N/A"}</p>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-1"><FaEnvelope className="me-2" /> <strong>Email:</strong></p>
                      <p>{employee.email || "N/A"}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><FaPhone className="me-2" /> <strong>Phone:</strong></p>
                      <p>{employee.phone || "N/A"}</p>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-1"><FaCalendarAlt className="me-2" /> <strong>Joining Date:</strong></p>
                      <p>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><FaCalendarAlt className="me-2" /> <strong>Date of Birth:</strong></p>
                      <p>{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><FaMapMarkerAlt className="me-2" /> <strong>Address:</strong></p>
                      <p>{employee.address || "N/A"}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
