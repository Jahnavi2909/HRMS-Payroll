import React from 'react';
import { Card, Row, Col, Placeholder } from 'react-bootstrap';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderCardSkeleton = () => (
    <Card className="mb-3">
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="primary" xs={6} />
      </Card.Body>
    </Card>
  );

  const renderTableSkeleton = () => (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th><Placeholder xs={4} /></th>
            <th><Placeholder xs={3} /></th>
            <th><Placeholder xs={3} /></th>
            <th><Placeholder xs={2} /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td><Placeholder xs={6} /></td>
              <td><Placeholder xs={4} /></td>
              <td><Placeholder xs={3} /></td>
              <td><Placeholder xs={2} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFormSkeleton = () => (
    <Card>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={3} />
            </Placeholder>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '38px' }} />
            </Placeholder>
          </Col>
          <Col md={6}>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={3} />
            </Placeholder>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '38px' }} />
            </Placeholder>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={3} />
            </Placeholder>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '38px' }} />
            </Placeholder>
          </Col>
          <Col md={6}>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={3} />
            </Placeholder>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={12} style={{ height: '38px' }} />
            </Placeholder>
          </Col>
        </Row>
        <Placeholder.Button variant="primary" xs={3} />
      </Card.Body>
    </Card>
  );

  const renderDashboardSkeleton = () => (
    <>
      <Row className="mb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Col lg={3} md={6} sm={12} key={index} className="mb-3">
            <Card>
              <Card.Body className="text-center">
                <Placeholder as="div" animation="glow" className="mb-2">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as="h2" animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} md={12} className="mb-3">
          <Card>
            <Card.Header>
              <Placeholder xs={4} />
            </Card.Header>
            <Card.Body>
              <Placeholder as="div" animation="glow" style={{ height: '300px' }}>
                <Placeholder xs={12} style={{ height: '100%' }} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12}>
          <Card>
            <Card.Header>
              <Placeholder xs={4} />
            </Card.Header>
            <Card.Body>
              <Placeholder as="div" animation="glow" style={{ height: '300px' }}>
                <Placeholder xs={12} style={{ height: '100%' }} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

  switch (type) {
    case 'table':
      return renderTableSkeleton();
    case 'form':
      return renderFormSkeleton();
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'card':
    default:
      return Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderCardSkeleton()}</div>
      ));
  }
};

export default LoadingSkeleton;