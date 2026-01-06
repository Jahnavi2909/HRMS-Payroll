import { useState, useEffect } from "react";
import { Button, Card, Container, Table, Form} from "react-bootstrap";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { employeeApi} from "../api/employeeApi";

const Employee = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isAdminOrHr = ["ROLE_ADMIN", "ROLE_HR", "ROLE_MANAGER"].includes(user?.role);

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [id]);

  const fetchEmployees = async () => {
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
    }
  };


  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>
        
      </div>

      <Card>
        <Card.Body>
          {/* SEARCH */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div style={{ width: "300px" }}>
              <Form.Control
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="table-responsive desktop-table">
            <Table hover className="align-middle table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length ? (
                  filteredEmployees.map(emp => (
                    <tr
                      key={emp.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/employees/${emp.id}/profile`)}
                    >
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={emp.avatar || "/profile.jpg"}
                            alt="Avatar"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: "10px"
                            }}
                          />
                          <div>
                            <div>{emp.firstName} {emp.lastName}</div>
                            <small className="text-muted">{emp.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{emp.designation}</td>
                      <td>{emp.departmentName}</td>
                      <td>{emp.status || "ACTIVE"}</td>
                      <td>
                        {emp.joiningDate
                          ? new Date(emp.joiningDate).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="d-flex gap-2">

                          <Button
                            // variant="link"
                            size="sm"
                            className="btn btn-success"
                            title="Create Salary Structure"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/payroll/salary-structure/create/${emp.id}`);
                            }}
                            disabled={!isAdminOrHr}
                          >
                           Create Salary Structure
                          </Button>

                          <Button
                            // variant="link"
                            size="sm"
                            type="button"
                            className="btn btn-primary"
                            title="Generate Payroll"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/payroll/generate/${emp.id}`);
                            }}
                            disabled={!isAdminOrHr}
                          >
                            Generate Payroll
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No employees found.
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
                className="mobile-card"
                key={emp.id}
                onClick={() => navigate(`/employees/${emp.id}/profile`)}
              >
                <img
                  src={emp.avatar || "/profile.jpg"}
                  alt="Avatar"
                  className="avatar mb-2"
                />

                <div className="value">{emp.firstName} {emp.lastName}</div>
                <div className="value text-muted">{emp.email}</div>

                <div className="actions d-flex gap-2 mt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-success p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pyroll/salary-structure/create/${emp.id}`);
                    }}
                  >
                    Create Salary Structure
                  </Button>

                  <Button
                    variant="link"
                    size="sm"
                    className="text-warning p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/payroll/generate/${emp.id}`);
                    }}
                  >
                   Generate Payroll
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Employee;
