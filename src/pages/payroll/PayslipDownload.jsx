import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { downloadPayslip } from "../../api/payrollApi";

const PayslipDownload = () => {
  const { payrollId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payrollId]);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await downloadPayslip(payrollId, {
        responseType: "blob", // important to receive binary PDF
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip_${payrollId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setLoading(false);
      // Optionally navigate back after download
      navigate(-1);
    } catch (err) {
      console.error("Payslip download failed:", err);
      setError("Failed to download payslip. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">Downloading Payslip...</p>
          <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
          Go Back
        </Button>
      </Container>
    );
  }

  return null;
};

export default PayslipDownload;
