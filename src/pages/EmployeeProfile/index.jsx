import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";

import imageCompression from "browser-image-compression";
import { FaCalendarAlt, FaCamera, FaClock, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone, FaUser, FaUserTag, FaUserTie } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import { employeeApi } from "../../api/employeeApi";
import { useAuth } from "../../contexts/AuthContext";

const EmployeeProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] = useState(null);
  const [avatarError, setAvatarError] = useState("");



  const fileInputRef = useRef(null);

  // ---------- EMPLOYEE CONTEXT ----------
  const isAdmin = user?.role === "ROLE_ADMIN";
  const empId = id
    ? id
    : user?.employeeId || null;


  useEffect(() => {
    if (isAdmin && !id) {
      setEmployee({
        firstName: user.username,
        lastName: "",
        email: user.email,
        role: user.role,
        employeeId: "ADMIN",
        designation: "Administrator",
        isActive: true,
      });
      return;
    }

    if (!empId) return;

    const fetchEmployeeData = async () => {
      try {
        const response = await employeeApi.getById(empId);
        setEmployee(response?.data?.data);



      } catch (err) {
        setError("Failed to load employee data");
      }
    };

    fetchEmployeeData();
  }, [empId, isAdmin, id, user]);


  const isViewingOtherEmployee = isAdmin && id;

  const handleAvatarClick = () => {
    if (uploading || isViewingOtherEmployee) return;
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };


  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    setAvatarError("");
    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("avatar", compressedFile);

      const res = await employeeApi.uploadAvatar(empId, formData);

      setEmployee(prev => ({
        ...prev,
        avatar: res.data.data.avatar,
      }));

      setPreview(null);
    } catch (err) {
      console.error(err);
      setAvatarError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };


  const handleResign = async () => {
    if (!window.confirm("Are you sure you want to resign this employee?")) return;

    try {
      await employeeApi.resignEmployee({
        employeeId: empId,
        reason: "Resigned by admin",
      });

      setEmployee(prev => ({
        ...prev,
        isActive: false,
        resignationDate: new Date().toISOString(),
      }));
    } catch (err) {
      alert("Failed to resign employee");
    }
  };

  const handleReactivate = async () => {
    if (!window.confirm("Re-activate this employee?")) return;

    try {
      await employeeApi.reactivateEmployee(empId);

      setEmployee(prev => ({
        ...prev,
        isActive: true,
        resignationDate: null,
        resignationReason: null,
      }));
    } catch (err) {
      alert("Failed to reactivate employee");
    }
  };


  if (employee === null) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }


  return (
    <>
      <div className="employee-profile">
        {error && <p className="text-danger">{error}</p>}

        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-info">


            <div
              className={`profile-avatar  ${uploading ? "disabled" : ""}`}
              onClick={handleAvatarClick}
            >

              {employee?.avatar ? (
                <img
                  src={preview || employee?.avatar || "/profile.jpg"}
                  alt="profile"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.dataset.fallback = "true";
                      e.currentTarget.src = "/profile.jpg";
                    }
                  }}
                />

              ) : (
                <div className="avatar-placeholder">
                  {`${employee?.firstName?.[0] || ""}${employee?.lastName?.[0] || ""}`.toUpperCase()}
                </div>
              )}

              {avatarError && (
                <small className="text-danger mt-1">{avatarError}</small>
              )}

              {!isAdmin && (
                <div className="avatar-overlay">
                  <FaCamera />
                  <span>{uploading ? "Uploading..." : "Change"}</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="profile-meta">
              <h2 className="profile-name">
                {employee.firstName
                  ? `${employee.firstName} ${employee.lastName || ""}`
                  : "Admin"}
              </h2>

              <p className="text-muted">{employee.designation}</p>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span
                  className={`status-badge ${employee?.isActive ? "active" : "inactive"
                    }`}
                >
                  {employee?.isActive ? "ACTIVE" : "INACTIVE"}
                </span>

                {employee.resignationDate && (
                  <small className="text-muted">
                    Resigned on{" "}
                    {new Date(employee.resignationDate).toLocaleDateString()}
                  </small>
                )}
              </div>

              {isAdmin && id && (
                <div className="mt-3 d-flex gap-2">
                  {employee?.isActive ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleResign}
                    >
                      Resign Employee
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleReactivate}
                    >
                      Re-Activate Employee
                    </button>
                  )}
                </div>
              )}


              <div className="employee-meta">
                <span><FaIdCard className="me-2" /> Employee ID: {employee.employeeId || "N/A"}</span>
                <span><FaUserTie className="me-2" /> {employee.departmentName || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {!(isAdmin && !id) && (
          <Tabs className="mb-4 profile-tabs">
            <Tab eventKey="profile" title="Profile">
              <Row className="mt-4">
                <Col md={8}>
                  <Card className="mb-4">
                    <Card.Header>Personal Information</Card.Header>
                    <Card.Body>
                      <Row className="mb-3">
                        <Col md={6}>
                          <p className="mb-1"><FaUser className="me-2" /> <strong>First Name:</strong></p>
                          <p>{employee.firstName || "N/A"}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><FaUserTag className="me-2" /> <strong>Last Name:</strong></p>
                          <p>{employee.lastName || "N/A"}</p>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <p className="mb-1"><FaEnvelope className="me-2" /> <strong>Email:</strong></p>
                          <p>{employee.email || "N/A"}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><FaPhone className="me-2" /> <strong>Phone:</strong></p>
                          <p>{employee.phone || "N/A"}</p>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <p className="mb-1"><FaCalendarAlt className="me-2" /> <strong>Joining Date:</strong></p>
                          <p>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><FaCalendarAlt className="me-2" /> <strong>Date of Birth:</strong></p>
                          <p>{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><FaMapMarkerAlt className="me-2" /> <strong>Address:</strong></p>
                          <p>{employee.address || "N/A"}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        )}
      </div >
      {/* ADMIN PROFILE */}
      {isAdmin && !id && (
        <Card className="p-3">
          <h4>Admin Profile</h4>
          <p>
            <strong>Name:</strong>{" "}
            {employee.firstName
              ? `${employee.firstName} ${employee.lastName || ""}`
              : "Admin"}
          </p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Role:</strong> ADMIN</p>
        </Card>
      )}
    </>
  );
};

export default EmployeeProfile;
