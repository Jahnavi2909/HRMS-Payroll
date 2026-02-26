import { Card } from "react-bootstrap";

const EmployeeDetails = ({ employee }) => {
  if (!employee) return null;

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5>{employee.firstName} {employee.lastName}</h5>
        <p><strong>ID:</strong> {employee.employeeId}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.departmentName}</p>
        <p><strong>Role:</strong> {employee.designation}</p>
      </Card.Body>
    </Card>
  );
};

export default EmployeeDetails;
