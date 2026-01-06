import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { payrollApi } from "../../api/payrollApi";
import { Container, Row, Col, Card, Alert, Form } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './style.css';

const YEARS = [2023, 2024, 2025, 2026];

const PayrollDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = user?.role;

  useEffect(() => {
    loadDashboard();
  }, [year, role]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      let res;
      if (role === "ROLE_EMPLOYEE") {
        // Employee sees only their own dashboard
        res = await payrollApi.employeeDashboard(user.employeeId, year);
      } else {
        // Admin / HR sees full dashboard
        res = await payrollApi.dashboard(year);
      }

      const dashboard = res?.data;

      if (!dashboard) {
        throw new Error("Invalid dashboard response");
      }

      // -------------------------
      // Stats
      // -------------------------
      setStats(dashboard.stats);

      // -------------------------
      // Trends
      // -------------------------
      setTrendData(
        dashboard.trends.map(t => ({
          period: t.period,
          salary: t.salary,
          tax: t.tax,
        }))
      );

      // -------------------------
      // Salary Distribution
      // -------------------------
      setPieData(
        dashboard.salaryDistribution.map((d, i) => ({
          ...d,
          color: i === 0 ? "#8884d8" : "#ff7300",
        }))
      );

    } catch (err) {
      const msg = "Failed to load payroll dashboard";
      setError(msg);
      showError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid>
        <h2 className="mb-4">Payroll Dashboard</h2>
        <LoadingSkeleton type="dashboard" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payroll Dashboard</h2>

        {/* YEAR SELECTOR */}
        <Form.Select
          style={{ width: 150 }}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Form.Select>
      </div>

      {/* STATS */}
      <Row className="g-4 mb-4">
        {(role === "ROLE_ADMIN" || role === "ROLE_HR") && (
          <Col md={3}>
            <Link to="/employees" className="link">
              <StatCard title="Employees" value={stats.totalEmployees} />
            </Link>
          </Col>
        )}

        <Col md={3}>
          {role !== "ROLE_EMPLOYEE" ? (
            <Link to="/payroll/history" className="link">
              <StatCard title="Payrolls" value={stats.totalPayrolls} />
            </Link>
          ) : (
            <StatCard title="My Payrolls" value={stats.totalPayrolls} />
          )}
        </Col>

        {(role === "ROLE_ADMIN" || role === "ROLE_HR") && (
          <Col md={3}>
            <Link to="/payroll/approvals" className="link">
              <StatCard title="Pending Approval" value={stats.pendingApprovals} />
            </Link>
          </Col>
        )}

        <Col md={3}>
          <StatCard
            title={role === "ROLE_EMPLOYEE" ? "Total Received" : "Total Paid"}
            value={`₹${stats.totalPaid.toFixed(2)}`}
          />
        </Col>
      </Row>

      {/* CHARTS */}
      <Row className="g-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              Salary Trend ({year})
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    dataKey="salary"
                    stroke="#8884d8"
                    name={role === "ROLE_EMPLOYEE" ? "Gross Salary" : "Salary"}
                  />
                  <Line
                    dataKey="tax"
                    stroke="#82ca9d"
                    name={role === "ROLE_EMPLOYEE" ? "Deductions" : "Taxes"}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {(role === "ROLE_ADMIN" || role === "ROLE_HR") && (
          <Col lg={4}>
            <Card>
              <Card.Header>Salary Distribution</Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label
                    >
                      {pieData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default PayrollDashboard;
