import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup, Badge, Dropdown, Card } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaUser, FaDollarSign } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchAndFilter = ({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  filters = [],
  showDateRange = false,
  showAmountRange = false,
  showUserFilter = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [selectedUser, setSelectedUser] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const removeFilter = (filterKey) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setDateRange({ start: null, end: null });
    setAmountRange({ min: '', max: '' });
    setSelectedUser('');
    onFilter({});
  };

  const applyAdvancedFilters = () => {
    const advancedFilters = { ...activeFilters };

    if (dateRange.start && dateRange.end) {
      advancedFilters.dateRange = dateRange;
    }

    if (amountRange.min || amountRange.max) {
      advancedFilters.amountRange = amountRange;
    }

    if (selectedUser) {
      advancedFilters.user = selectedUser;
    }

    setActiveFilters(advancedFilters);
    onFilter(advancedFilters);
    setShowAdvanced(false);
  };

  const activeFilterCount = Object.keys(activeFilters).length +
    (dateRange.start && dateRange.end ? 1 : 0) +
    ((amountRange.min || amountRange.max) ? 1 : 0) +
    (selectedUser ? 1 : 0);

  return (
    <div className="mb-4">
      {/* Basic Search */}
      <Form onSubmit={handleSearch} className="mb-3">
        <Row className="g-2">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                <FaSearch className="me-1" />
                Search
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="position-relative"
              >
                <FaFilter className="me-1" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge bg="primary" className="position-absolute top-0 start-100 translate-middle">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <small className="text-muted me-2">Active filters:</small>
            {Object.entries(activeFilters).map(([key, value]) => (
              <Badge key={key} bg="secondary" className="d-flex align-items-center gap-1">
                {key}: {value}
                <FaTimes
                  size={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeFilter(key)}
                />
              </Badge>
            ))}
            {dateRange.start && dateRange.end && (
              <Badge bg="info" className="d-flex align-items-center gap-1">
                Date: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                <FaTimes
                  size={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setDateRange({ start: null, end: null });
                    const newFilters = { ...activeFilters };
                    delete newFilters.dateRange;
                    setActiveFilters(newFilters);
                    onFilter(newFilters);
                  }}
                />
              </Badge>
            )}
            {(amountRange.min || amountRange.max) && (
              <Badge bg="success" className="d-flex align-items-center gap-1">
                Amount: {amountRange.min || '0'} - {amountRange.max || '∞'}
                <FaTimes
                  size={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setAmountRange({ min: '', max: '' });
                    const newFilters = { ...activeFilters };
                    delete newFilters.amountRange;
                    setActiveFilters(newFilters);
                    onFilter(newFilters);
                  }}
                />
              </Badge>
            )}
            {selectedUser && (
              <Badge bg="warning" className="d-flex align-items-center gap-1">
                User: {selectedUser}
                <FaTimes
                  size={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedUser('');
                    const newFilters = { ...activeFilters };
                    delete newFilters.user;
                    setActiveFilters(newFilters);
                    onFilter(newFilters);
                  }}
                />
              </Badge>
            )}
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none p-0 ms-2"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="mb-3 border">
          <Card.Body>
            <Row className="g-3">
              {/* Custom Filters */}
              {filters.map((filter) => (
                <Col md={3} key={filter.key}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">{filter.label}</Form.Label>
                    {filter.type === 'select' ? (
                      <Form.Select
                        size="sm"
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        size="sm"
                        type={filter.type || 'text'}
                        placeholder={`Filter by ${filter.label}`}
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}

              {/* Date Range Filter */}
              {showDateRange && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaCalendarAlt className="me-1" />
                      Date Range
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <DatePicker
                        selected={dateRange.start}
                        onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                        selectsStart
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        placeholderText="Start date"
                        className="form-control form-control-sm"
                        dateFormat="dd/MM/yyyy"
                      />
                      <DatePicker
                        selected={dateRange.end}
                        onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                        selectsEnd
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        minDate={dateRange.start}
                        placeholderText="End date"
                        className="form-control form-control-sm"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </Form.Group>
                </Col>
              )}

              {/* Amount Range Filter */}
              {showAmountRange && (
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaDollarSign className="me-1" />
                      Amount Range
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="Min"
                        value={amountRange.min}
                        onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                      <Form.Control
                        size="sm"
                        type="number"
                        placeholder="Max"
                        value={amountRange.max}
                        onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </Form.Group>
                </Col>
              )}

              {/* User Filter */}
              {showUserFilter && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaUser className="me-1" />
                      User
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Search user..."
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="outline-secondary" size="sm" onClick={() => setShowAdvanced(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={applyAdvancedFilters}>
                Apply Filters
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilter;