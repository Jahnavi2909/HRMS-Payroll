import { useEffect, useState } from "react";
import { salaryStructureApi } from "../../api/salaryStructureApi";
import { employeeApi } from "../../api/employeeApi";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

const SalaryStructure = () => {
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [form, setForm] = useState({
    basic: "",
    hra: "",
    allowance: "",
    pfPercent: "",
    taxPercent: ""
  });
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const res = await employeeApi.getAllEmployee();
        setEmployees(res.data.data || []);
        if (id) {
          setSelectedEmployeeId(id);
          setSelectedEmployeeId(res?.data[0].id);
        }
      } catch (err) {
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);


  useEffect(() => {
    if (!selectedEmployeeId) return;

    const loadStructure = async () => {
      try {
        setLoading(true);
        const res = await salaryStructureApi.getByEmployee(selectedEmployeeId);
        setForm(res.data.data || { basic: "", hra: "", allowance: "", pfPercent: "", taxPercent: "" });
        setExists(!!res.data.data);
        setError("");
      } catch (err) {
        setForm({ basic: "", hra: "", allowance: "", pfPercent: "", taxPercent: "" });
        setExists(false);
      } finally {
        setLoading(false);
      }
    };

    loadStructure();
  }, [selectedEmployeeId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
    setSuccess("");
    setError("");
  };

  const save = async () => {
    if (!selectedEmployeeId) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (exists) {
        await salaryStructureApi.update(selectedEmployeeId, form);
        setSuccess("Salary structure updated");
      } else {
        await salaryStructureApi.create({ employeeId: selectedEmployeeId, ...form });
        setSuccess("Salary structure created");
        setExists(true);
      }
    } catch (err) {
      setError("Failed to save salary structure");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <h2 className="mb-4">Salary Structure</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Employee</Form.Label>
              <Form.Control as="select" value={selectedEmployeeId} onChange={handleEmployeeChange}>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Basic Salary</Form.Label>
              <Form.Control
                type="number"
                name="basic"
                placeholder="Basic"
                value={form.basic}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>HRA</Form.Label>
              <Form.Control
                type="number"
                name="hra"
                placeholder="HRA"
                value={form.hra}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Allowance</Form.Label>
              <Form.Control
                type="number"
                name="allowance"
                placeholder="Allowance"
                value={form.allowance}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>PF Percent</Form.Label>
              <Form.Control
                type="number"
                name="pfPercent"
                placeholder="PF %"
                value={form.pfPercent}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tax Percent</Form.Label>
              <Form.Control
                type="number"
                name="taxPercent"
                placeholder="Tax %"
                value={form.taxPercent}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : (exists ? "Update" : "Create")}
        </Button>
      </Form>
    </Container>
  );
};

export default SalaryStructure;
