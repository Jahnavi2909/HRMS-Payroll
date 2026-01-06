import { useState } from "react";
import RunPayroll from "./RunPayroll";
import PayrollHistory from "./PayrollHistory";

const PayRuns = () => {
  const [tab, setTab] = useState("run");

  return (
    <>
      <h2>Pay Runs</h2>

      <button onClick={() => setTab("run")}>Run Payroll</button>
      <button onClick={() => setTab("history")}>Payroll History</button>

      {tab === "run" ? <RunPayroll /> : <PayrollHistory />}
    </>
  );
};

export default PayRuns;
