// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Face API
export const faceAPI = {
  loadModels: () => api.get('/faces/load-models'),
  registerFace: (image) => api.post('/faces/register', { image }),
  recognizeFace: (image) => api.post('/faces/recognize', { image }),
  detectFaces: (image) => api.post('/faces/detect', { image }),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance', data),
  getAllAttendance: (params) => api.get('/attendance', { params }),
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
  getClassAttendance: (className, date) => api.get(`/attendance/class/${className}`, { params: { date } }),
  getStats: (params) => api.get('/attendance/stats', { params }),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/attendance/${id}`),
};

// Class API
export const classAPI = {
  getAllClasses: () => api.get('/classes'),
  getClassById: (id) => api.get(`/classes/${id}`),
  createClass: (data) => api.post('/classes', data),
  updateClass: (id, data) => api.put(`/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  addStudentToClass: (classId, studentId) => api.post(`/classes/${classId}/students`, { studentId }),
  removeStudentFromClass: (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}`),
};

// User API (Admin)
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;