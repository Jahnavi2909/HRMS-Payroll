import apiClient from "./apiCient";

export const attendanceApi = {
  // Check-in/Check-out
  checkIn: (employeeId, payload) => apiClient.post(`/api/attendance/check-in/${employeeId}`, null, { params: payload }),
  checkOut: (employeeId) => apiClient.post(`/api/attendance/check-out/${employeeId}`),
  
  // Today's Attendance
  getTodayAttendanceByEmployee: (employeeId) => apiClient.get(`/api/attendance/today/${employeeId}`),
  getTodayAttendance: () => apiClient.get(`/api/attendance/today`),
  
  // Attendance by Date
  getAttendanceByDate: (date) => apiClient.get(`/api/attendance/by-date?date=${date}`),
  getMyAttendanceByDate: (date) => apiClient.get(`/api/attendance/by-date/me`, { params: { date } }),
  getAttendanceByDateWithFallback: (date, employeeId) => apiClient.get("/attendance/by-date-fallback", { params: { date, employeeId } }),
  
  // Attendance History
  getAttendanceHistory: (id, year, month, page, size) =>
    apiClient.get(`/api/attendance/history/${id}`, {
      params: { year, month, page, size }
    }),
  
  // Monthly Attendance
  getMonthlyAttendance: (employeeId, year, month) =>
    apiClient.get(`/api/attendance/monthly/${employeeId}`, { params: { year, month } }),
  
  // Weekly Timeline
  getWeeklyTimeline: (employeeId, weekStart) => {
    const params = { weekStart };
    if (employeeId) params.employeeId = employeeId;
    return apiClient.get("/api/attendance/weekly/timeline", { params });
  },
  getMyWeeklyTimeline: (weekStart) =>
    apiClient.get("/api/attendance/timeline/me", { params: { weekStart } }),
  getAllWeeklyTimeline: (weekStart) =>
    apiClient.get("/api/attendance/timeline/all", { params: { weekStart } }),
  
  // Weekly Summary
  getWeeklySummary: (weekStart, employeeId) =>
    employeeId
      ? apiClient.get(`/api/attendance/weekly/${employeeId}`, { params: { weekStart } })
      : apiClient.get(`/api/attendance/weekly`, { params: { weekStart } }),
  getMyWeeklySummary: (weekStart, employeeId) => {
    const params = { weekStart };
    if (employeeId) {
      params.employeeId = employeeId;
    }
    return apiClient.get("/api/attendance/summary/me", { params });
  },
  
  // Monthly Summary (for dashboard)
  getMonthlySummaryByEmployee: (employeeId, year, month) =>
    apiClient.get("/api/attendance/monthly", {
      params: { year, month, employeeId },
    }),
  getMyMonthlySummary: (year, month) =>
    apiClient.get(`/api/attendance/monthly-summary/me`, { params: { year, month } }),
  getMonthlySummaryAll: (year, month) =>
    apiClient.get("/api/attendance/monthly/all", {
      params: { year, month },
    }),
  
  // Company-wide Summary (for Admin/HR)
  getCompanyMonthlySummary: (year, month) =>
    apiClient.get(`/api/attendance/company-summary`, { params: { year, month } }),
  
  // Auto Checkout
  autoCheckout: () => apiClient.post("/attendance/auto-checkout"),
  
  // Attendance Statistics
  getAttendanceStats: (employeeId, year, month) =>
    apiClient.get(`/api/attendance/stats/${employeeId}`, { params: { year, month } }),
  getMyAttendanceStats: (year, month) =>
    apiClient.get(`/api/attendance/stats/me`, { params: { year, month } }),
  getCompanyAttendanceStats: (year, month) =>
    apiClient.get(`/api/attendance/company-stats`, { params: { year, month } }),
};
