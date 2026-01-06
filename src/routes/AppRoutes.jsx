import { Route } from "react-router-dom"
import PayrollDashboard from "../pages/payroll/PayrollDashboard"
import GeneratePayroll from "../pages/payroll/GeneratePayroll"
import PayrollDetails from "../pages/payroll/PayrollDetails"
import EmployeePayslips from "../pages/payroll/EmployeePayslips"
import PayrollList from "../pages/payroll/PayrollList"
import PayslipPreview from "../pages/payroll/PayslipPreview"
import PayslipDownload from "../pages/payroll/PayslipDownload"


const AppRoutes = () => {
    return (
        <>
            <Route path="/payroll/dashboard" element={<PayrollDashboard />} />
            <Route path="/payroll/generate" element={<GeneratePayroll />} />
            <Route path="/payroll/details/:payrollId" element={<PayrollDetails />} />
            <Route path="/employee/payslips" element={<EmployeePayslips />} />
            <Route path="/payroll/list" element={<PayrollList />} />
            <Route path="/payroll/preview/:payrollId" element={<PayslipPreview />} />
            <Route path="/payroll/download/:payrollId" element={<PayslipDownload />} />

        </>
    )
}

export default AppRoutes;