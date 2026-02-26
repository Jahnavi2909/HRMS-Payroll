import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
          <Card className="text-center shadow" style={{ maxWidth: '500px' }}>
            <Card.Body className="p-5">
              <FaExclamationTriangle size={48} className="text-danger mb-3" />
              <h2 className="mb-3">Oops! Something went wrong</h2>
              <p className="text-muted mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </p>

              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={this.handleRetry}>
                  <FaRedo className="me-2" />
                  Try Again
                </Button>
                <Button variant="outline-secondary" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="warning" className="mt-4 text-start">
                  <strong>Development Error Details:</strong>
                  <pre className="mt-2" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;