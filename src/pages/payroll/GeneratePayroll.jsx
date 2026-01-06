import { useEffect, useState } from "react";
import { payrollApi } from "../../api/payrollApi";
import { employeeApi, } from "../../api/employeeApi";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const GeneratePayroll = () => {
  const {id} = useParams();

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    employeeApi.getAllEmployee().then(res => {
      setEmployees(res.data.data);
       if (id) {
          setEmployeeId(id);
        } else if (res?.data.length > 0) {
          setEmployeeId(res?.data[0].id);
        }
    }).catch(err => {
      setError("Failed to load employees");
    });
  }, []);

  const generate = async () => {
    if (!employeeId) {
      setError("Please select an employee");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await payrollApi.generate(employeeId, month, year);
      setSuccess("Payroll generated successfully");

      setEmployeeId("");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to generate payroll");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Generate Payroll</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Employee</Form.Label>
              <Form.Select value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Month</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate Payroll"}
        </Button>
      </Form>
    </Container>
  );
};

export default GeneratePayroll;
