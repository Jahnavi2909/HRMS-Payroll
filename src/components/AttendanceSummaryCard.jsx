import { Card, Row, Col } from "react-bootstrap";
import { FaCalendarCheck } from "react-icons/fa";
import "./AttendanceSummaryCard.css";

const AttendanceSummaryCard = ({ data, loading, selectedMonthLabel }) => {
  if (loading) {
    return (
      <Card className="attendance-summary-card shadow-sm w-100">
        <Card.Header className="attendance-header">
          <FaCalendarCheck className="me-2 text-primary" />
          Attendance Summary
        </Card.Header>
        <Card.Body>Loading...</Card.Body>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="attendance-summary-card shadow-sm w-100">
        <Card.Header className="attendance-header">
          <FaCalendarCheck className="me-2 text-primary" />
          Attendance Summary
        </Card.Header>
        <Card.Body>No attendance data available</Card.Body>
      </Card>
    );
  }

  const {
    totalDays = 0,
    presentDays = 0,
    absentDays = 0,
    leaveDays = 0,
    halfDays = 0,
    lateDays = 0,
    holidayDays = 0,
    weekendDays = 0,
    payableDays = 0,
    attendanceRate = 0,
  } = data;

  return (
    <Card className="attendance-summary-card shadow-sm w-100">
      <Card.Header className="attendance-header d-flex justify-content-between align-items-center">
        <div>
          <FaCalendarCheck className="me-2 text-primary" />
          Attendance Summary
        </div>
        <span className="attendance-month">{selectedMonthLabel}</span>
      </Card.Header>

      <Card.Body>
        <Row className="g-3">
          <Col md={6}><RowItem label="Working Days" value={totalDays} /></Col>
          <Col md={6}><RowItem label="Present" value={presentDays} /></Col>
          <Col md={6}><RowItem label="Absent" value={absentDays} /></Col>
          <Col md={6}><RowItem label="Leave" value={leaveDays} /></Col>
          <Col md={6}><RowItem label="Half Days" value={halfDays} /></Col>
          <Col md={6}><RowItem label="Late Days" value={lateDays} /></Col>
          <Col md={6}><RowItem label="Holidays" value={holidayDays} /></Col>
          <Col md={6}><RowItem label="Weekends" value={weekendDays} /></Col>
          <Col md={6}><RowItem label="Payable Days" value={payableDays} /></Col>
          <Col md={6}>
            <RowItem
              label="Attendance %"
              value={`${attendanceRate.toFixed(1)}%`}
              highlight
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const RowItem = ({ label, value, highlight }) => (
  <div className={`attendance-row ${highlight ? "highlight" : ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default AttendanceSummaryCard;