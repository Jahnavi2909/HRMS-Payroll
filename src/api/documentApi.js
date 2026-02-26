import apiClient from "./apiCient";

export const documentApi = {
  upload: (formData, onUploadProgress) =>
    apiClient.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }),

  getEmployeeDocuments: (employeeId) =>
    apiClient.get(`/api/documents/employee/${employeeId}`),

  download: (documentId) =>
    apiClient.get(`/api/documents/${documentId}/download`, {
      responseType: "blob",
    }),
};
