import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Badge,
  Alert,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { payrollApi } from "../../api/payrollApi";
import { useAuth } from "../../contexts/AuthContext";

const PayrollList = () => {

  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isHrOrAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_HR";

  // Filters
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollApi.getHistory();
      setPayrolls(res?.data?.data?.content ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  };


  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item) => {
      const p = item.payroll;

      const matchesSearch =
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.employeeCode
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesMonth =
        month === "" ||
        `${p.month}/${p.year}` === month;

      const matchesStatus =
        status === "" || p.status === status;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [payrolls, search, month, status]);

  const handleDownload = async (id) => {
    try {
      const res = await payrollApi.downloadPayslip(id);
      const blob = new Blob([res.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Payslip download failed", err);
    }
  };


  const handleSubmit = async (id) => {
    await payrollApi.submit(id);
    loadPayrolls();
  };

  const handleApprove = async (id) => {
    await payrollApi.approve(id, user.employeeId);
    loadPayrolls();
  };

  const handlePay = async (id) => {
    await payrollApi.pay(id);
    loadPayrolls();
  };


  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

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
    <Container fluid className="py-4">
      <h4 className="mb-3">Payroll History</h4>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label>Search</Form.Label>
              <Form.Control
                placeholder="Employee name or code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Label>Month</Form.Label>
              <Form.Control
                placeholder="MM/YYYY"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="GENERATED">Generated</option>
                <option value="PENDING">Pending</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => {
                  setSearch("");
                  setMonth("");
                  setStatus("");
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="table-responsive">
        <Table bordered hover striped align="middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Employee Code</th>
              <th>Month</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayrolls.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <strong>No payroll records found</strong>
                </td>
              </tr>
            ) : (
              filteredPayrolls.map((item, index) => {
                const p = item.payroll;

                return (
                  <tr key={p.id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.firstName} {item.lastName}
                    </td>

                    <td>{item.employeeCode}</td>

                    <td>
                      {p.month}/{p.year}
                    </td>

                   <td>{formatCurrency(p.grossSalary)}</td>

                    <td
                      className={
                        p.netSalary < 0
                          ? "text-danger fw-bold"
                          : "fw-bold"
                      }
                    >
                      {formatCurrency(p.netSalary)}
                    </td>

                    <td>
                      <Badge
                        bg={
                          p.status === "GENERATED"
                            ? "secondary"
                            : p.status === "PENDING_APPROVAL"
                              ? "warning"
                              : p.status === "APPROVED"
                                ? "info"
                                : "success"
                        }
                      >
                        {p.status}
                      </Badge>

                    </td>

                    <td className="text-center">
                      {!(p.status === "PAID") &&
                        < Button
                          size="sm"
                          variant="primary"
                          className="me-2"
                          onClick={() => navigate(`/payroll/details/${p.id}`)}
                        >
                          View

                        </Button>
                      }

                      {/* GENERATED → SUBMIT */}
                      {isHrOrAdmin && p.status === "GENERATED" && (
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => handleSubmit(p.id)}
                        >
                          Submit
                        </Button>
                      )}

                      {/* PENDING_APPROVAL → APPROVE */}
                      {isHrOrAdmin && p.status === "PENDING_APPROVAL" && (
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => handleApprove(p.id)}
                        >
                          Approve
                        </Button>
                      )}

                      {/* APPROVED → PAY */}
                      {isHrOrAdmin && p.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="dark"
                          className="me-2"
                          onClick={() => handlePay(p.id)}
                        >
                          Pay
                        </Button>
                      )}

                      {/* PAID → DOWNLOAD */}
                      {p.status === "PAID" && (
                        <>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => navigate(`/payroll/preview/${p.id}`)}
                            className="m-2"
                          >
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(p.id)}
                          >
                            Download
                          </Button>
                        </>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </Container >
  );
};

export default PayrollList;
