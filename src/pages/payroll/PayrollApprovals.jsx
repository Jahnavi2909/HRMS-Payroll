import { useEffect, useState } from "react";
import { payrollApi } from "../../api/payrollApi";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

const PayrollApprovals = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      const res = await payrollApi.getPendingApprovals();
      setPayrolls(res.data || []);
    } catch (err) {
      setError("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await payrollApi.approve(id, user.employeeId);
      loadApprovals();
      window.dispatchEvent(new Event("approvalUpdated"));
    } catch (err) {
      setError("Failed to approve payroll");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <h2 className="mb-4">Payroll Approvals</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {payrolls.length === 0 && <p>No pending approvals</p>}

      {payrolls.map(p => (
        <Card key={p.id} className="mb-3">
          <Card.Body>
            <Card.Title>
              Employee ID: {p.employeeId}
            </Card.Title>

            <Card.Text>
              Month: {p.month} / {p.year}
            </Card.Text>

            <Card.Text>
              Status: <strong>{p.status}</strong>
            </Card.Text>

            <Card.Text>
              Gross Salary: ₹{p.grossSalary}
            </Card.Text>

            <Card.Text>
              Total Deductions: ₹{p.totalDeductions}
            </Card.Text>

            <Card.Text>
              <strong>Net Salary: ₹{p.netSalary}</strong>
            </Card.Text>

            {p.status === "PENDING_APPROVAL" && (
              <Button
                onClick={() => approve(p.id)}
                variant="success"
              >
                Approve
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default PayrollApprovals;
