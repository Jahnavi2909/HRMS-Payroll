import { useState } from "react";
import { payrollApi } from "../../api/api";

const RunPayroll = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleRun = async () => {
    await payrollApi.generate(employeeId, year, month);
    alert("Payroll Generated");
  };

  return (
    <>
      <h3>Run Payroll</h3>

      <input placeholder="Employee ID" onChange={e => setEmployeeId(e.target.value)} />
      <input placeholder="Month" onChange={e => setMonth(e.target.value)} />
      <input placeholder="Year" onChange={e => setYear(e.target.value)} />

      <button onClick={handleRun}>Generate</button>
    </>
  );
};

export default RunPayroll;
