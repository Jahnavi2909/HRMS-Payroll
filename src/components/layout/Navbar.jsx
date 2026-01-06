
import { Navbar as BootstrapNavbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BootstrapNavbar bg={isDark ? "dark" : "light"} variant={isDark ? "dark" : "light"} expand="lg" className="mb-0 shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand href="#home" className="fw-bold">
          <span className="text-primary">HRMS</span> Payroll
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={toggleTheme}
              className="me-2 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </Button>
            {user?.role === "ROLE_HR" && (
              <Nav.Link onClick={() => navigate("/payroll/generate")} className="me-2">
                Generate Payroll
              </Nav.Link>
            )}
            <Nav.Link onClick={() => navigate("/employee/payslips")} className="me-2">
              Payslips
            </Nav.Link>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
