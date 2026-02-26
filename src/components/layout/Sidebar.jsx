
import { Nav, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaAngleRight,
  FaAngleLeft,
  FaCheckCircle,
  FaHistory,
  FaUsers,
  FaCog,
  FaFolderOpen,
  FaChartBar,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";

import './style.css'
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { payrollApi } from "../../api/payrollApi";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, toggleSidebar }) => {

  const { user, logout } = useAuth();
  const location = useLocation();

  const roleName = user.role?.replace("ROLE_", "") || "guest";

  const [pendingCount, setPendingCount] = useState(0);

  const loadPendingCount = async () => {
    try {
      const res = await payrollApi.getPendingApprovals();
      setPendingCount(res.data?.length || 0);
    } catch (err) {
      console.error("Failed to load pending count");
    }
  };

  useEffect(() => {
    if (["ADMIN", "HR", "FINANCE"].includes(roleName)) {
      loadPendingCount();
    }
  }, [roleName]);

  useEffect(() => {
    const refresh = () => loadPendingCount();
    window.addEventListener("approvalUpdated", refresh);
    return () => window.removeEventListener("approvalUpdated", refresh);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  };

  const menuItems = [
    {
      to: "/payroll/dashboard",
      icon: <FaChartBar />,
      label: "Dashboard",
      roles: ["ADMIN", "HR", "FINANCE", "EMPLOYEE"],
      badge: null
    },
    {
      to: "/employees",
      icon: <FaUsers />,
      label: "Employee Management",
      roles: ["ADMIN", "HR"],
      badge: null
    },
    {
      to: "/payroll/generate",
      icon: <FaCalendarAlt />,
      label: "Generate Payroll",
      roles: ["ADMIN", "HR"],
      badge: null
    },
    {
      to: "/payroll/approvals",
      icon: <FaCheckCircle />,
      label: "Payroll Approvals",
      roles: ["ADMIN", "HR", "FINANCE"],
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      to: "/payroll/history",
      icon: <FaHistory />,
      label: "Payroll History",
      roles: ["ADMIN", "HR", "FINANCE"],
      badge: null
    },
    {
      to: "/employee/payslips",
      icon: <FaMoneyCheckAlt />,
      label: "My Payslips",
      roles: ["EMPLOYEE"],
      badge: null
    },
    {
      to: "/payroll/salary-structure",
      icon: <FaBuilding />,
      label: "Salary Structure",
      roles: ["HR", "ADMIN"],
      badge: null
    },
    {
      to: "/payroll/documents",
      icon: <FaFolderOpen />,
      label: "Documents",
      roles: ["ADMIN", "HR", "FINANCE", "EMPLOYEE"],
      badge: null
    },
    {
      to: "/employee/settings",
      icon: <FaCog />,
      label: "Settings",
      roles: ["ADMIN", "HR", "EMPLOYEE"],
      badge: null
    }
  ];



  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(roleName)
  );

  if (!user) return null;

  return (
    <div
      className={`sidebar 
    ${collapsed ? "collapsed" : ""} 
    ${mobileOpen ? "open" : ""}`}
    >

      <div className="sidebar-brand d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="brand-logo">
            <FaBuilding className="brand-icon" />
          </div>
          {!collapsed && (
            <div className="brand-text ms-3">
              <h5 className="mb-0 brand-title">HRM Payroll</h5>
              <small className="brand-subtitle">Management System</small>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(prev => !prev)}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>



      <Nav className="flex-column">
        {filteredMenuItems.map(item => {
          const isActive = location.pathname === item.to;

          if (item.external) {
            return (
              <Nav.Link
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip={item.label}
                className="sidebar-link"
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Nav.Link>
            );
          }

          return (
            <Nav.Link
              key={item.to}
              as={Link}
              to={item.to}
              onClick={handleNavClick}
              data-tooltip={item.label}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.badge && !collapsed && (
                <Badge bg="danger" className="sidebar-badge ms-auto">
                  {item.badge}
                </Badge>
              )}
            </Nav.Link>
          );
        })}

        <Nav.Link className="sidebar-link text-danger mt-auto" data-tooltip="Logout" onClick={() => {
          logout();
          handleNavClick();
        }}>
          <span className="icon"><FaSignOutAlt /></span>
          <span className="label">Logout</span>

        </Nav.Link>

      </Nav>
    </div>
  );
};

export default Sidebar;
