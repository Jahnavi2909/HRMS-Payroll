import { useEffect, useState } from "react";
import { payrollApi } from "../../api/payrollApi";
import {
  Table,
  Container,
  Alert,
  Spinner,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchAndFilter from "../../components/SearchAndFilter";

const PayrollHistory = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await payrollApi.getHistory();
      const payrollData = res.data?.data?.content || [];

      setPayrolls(payrollData);
      setFilteredPayrolls(payrollData);
    } catch (err) {
      setError("Failed to load payroll history");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...payrolls];

    // Text search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((item) =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(searchTerm) ||
        item.employeeCode?.toLowerCase().includes(searchTerm) ||
        item.payroll.status?.toLowerCase().includes(searchTerm)
      );
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter((item) => {
        const payrollDate = new Date(
          item.payroll.year,
          item.payroll.month - 1
        );
        return payrollDate >= filters.startDate;
      });
    }

    if (filters.endDate) {
      filtered = filtered.filter((item) => {
        const payrollDate = new Date(
          item.payroll.year,
          item.payroll.month - 1
        );
        return payrollDate <= filters.endDate;
      });
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(
        (item) => item.payroll.netSalary >= filters.minAmount
      );
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(
        (item) => item.payroll.netSalary <= filters.maxAmount
      );
    }

    // Status filter
    if (filters.status?.length > 0) {
      filtered = filtered.filter((item) =>
        filters.status.includes(item.payroll.status)
      );
    }

    setFilteredPayrolls(filtered);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Payroll History</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <SearchAndFilter
        onFilterChange={handleFilterChange}
        filterOptions={{
          showDateRange: true,
          showAmountRange: true,
          showStatusFilter: true,
          statusOptions: [
            { value: "GENERATED", label: "Generated" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
          ],
        }}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Employee Code</th>
            <th>Month</th>
            <th>Year</th>
            <th>Status</th>
            <th>Net Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayrolls.map((item, index) => (
            <tr key={item.payroll.id}>
              {/* SEQUENTIAL NUMBER INSTEAD OF UUID */}
              <td>{index + 1}</td>

              <td>
                {item.firstName} {item.lastName}
              </td>
              <td>{item.employeeCode}</td>
              <td>{item.payroll.month}</td>
              <td>{item.payroll.year}</td>
              <td>{item.payroll.status}</td>
              <td>₹{item.payroll.netSalary}</td>
              <td>
                <Button
                  as={Link}
                  to={`/payroll/details/${item.payroll.id}`}
                  variant="primary"
                  size="sm"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {filteredPayrolls.length === 0 && !loading && (
        <Alert variant="info" className="text-center">
          No payroll records found matching your filters.
        </Alert>
      )}
    </Container>
  );
};

export default PayrollHistory;
