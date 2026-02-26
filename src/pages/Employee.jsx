import { useState, useEffect, useCallback } from "react";
import { Button, Card, Container, Table, Form, Badge, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { employeeApi } from "../api/employeeApi";
import { FaSearch, FaUserPlus, FaUsers, FaBuilding, FaCalendarAlt, FaEnvelope, FaUserTie } from "react-icons/fa";
import './Employee.css';

const Employee = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isAdminOrHr = ["ROLE_ADMIN", "ROLE_HR", "ROLE_MANAGER"].includes(user?.role);

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (id) {
        // response = await employeeApi.getEmployeeByDepartment(id);
      } else {
        response = await employeeApi.getAllEmployee();
      }
      if (response.data?.data) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.designation || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusColor = status === "ACTIVE" ? "success" : status === "INACTIVE" ? "danger" : "warning";
    return <Badge bg={statusColor} className="px-3 py-1">{status || "ACTIVE"}</Badge>;
  };

  return (
    <Container fluid className="employee-management-container">
      {/* PAGE HEADER */}
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="page-title-section">
            <div className="d-flex align-items-center gap-3">
              <div className="page-icon">
                <FaUsers />
              </div>
              <div>
                <h1 className="page-title mb-1">Employee Management</h1>
                <p className="page-subtitle text-muted mb-0">
                  Manage your organization's workforce efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="search-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div className="search-section">
              <InputGroup className="search-input-group">
                <InputGroup.Text className="search-icon">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search employees by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </InputGroup>
            </div>
            
            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">{filteredEmployees.length}</div>
                <div className="stat-label">Total Employees</div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="employees-table-card">
        <Card.Header className="table-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Employee Directory</h5>
            <Badge bg="primary" className="employee-count-badge">
              {filteredEmployees.length} Employees
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="loading-placeholder text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading employees...</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="table-responsive desktop-table">
                <Table hover className="employee-table align-middle">
                  <thead>
                    <tr>
                      <th className="employee-column">Employee</th>
                      <th className="position-column">
                        <FaUserTie className="me-2" />
                        Position
                      </th>
                      <th className="department-column">
                        <FaBuilding className="me-2" />
                        Department
                      </th>
                      <th className="status-column">Status</th>
                      <th className="date-column">
                        <FaCalendarAlt className="me-2" />
                        Join Date
                      </th>
                      <th className="actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length ? (
                      filteredEmployees.map(emp => (
                        <tr
                          key={emp.id}
                          className="employee-row"
                          onClick={() => navigate(`/employees/${emp.id}/profile`)}
                        >
                          <td>
                            <div className="employee-info">
                              <div className="employee-avatar">
                                {emp.avatar ? (
                                  <img
                                    src={emp.avatar.startsWith('http') ? emp.avatar : "Raynxsystemslogo.png"}
                                    alt={emp.firstName}
                                    className="avatar-img"
                                    onError={(e) => {
                                      console.log('Image failed to load:', emp.avatar);
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                    onLoad={(e) => {
                                      console.log('Image loaded successfully:', emp.avatar);
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="avatar-placeholder" 
                                  style={{ display: emp.avatar ? 'none' : 'flex' }}
                                >
                                  {emp.firstName?.charAt(0) || ''}{emp.lastName?.charAt(0) || ''}
                                </div>
                                <div className="avatar-status"></div>
                              </div>
                              <div className="employee-details">
                                <div className="employee-name">
                                  {emp.firstName} {emp.lastName}
                                </div>
                                <div className="employee-email">
                                  <FaEnvelope className="me-1" />
                                  {emp.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="position-info">
                              {emp.designation || 'Not Assigned'}
                            </div>
                          </td>
                          
                          <td>
                            <div className="department-info">
                              {emp.departmentName || 'Not Assigned'}
                            </div>
                          </td>
                          
                          <td>
                            {getStatusBadge(emp.status)}
                          </td>
                          
                          <td>
                            <div className="date-info">
                              {emp.joiningDate
                                ? new Date(emp.joiningDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : "N/A"}
                            </div>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="action-btn salary-btn"
                                title="Create Salary Structure"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/payroll/salary-structure/create/${emp.id}`);
                                }}
                                disabled={!isAdminOrHr}
                              >
                                <FaUserTie className="me-1" />
                                Salary
                              </Button>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="action-btn payroll-btn"
                                title="Generate Payroll"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/payroll/generate/${emp.id}`);
                                }}
                                disabled={!isAdminOrHr}
                              >
                                <FaCalendarAlt className="me-1" />
                                Payroll
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="no-data">
                            <FaUsers className="no-data-icon mb-3" />
                            <h5>No employees found</h5>
                            <p className="text-muted">
                              {searchTerm ? 'Try adjusting your search terms' : 'No employees in the system yet'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* MOBILE VIEW */}
              <div className="mobile-list d-md-none">
                {filteredEmployees.map(emp => (
                  <div
                    className="mobile-employee-card"
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}/profile`)}
                  >
                    <div className="mobile-card-header">
                      <div className="mobile-avatar">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar.startsWith('http') ? emp.avatar : `http://localhost:8080${emp.avatar}`}
                            alt={emp.firstName}
                            className="mobile-avatar-img"
                            onError={(e) => {
                              console.log('Mobile image failed to load:', emp.avatar);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              console.log('Mobile image loaded successfully:', emp.avatar);
                            }}
                          />
                        ) : null}
                        <div 
                          className="mobile-avatar-placeholder" 
                          style={{ display: emp.avatar ? 'none' : 'flex' }}
                        >
                          {emp.firstName?.charAt(0) || ''}{emp.lastName?.charAt(0) || ''}
                        </div>
                        <div className="mobile-avatar-status"></div>
                      </div>
                      <div className="mobile-employee-info">
                        <div className="mobile-employee-name">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="mobile-employee-email">
                          {emp.email}
                        </div>
                        {getStatusBadge(emp.status)}
                      </div>
                    </div>

                    <div className="mobile-card-body">
                      <div className="mobile-details">
                        <div className="mobile-detail-item">
                          <FaUserTie className="detail-icon" />
                          <span>{emp.designation || 'Not Assigned'}</span>
                        </div>
                        <div className="mobile-detail-item">
                          <FaBuilding className="detail-icon" />
                          <span>{emp.departmentName || 'Not Assigned'}</span>
                        </div>
                        <div className="mobile-detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <span>
                            {emp.joiningDate
                              ? new Date(emp.joiningDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-card-footer">
                      <div className="mobile-actions">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="mobile-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payroll/salary-structure/create/${emp.id}`);
                          }}
                          disabled={!isAdminOrHr}
                        >
                          <FaUserTie className="me-1" />
                          Salary
                        </Button>

                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mobile-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payroll/generate/${emp.id}`);
                          }}
                          disabled={!isAdminOrHr}
                        >
                          <FaCalendarAlt className="me-1" />
                          Payroll
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Employee;
