import apiClient from "./apiCient";

export const payrollApi = {
    generate: (employeeId, month, year) =>
        apiClient.post(
            `/api/payroll/generate`,
            null,
            { params: { employeeId, month, year } }
        ),

    getPayrollDetails: (payrollId) =>
        apiClient.get(`/api/payroll/${payrollId}`),

    submit: (id) =>
        apiClient.put(`/api/payroll/${id}/submit`),

    approve: (id, approverId) =>
        apiClient.put(`/api/payroll/${id}/approve`),

    pay: (id) =>
        apiClient.put(`/api/payroll/${id}/pay`),

    getEmployeePayrolls: (employeeId) =>
        apiClient.get(`/api/payroll/employee/${employeeId}`),

    dashboard: (year) =>
        apiClient.get(`/api/payroll/dashboard`, {
            params: { year },
        }),

    downloadPayslip: (payrollId) =>
        apiClient.get(`/api/payroll/payslip/${payrollId}/download`, {
            responseType: "blob",
        }),

    getPendingApprovals: () =>
        apiClient.get(`/api/payroll/pending-approvals`),

    getHistory: (page = 0, size = 10) =>
        apiClient.get(`/api/payroll/history`, {
            params: { page, size },
        }),

    employeeDashboard: (employeeId, year) =>
        apiClient.get("/api/payroll/employee/dashboard", {
            params: { employeeId, year }
        }),

        getEmployeeMonthlyDeductions: (month, year) =>
        apiClient.get(`/api/payroll/employee/deductions/month`, {
            params: { month, year },
        }),
};
