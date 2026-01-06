import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spinner, Badge } from "react-bootstrap";
import { payrollApi } from "../../api/payrollApi";
import EmployeeProfileInfo from "../../components/EmployeeProfileInfo";

const PayrollDetails = () => {
  const { payrollId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    payrollApi
      .getPayrollDetails(payrollId)
      .then(res => setData(res.data.data));
  }, [payrollId]);

  if (!data) return <Spinner />;

  return (
    <>
      <h4>Payroll Details</h4>

      <EmployeeProfileInfo empId={data.employeeId} />
      <p><strong>Month:</strong> {data.month}/{data.year}</p>
      <p>
        <strong>Status:</strong>{" "}
        <Badge bg="success">{data.status}</Badge>
      </p>

      <h5 className="mt-3">Earnings</h5>
      <Table bordered>
        <tbody>
          {Object.entries(data.earnings).map(([k, v]) => (
            <tr key={k}>
              <td>{k.toUpperCase()}</td>
              <td>₹{v.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5 className="mt-3">Deductions</h5>
      <Table bordered>
        <tbody>
          {Object.entries(data.deductions).map(([k, v]) => (
            <tr key={k}>
              <td>{k.toUpperCase()}</td>
              <td>₹{v.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="text-end">
        Net Pay: ₹{data.netSalary.toLocaleString()}
      </h4>
    </>
  );
};

export default PayrollDetails;
