import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/auth/Login";

import PayrollDashboard from "./pages/payroll/PayrollDashboard";
import GeneratePayroll from "./pages/payroll/GeneratePayroll";
import PayrollApprovals from "./pages/payroll/PayrollApprovals";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import EmployeePayslips from "./pages/payroll/EmployeePayslips";
import SalaryStructure from "./pages/payroll/SalaryStructure";
import DocumentUpload from "./pages/payroll/DocumentUpload";
import PayrollList from "./pages/payroll/PayrollList";
import PayslipPreview from "./pages/payroll/PayslipPreview";
import Employee from "./pages/Employee";
import EmployeeProfile from "./pages/EmployeeProfile";
import HelpSupport from "./pages/HelpSupport";
import Settings from "./pages/settings";
import Layout from "./components/layout/Layout";



function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>

                {/* PUBLIC */}
                <Route path="/login" element={<Login />} />

                {/* DEFAULT */}
                <Route path="/" element={<Navigate to="/payroll/dashboard" />} />

                {/* DASHBOARD */}
                <Route
                  path="/payroll/dashboard"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <PayrollDashboard />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* EMPLOYEE MANAGEMENT */}
                <Route
                  path="/employees"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <Layout>
                          <Employee />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employees/profile"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <EmployeeProfile />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employees/:id/profile"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <EmployeeProfile />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* PAYROLL */}
                <Route
                  path="/payroll/generate"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <Layout>
                          <GeneratePayroll />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payroll/generate/:id"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <Layout>
                          <GeneratePayroll />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/approvals"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <Layout>
                          <PayrollApprovals />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/history"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <Layout>
                          <PayrollList />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/details/:payrollId"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <Layout>
                          <PayrollDetails />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employee/settings"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <Settings />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* EMPLOYEE SELF SERVICE */}
                <Route
                  path="/employee/payslips"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_EMPLOYEE"]}>
                        <Layout>
                          <EmployeePayslips />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/preview/:payrollId"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <PayslipPreview />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* HR ONLY */}
                <Route
                  path="/payroll/salary-structure"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <Layout>
                          <SalaryStructure />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payroll/salary-structure/create/:id"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <Layout>
                          <SalaryStructure />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* DOCUMENTS */}
                <Route
                  path="/payroll/documents"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <DocumentUpload />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                {/* HELP & SUPPORT */}
                <Route
                  path="/help-support"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE", "ROLE_EMPLOYEE"]}>
                        <Layout>
                          <HelpSupport />
                        </Layout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

              </Routes>

            </AuthProvider>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
