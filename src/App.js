import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/auth/Login";


// PAYROLL PAGES
import PayrollDashboard from "./pages/payroll/PayrollDashboard";
import GeneratePayroll from "./pages/payroll/GeneratePayroll";
import PayrollApprovals from "./pages/payroll/PayrollApprovals";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import EmployeePayslips from "./pages/payroll/EmployeePayslips";
import SalaryStructure from "./pages/payroll/SalaryStructure";
import DocumentUpload from "./pages/payroll/DocumentUpload";
import PayrollList from "./pages/payroll/PayrollList";
import PayslipPreview from "./pages/payroll/PayslipPreview";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Employee from "./pages/Employee";
import EmployeeProfile from "./pages/EmployeeProfile";
import Settings from "./pages/settings";


const AppLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div >
  )
}



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
                        <AppLayout>
                          <PayrollDashboard />
                        </AppLayout>
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
                        <AppLayout>
                          <Employee />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/employees/:id/profile"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE", "ROLE_EMPLOYEE"]}>
                        <AppLayout>
                          <EmployeeProfile />
                        </AppLayout>
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
                        <AppLayout>
                          <GeneratePayroll />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payroll/generate/:id"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <AppLayout>
                          <GeneratePayroll />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/approvals"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <AppLayout>
                          <PayrollApprovals />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/history"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <AppLayout>
                          <PayrollList />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/details/:payrollId"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_FINANCE"]}>
                        <AppLayout>
                          <PayrollDetails />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                
                <Route
                  path="/employee/settings"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <AppLayout>
                          <Settings />
                        </AppLayout>
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
                        <AppLayout>
                          <EmployeePayslips />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/payroll/preview/:payrollId"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR", "ROLE_EMPLOYEE"]}>
                        <AppLayout>
                          <PayslipPreview />
                        </AppLayout>
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
                        <AppLayout>
                          <SalaryStructure />
                        </AppLayout>
                      </RoleRoute>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/payroll/salary-structure/create/:id"
                  element={
                    <PrivateRoute>
                      <RoleRoute roles={["ROLE_ADMIN", "ROLE_HR"]}>
                        <AppLayout>
                          <SalaryStructure />
                        </AppLayout>
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
                        <AppLayout>
                          <DocumentUpload />
                        </AppLayout>
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
