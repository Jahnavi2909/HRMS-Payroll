import { Button, Container, Dropdown, Nav, Navbar, Badge, InputGroup, Form } from "react-bootstrap";
import { FaBars, FaBell, FaCog, FaSignOutAlt, FaUserCircle, FaSearch, FaMoon, FaSun, FaGlobe, FaQuestionCircle, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";
import './style.css'
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Header = ({ collapsed, toggleSidebar }) => {
  const { user, logout, unreadCount } = useAuth();

  if (!user) return null;



  return (
    <div className={`nav-bar ${collapsed ? "collapsed" : ""}`}>
      <Navbar
        bg="white"
        variant="light"
        className="border-bottom shadow-sm sticky-top"
      >

        <Container fluid className="px-4 d-flex flex-row align-items-center">

          {/* Brand */}
          <Navbar.Brand className="d-md-block brand">
            <Link to={"/"} className="text-decoration-none">
              <img
                src="/Raynxsystemslogo.png"
                alt="Raynx Systems"
                className="logo"
                width={160}
              />
            </Link>
          </Navbar.Brand>


          {/* Right section */}
          <Nav className="ms-auto align-items-center gap-3">

            {/* Help */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="help-btn"
              title="Help & Support"
              as={Link}
              to="/help-support"
            >
              <FaQuestionCircle />
            </Button>

            {/* Notifications */}
            <div className="notification-wrapper">
              <Link to="/notifications" className="notification-btn position-relative p-2">
                <FaBell size={18} className="text-muted" />
                {unreadCount > 0 && (
                  <Badge bg="danger" className="notification-badge rounded-pill position-absolute top-0 translate-middle">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            </div>

            {/* Profile dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="bg-transparent border-0 p-0"
              >
                <div className="d-flex align-items-center">
                  <div className="me-2 text-end d-none d-md-block">
                    <div className="fw-medium">
                      {user?.employee?.firstName || user?.username}
                    </div>
                    <small className="text-muted">
                      {user?.role?.replace("ROLE_", "")}
                    </small>
                  </div>
                  <div className="avatar-circle bg-primary text-white">
                    {user?.employee?.avatar ? (
                      <img
                        src={user.employee.avatar}
                        alt="Profile"
                        className="avatar-img"
                      />
                    ) : (
                      (user?.employee?.firstName?.[0] || "U").toUpperCase()
                    )}
                  </div>

                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0">
                <Dropdown.Header>
                  <strong>{user?.employee?.firstName || user?.username}</strong>
                  <br />
                  <small className="text-muted">{user?.email}</small>
                </Dropdown.Header>

                <Dropdown.Item
                  as={Link}
                  to={
                    user?.employee?.id
                      ? `/employees/${user.employee.id}/profile`
                      : "/employees/profile"
                  }
                  className="link"
                >
                  <FaUserCircle className="me-2" /> Profile
                </Dropdown.Item>

                <Dropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item className="text-danger" onClick={logout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button
              variant="outline-primary"
              size="sm"
              className="ms-2 sidebar-toggle-btn d-lg-none"
              onClick={toggleSidebar}
            >
              <FaBars size={16} />
            </Button>


          </Nav>
        </Container>
      </Navbar >
    </div>
  );
};

export default Header;
