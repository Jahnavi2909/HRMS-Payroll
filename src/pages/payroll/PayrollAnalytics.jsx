import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PayrollAnalytics = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="employeeName" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="netSalary" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PayrollAnalytics;
