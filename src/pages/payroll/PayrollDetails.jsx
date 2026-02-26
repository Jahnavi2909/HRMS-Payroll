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

  const formatCurrency = (value) =>
    `₹${Math.max(Number(value || 0), 0).toLocaleString("en-IN")}`;

  const earnings = data?.earnings || {};
  const deductions = data?.deductions || {};

  const calculatedGross = Object.values(earnings)
    .reduce((sum, val) => sum + Number(val || 0), 0);

  const calculatedDeductions = Object.entries(deductions)
    .filter(([key]) => key !== "total") // ignore backend total if exists
    .reduce((sum, [, val]) => sum + Number(val || 0), 0);

  const calculatedNet = calculatedGross - calculatedDeductions;

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
          {Object.entries(earnings).map(([k, v]) => (
            <tr key={k}>
              <td>{k.toUpperCase()}</td>
              <td>{formatCurrency(v)}</td>
            </tr>

          ))}
          <tr className="fw-bold">
            <td>GROSS</td>
            <td>{formatCurrency(calculatedGross)}</td>
          </tr>
        </tbody>
      </Table>

      <h5 className="mt-3">Deductions</h5>
      <Table bordered>
        <tbody>
          {Object.entries(deductions)
            .filter(([key]) => key !== "total")
            .map(([k, v]) => (
              <tr key={k}>
                <td>{k.toUpperCase()}</td>
                <td>{formatCurrency(v)}</td>
              </tr>
            ))}
          <tr className="fw-bold text-danger">
            <td>TOTAL</td>
            <td>{formatCurrency(calculatedDeductions)}</td>
          </tr>
        </tbody>

      </Table>

      <h4 className="text-end">
        Net Pay: {formatCurrency(calculatedNet)}
      </h4>
    </>
  );
};

export default PayrollDetails;
