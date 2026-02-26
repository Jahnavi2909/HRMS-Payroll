import apiClient from "./apiCient";


export const employeeApi = {
  getAllEmployee: () =>
    apiClient.get(`/api/employees/get-all-employees`),

  getById: (id) => apiClient.get(`/api/employees/${id}`),

  getEmployeeByDepartment: (deptId) =>
    apiClient.get(`/api/employees/department/${deptId}`),

  create: (data) =>
    apiClient.post(`/api/employees`, data),

  update: (id, data) =>
    apiClient.put(`/api/employees/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/api/employees/${id}`),
};
