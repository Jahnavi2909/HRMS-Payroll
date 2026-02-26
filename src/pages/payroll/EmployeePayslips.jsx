import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { payrollApi } from "../../api/payrollApi";
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const EmployeePayslips = () => {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayslips();
  }, []);

  const loadPayslips = async () => {
    try {
      const res = await payrollApi.getEmployeePayrolls(user.employeeId);
      const payrollData = res.data || [];
      setPayrolls(payrollData);
      setFilteredPayrolls(payrollData);
    } catch (err) {
      setError("Failed to load payslips");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...payrolls];

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter((payroll) => {
        const payrollDate = new Date(payroll.year, payroll.month - 1);
        return payrollDate >= filters.startDate;
      });
    }
    if (filters.endDate) {
      filtered = filtered.filter((payroll) => {
        const payrollDate = new Date(payroll.year, payroll.month - 1);
        return payrollDate <= filters.endDate;
      });
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter((payroll) => payroll.netSalary >= filters.minAmount);
    }
    if (filters.maxAmount) {
      filtered = filtered.filter((payroll) => payroll.netSalary <= filters.maxAmount);
    }

    setFilteredPayrolls(filtered);
  };

  const download = async (id) => {
    try {
      const res = await payrollApi.downloadPayslip(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${id}.pdf`;
      link.click();
    } catch (err) {
      setError("Failed to download payslip");
    }
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading)
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Payslips</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}




      {filteredPayrolls.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          {payrolls.length === 0
            ? "No payslips available"
            : "No payslips found matching your filters."}
        </Alert>
      )}

      {filteredPayrolls.map((p) => (

        <Card
          key={p.id}
          className={`mb-3 shadow-sm ${p.status === "PAID" ? "cursor-pointer" : "opacity-75"
            }`}
          onClick={() => {
            if (p.status === "PAID") {
              window.location.href = `/payroll/preview/${p.id}`;
            }
          }}
        >
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <Card.Title>
                  Payslip: {p.month}/{p.year}
                </Card.Title>
                <Badge
                  bg={
                    p.status === "GENERATED"
                      ? "secondary"
                      : p.status === "PENDING_APPROVAL"
                        ? "warning"
                        : p.status === "APPROVED"
                          ? "info"
                          : p.status === "PAID"
                            ? "success"
                            : "dark"
                  }
                  className="mb-2"
                >
                  {p.status}
                </Badge>
              </Col>

              <Col md={3}>
                <div>Gross Salary: {formatCurrency(p.grossSalary)}</div>
                <div>Total Deductions: {formatCurrency(p.totalDeductions)}</div>
                <div
                  className={p.netSalary < 0 ? "text-danger fw-bold" : "fw-bold"}
                >
                  Net Salary: {formatCurrency(p.netSalary)}
                </div>
              </Col>

              <Col md={3}>
                <div>Total Working Days: {p.totalWorkingDays}</div>
                <div>Working Days: {p.workingDays}</div>
                <div>Present Days: {p.presentDays}</div>
              </Col>

              <Col md={2} className="text-end">
                {p.status === "PAID" ? (
                  <Button
                    variant="success"
                    onClick={(e) => {
                      e.preventDefault();
                      download(p.id);
                    }}
                  >
                    Download PDF
                  </Button>
                ) : (
                  <Button variant="secondary" disabled className="text-dark">
                    Available After Payment
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

      ))}
    </Container>
  );
};

export default EmployeePayslips;
