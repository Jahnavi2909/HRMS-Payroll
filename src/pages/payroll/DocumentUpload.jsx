import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
  ProgressBar,
  Modal
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import {
  FaFileUpload,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";
import { documentApi } from "../../api/documentApi";
import EmployeeSelector from "../../components/EmployeeSelector";
import { employeeApi } from "../../api/employeeApi";
import EmployeeDetails from "../../components/EmployeeDetails";

const DocumentUpload = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(user.employeeId);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [refreshDocs, setRefreshDocs] = useState(false);


  const isUploader =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_HR";

  const documentTypes = [
    { value: "form16", label: "Form 16", description: "Annual tax statement" },
    { value: "payslip", label: "Payslip", description: "Monthly salary slip" },
    { value: "tax_certificate", label: "Tax Certificate" },
    { value: "investment_proof", label: "Investment Proof" },
    { value: "other", label: "Other Documents" }
  ];


  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, PNG files are allowed";
    }
    if (file.size > maxSize) {
      return "File size must be under 5MB";
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      showError(validationError);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
    showSuccess(`Selected ${file.name}`);
  };


  const handleUpload = () => {
    if (!selectedFile || !documentType) {
      const msg = "Select document type and file";
      setError(msg);
      showError(msg);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmUpload = async () => {
    setShowConfirmModal(false);
    setUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);
      formData.append("employeeId", user.employeeId);
      formData.append("uploadedBy", user.id || user.employeeId);

      await documentApi.upload(formData, (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(percent);
      });

      setRefreshDocs(prev => !prev);

      setSuccess("Document uploaded successfully");
      showSuccess("Document uploaded successfully");

      setSelectedFile(null);
      setDocumentType("");
      document.getElementById("fileInput").value = "";

    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      showError(msg);
    } finally {
      setUploading(false);
    }
  };


  const handleEmployeeSelect = async (empId) => {
    setSelectedEmployeeId(empId);
    const res = await employeeApi.getById(empId);
    setSelectedEmployee(res.data?.data);
  };





  const selectedDocType = documentTypes.find(
    (d) => d.value === documentType
  );


  if (!isUploader) {
    return (
      <Container className="mt-4">
        <Alert variant="warning" className="d-flex align-items-center">
          <FaLock className="me-2" />
          Only <strong className="ms-1">Admin & HR</strong> can upload documents
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex align-items-center mb-4">
        <FaFileUpload size={28} className="text-primary me-3" />
        <div>
          <h4 className="mb-0">Document Upload</h4>
          <small className="text-muted">
            Secure payroll document upload
          </small>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Document Type *</Form.Label>
                    <Form.Select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <option value="">Select</option>
                      {documentTypes.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </Form.Select>
                    {selectedDocType && (
                      <small className="text-muted">
                        {selectedDocType.description}
                      </small>
                    )}
                  </Col>

                  <Col md={6}>
                    <Form.Label>File *</Form.Label>
                    <Form.Control
                      id="fileInput"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Col>
                </Row>

                {selectedFile && (
                  <Alert variant="info">
                    <FaCheckCircle className="me-2" />
                    {selectedFile.name}
                  </Alert>
                )}

                {uploading && (
                  <ProgressBar
                    animated
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    className="mb-3"
                  />
                )}

                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  <FaFileUpload className="me-2" />
                  Upload
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="my-4">
        <Col>
          <EmployeeSelector onSelect={handleEmployeeSelect} />
          <EmployeeDetails employee={selectedEmployee} />

        </Col>
      </Row>
      <Row>
        <Col>
          {/* EmployeeDocuments component was removed - add replacement if needed */}
        </Col>
      </Row>

      {/* CONFIRM MODAL */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Upload this document?</p>
          <strong>{selectedFile?.name}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpload}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DocumentUpload;
