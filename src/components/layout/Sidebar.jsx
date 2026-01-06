import { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaHistory,
  FaMoneyCheckAlt
} from "react-icons/fa";
import './style.css';
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Sidebar menu items with role-based access
  const menuItems = [
    {
      to: "/payroll/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
      roles: ["ADMIN", "HR", "FINANCE", "EMPLOYEE"]
    },
    {
      to: "/employees",
      icon: <FaFileInvoiceDollar />,
      label: "Employees",
      roles: ["ADMIN", "HR"]
    },
    {
      to: "/payroll/generate",
      icon: <FaFileInvoiceDollar />,
      label: "Generate Payroll",
      roles: ["ADMIN", "HR"]
    },
    {
      to: "/payroll/approvals",
      icon: <FaCheckCircle />,
      label: "Payroll Approvals",
      roles: ["ADMIN", "HR"]
    },
    {
      to: "/payroll/history",
      icon: <FaHistory />,
      label: "Payroll History",
      roles: ["ADMIN", "HR", "FINANCE"]
    },
    {
      to: "/employee/payslips",
      icon: <FaMoneyCheckAlt />,
      label: "My Payslips",
      roles: ["EMPLOYEE"]
    },
    {
      to: "/payroll/salary-structure",
      icon: <FaMoneyCheckAlt />,
      label: "Salary Structure",
      roles: ["HR", "ADMIN"]
    },
    {
      to: "/payroll/documents",
      icon: <FaFileInvoiceDollar />,
      label: "Documents",
      roles: ["ADMIN", "HR", "FINANCE"]
    },
    {
      to: "/employee/settings",
      icon: <FaFileInvoiceDollar />,
      label: "Settings",
      roles: ["ADMIN", "HR", "EMPLOYEE"]
    }
  ];

  if (!user) return null;

  const userRole = user.role?.split('_')[1].toUpperCase() || "GUEST";

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="primary"
        className="d-lg-none m-2"
        onClick={toggleSidebar}
      >
        <FaBars />
      </Button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand p-3">
          <h3 className="text-white mb-0">Payroll System</h3>
        </div>

        <Nav className="flex-column p-3 flex-grow-1">
          {filteredMenuItems.map((item, index) => (
            <Nav.Item key={index} className="mb-2">
              <Nav.Link
                as={Link}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}

          <Nav.Item className="mt-auto">
            <Nav.Link className="sidebar-link text-danger" onClick={logout}>
              <span className="me-2"><FaSignOutAlt /></span>
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
