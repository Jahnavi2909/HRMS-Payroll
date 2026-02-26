import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Badge
} from "react-bootstrap";
import { payrollApi } from "../../api/payrollApi";
import EmployeeProfileInfo from "../../components/EmployeeProfileInfo";

const PayslipPreview = () => {
  const { payrollId } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayroll();
  }, [payrollId]);

  const fetchPayroll = async () => {
    try {
      const res = await payrollApi.getPayrollDetails(payrollId);
      setPayroll(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load payslip");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    `₹${Math.max(Number(value || 0), 0).toLocaleString("en-IN")}`;

  const handleDownload = async () => {
    if (payroll.status !== "PAID") {
      alert("Payslip can only be downloaded after payment.");
      return;
    }

    try {
      const res = await payrollApi.downloadPayslip(payrollId);

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${payrollId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const netSalaryNegative = payroll?.netSalary < 0;

  const earnings = payroll?.earnings || {};
  const deductions = payroll?.deductions || {};

  // Calculate Gross Salary
  const calculatedGross =
    Number(earnings.basic || 0) +
    Number(earnings.hra || 0) +
    Number(earnings.allowance || 0);

  // Calculate Total Deductions
  const calculatedDeductions =
    Number(deductions.tax || 0) +
    Number(deductions.pf || 0) +
    Number(deductions.lossOfPay || 0);

  // Calculate Net Salary 
  const calculatedNet = calculatedGross - calculatedDeductions;

  if (loading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 payslip-print">

      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Payslip Preview</h5>
              <div className="no-print">
                {payroll.status === "PAID" && (
                  <Button size="sm" variant="light" onClick={handleDownload}>
                    Download PDF
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Body>
              {/* Header */}
              <Row className="mb-3">
                <Col md={12}>
                  <EmployeeProfileInfo empId={payroll?.employeeId} />
                  <p><strong>Month:</strong> {payroll.month}/{payroll.year}</p>
                </Col>
                <Col md={6} className="text-md-end">
                  <Badge bg={payroll.status === "GENERATED" ? "success" : "warning"}>
                    {payroll.status}
                  </Badge>
                </Col>
              </Row>

              <hr />

              {/* Salary */}
              <Row>
                <Col md={6}>
                  <h6>Earnings</h6>
                  <p>Basic: {formatCurrency(payroll.earnings.basic)}</p>
                  <p>HRA: {formatCurrency(payroll.earnings.hra)}</p>
                  <p>Allowance: {formatCurrency(payroll.earnings.allowance)}</p>
                  <hr />
                  <strong>Gross: {formatCurrency(calculatedGross)}</strong>
                </Col>

                <Col md={6}>
                  <h6>Deductions</h6>
                  <p>Tax: {formatCurrency(payroll.deductions.tax)}</p>
                  <p>PF: {formatCurrency(payroll.deductions.pf)}</p>
                  <p>Loss of Pay: {formatCurrency(payroll.deductions.lossOfPay)}</p>
                  <hr />
                  <strong>Total: {formatCurrency(calculatedDeductions)}</strong>
                </Col>
              </Row>

              <hr />

              {/* Net Salary */}
              <Row>
                <Col className="text-center">
                  <h4 className={netSalaryNegative ? "text-danger" : "text-success"}>
                    Net Salary: {formatCurrency(calculatedNet)}
                  </h4>

                  {netSalaryNegative && (
                    <Alert variant="warning" className="mt-2">
                      Net salary is negative due to excess deductions.
                    </Alert>
                  )}
                </Col>
              </Row>

              <hr />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body {
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
          .payslip-print {
            padding: 0 !important;
          }
          iframe {
            display: none;
          }
        }
      `}</style>
    </Container>
  );
};

export default PayslipPreview;
