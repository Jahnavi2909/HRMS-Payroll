import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { employeeApi } from "../api/employeeApi";
import { useAuth } from "../contexts/AuthContext";

const EmployeeSelector = ({ onSelect }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);

  const isAdminOrHR =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_HR";

  useEffect(() => {
    if (isAdminOrHR) {
      loadEmployees();
    }
  }, []);

  const loadEmployees = async () => {
    const res = await employeeApi.getAllEmployee();
    setEmployees(res.data?.data || []);
  };

  if (!isAdminOrHR) return null;

  return (
    <Form.Group className="mb-3">
      <Form.Label>Select Employee</Form.Label>
      <Form.Select onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Select Employee --</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.firstName} {emp.lastName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default EmployeeSelector;
