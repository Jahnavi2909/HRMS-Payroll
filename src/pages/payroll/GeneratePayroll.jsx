import { useEffect, useState } from "react";
import { payrollApi } from "../../api/payrollApi";
import { employeeApi } from "../../api/employeeApi";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

const GeneratePayroll = () => {
  const { id } = useParams();

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Generate last 5 years including current year
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];

  useEffect(() => {
    employeeApi
      .getAllEmployee()
      .then((res) => {
        const list = res.data?.data || [];
        setEmployees(list);

        if (id) {
          setEmployeeId(id);
        } else if (list.length > 0) {
          setEmployeeId(list[0].id);
        }
      })
      .catch(() => {
        setError("Failed to load employees");
      });
  }, [id]);

  const generatePayroll = async () => {
    if (!employeeId || !month || !year) {
      setError("Please select employee, month, and year");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await payrollApi.generate(employeeId, month, year);
      setSuccess("Payroll generated successfully");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate payroll"
      );
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
        {/* EMPLOYEE */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Employee</Form.Label>
              <Form.Select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* MONTH & YEAR */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Month</Form.Label>
              <Form.Select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                    disabled={
                      year === currentYear && m.value > currentMonth
                    }
                  >
                    {m.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Select
                value={year}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setMonth(""); 
                }}
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button onClick={generatePayroll} disabled={loading}>
          {loading ? "Generating..." : "Generate Payroll"}
        </Button>
      </Form>
    </Container>
  );
};

export default GeneratePayroll;
