import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import AttendanceSummaryCard from "../../components/AttendanceSummaryCard";
import { payrollApi } from "../../api/payrollApi";
import { attendanceApi } from "../../api/attendanceApi";
import { Container, Row, Col, Card, Alert, Form, Badge } from "react-bootstrap";
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
import { Link } from "react-router-dom";
import "./style.css";
import "./chart-card.css";

const YEARS = [2023, 2024, 2025, 2026];

const MONTHS = [
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
  { value: 12, label: "December" },
];

const DEFAULT_DEDUCTIONS = [
  { deductionType: "Tax", totalAmount: 0 },
  { deductionType: "PF", totalAmount: 0 },
  { deductionType: "ESI", totalAmount: 0 },
  { deductionType: "Other", totalAmount: 0 },
];

const PayrollDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();

  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [deductions, setDeductions] = useState([]);

  const role = user?.role;

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [year, month, role, user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load payroll data
      let payrollRes;
      if (role === "ROLE_EMPLOYEE") {
        payrollRes = await payrollApi.employeeDashboard(user.employeeId, year);
      } else {
        payrollRes = await payrollApi.dashboard(year);
      }

      const payrollDashboard = payrollRes?.data;

      if (!payrollDashboard) {
        throw new Error("Invalid payroll dashboard response");
      }

      setStats(payrollDashboard.stats);

      let attendanceData = null;

      if (role === "ROLE_EMPLOYEE") {
        try {

          const attendanceRes =
            await attendanceApi.getMonthlySummaryByEmployee(
              user.employeeId,
              year,
              month
            );

          attendanceData = attendanceRes?.data?.data;
        } catch (attendanceError) {
          console.warn("Failed to load attendance data:", attendanceError);
          attendanceData = null;
        }
      }

      if (role === "ROLE_EMPLOYEE") {
        try {
          const deductionRes =
            await payrollApi.getEmployeeMonthlyDeductions(
              month,
              year
            );

          setDeductions(deductionRes?.data || []);
        } catch (err) {
          console.warn("Failed to load deductions", err);
          setDeductions([]);
        }
      }

      if (attendanceData) {
        const present = attendanceData.present || 0;
        const absent = attendanceData.absent || 0;
        const halfDay = attendanceData.halfDay || 0;
        const late = attendanceData.late || 0;
        const leave = attendanceData.leave || 0;
        const holidays = attendanceData.holidays || 0;
        const weekends = attendanceData.weekends || 0;
        const workingDays = attendanceData.workingDays || 0;
        const payableDays = attendanceData.payableDays || 0;

        const attendanceRate =
          workingDays > 0
            ? ((present + halfDay * 0.5) / workingDays) * 100
            : 0;

        setAttendanceSummary({
          totalDays: workingDays,
          presentDays: present,
          absentDays: absent,
          lateDays: late,
          halfDays: halfDay,
          leaveDays: leave,
          holidayDays: holidays,
          weekendDays: weekends,
          payableDays: payableDays,
          attendanceRate,
        });
      } else {
        setAttendanceSummary(null);
      }

      setTrendData(
        (payrollDashboard.trends || []).map(t => ({
          period: t.period,
          salary: t.salary,
          tax: t.tax,
        }))
      )

      setPieData(
        (payrollDashboard.salaryDistribution || []).map((d, i) => ({
          ...d,
          color: i === 0 ? "#8884d8" : "#ff7300",
        }))
      );

    } catch (err) {
      const msg = "Failed to load payroll dashboard";
      setError(msg);
      showError(msg);
      console.error(err);


      setAttendanceSummary(null);
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payroll Dashboard</h2>

        <div className="d-flex gap-3 mb-4">
          <Form.Select
            style={{ width: 120 }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Form.Select>

          <Form.Select
            style={{ width: 160 }}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>


      <Row className="g-4 mb-4 d-flex align-items-end">
        {(role === "ROLE_ADMIN" || role === "ROLE_HR") && (
          <Col md={3} >
            <Link to="/employees" className="link count-link">
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
            <StatCard title="My Payrolls" value={stats.totalPayrolls} className="count-link" />
          )}
        </Col>

        {(role === "ROLE_ADMIN" || role === "ROLE_HR") && (
          <Col md={3}>
            <Link to="/payroll/approvals" className="link">
              <StatCard title="Pending Approval" value={stats.pendingApprovals} className="count-link"/>
            </Link>
          </Col>
        )}

        <Col md={3}>
          <StatCard
            title={role === "ROLE_EMPLOYEE" ? "Total Received" : "Total Paid"}
            value={`₹${(stats?.totalPaid || 0).toFixed(2)}`}
          />
        </Col>
        {role === "ROLE_EMPLOYEE" && (
          <Col lg={4}>
            <Card className="count-link">
              <Card.Header>Deductions ({year} - {MONTHS.find(m => m.value === month)?.label})</Card.Header>
              <Card.Body>
                {DEFAULT_DEDUCTIONS.map((defaultItem) => {
                  const found = deductions.find(
                    (d) => d.deductionType === defaultItem.deductionType
                  );

                  const amount = found ? Number(found.totalAmount) : 0;

                  return (
                    <div
                      key={defaultItem.deductionType}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>{defaultItem.deductionType}</span>
                      <strong>₹{amount.toFixed(2)}</strong>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>


      <Row className="g-4 d-flex align-items-start mt-5">
        <Col lg={8}>
          <Card className="chart-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <span className="chart-icon">📈</span>
                Salary Trend ({year})
              </div>
              <Badge bg="primary" className="chart-badge">
                {trendData.length} Months
              </Badge>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="period"
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#8884d8"
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', r: 6 }}
                    activeDot={{ r: 8 }}
                    name={role === "ROLE_EMPLOYEE" ? "Gross Salary" : "Salary"}
                  />
                  <Line
                    type="monotone"
                    dataKey="tax"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    dot={{ fill: '#82ca9d', r: 6 }}
                    activeDot={{ r: 8 }}
                    name={role === "ROLE_EMPLOYEE" ? "Deductions" : "Taxes"}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {role === "ROLE_EMPLOYEE" && (

          <Col lg={4}>
            <AttendanceSummaryCard
              data={attendanceSummary}
              loading={loading}
              selectedMonthLabel={`${MONTHS.find(m => m.value === month)?.label} ${year}`}
            />
          </Col>


        )}

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
