import apiClient from "./apiCient";


export const salaryStructureApi = {
  create: (data) =>
    apiClient.post(`/api/payroll/salary-structure`, data),

  getByEmployee: (employeeId) =>
    apiClient.get(`/api/payroll/salary-structure/${employeeId}`),

  update: (employeeId, data) =>
    apiClient.put(`/api/payroll/salary-structure/${employeeId}`, data),

  getAll: () =>
    apiClient.get(`/api/payroll/salary-structure`),
};
