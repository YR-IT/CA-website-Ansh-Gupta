import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword })
};

// Services API (Public)
export const servicesAPI = {
  getAll: (page?: number, limit?: number) =>
    api.get('/services', { params: { page, limit } }),
  getBySlug: (slug: string) => api.get(`/services/${slug}`)
};

// Blogs API (Public)
export const blogsAPI = {
  getAll: (page: number = 1, limit: number = 9, category?: string) =>
    api.get('/blogs', { params: { page, limit, category } }),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  getCategories: () => api.get('/blogs/categories')
};

// Contact API (Public)
export const contactAPI = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => api.post('/contact', data)
};

// FAQ API (Public)
export const faqAPI = {
  getAll: (category?: string) =>
    api.get('/faq', { params: { category } }),
  getCategories: () => api.get('/faq/categories')
};

// About Us API (Public)
export const aboutUsAPI = {
  get: () => api.get('/aboutus')
};

// Admin API
export const adminAPI = {
  // Stats
  getStats: () => api.get('/admin/stats'),

  // Services
  getServices: (page: number = 1, limit: number = 10) =>
    api.get('/admin/services', { params: { page, limit } }),
  getService: (id: string) => api.get(`/admin/services/${id}`),
  createService: (data: FormData) =>
    api.post('/admin/services', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateService: (id: string, data: FormData) =>
    api.put(`/admin/services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`),

  // Blogs
  getBlogs: (page: number = 1, limit: number = 10) =>
    api.get('/admin/blogs', { params: { page, limit } }),
  getBlog: (id: string) => api.get(`/admin/blogs/${id}`),
  createBlog: (data: FormData) =>
    api.post('/admin/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateBlog: (id: string, data: FormData) =>
    api.put(`/admin/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteBlog: (id: string) => api.delete(`/admin/blogs/${id}`),

  // Contacts
  getContacts: (page: number = 1, limit: number = 20) =>
    api.get('/admin/contacts', { params: { page, limit } }),
  markContactRead: (id: string) => api.put(`/admin/contacts/${id}/read`),
  deleteContact: (id: string) => api.delete(`/admin/contacts/${id}`),

  // FAQs
  getFaqs: (page: number = 1, limit: number = 50) =>
    api.get('/admin/faqs', { params: { page, limit } }),
  getFaq: (id: string) => api.get(`/admin/faqs/${id}`),
  createFaq: (data: { question: string; answer: string; category: string; isActive?: boolean; order?: number }) =>
    api.post('/admin/faqs', data),
  updateFaq: (id: string, data: { question?: string; answer?: string; category?: string; isActive?: boolean; order?: number }) =>
    api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id: string) => api.delete(`/admin/faqs/${id}`),

  // About Us
  getAboutUs: () => api.get('/admin/aboutus'),
  updateAboutUs: (data: FormData) =>
    api.put('/admin/aboutus', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Categories
  getCategories: (type: 'faq' | 'blog') =>
    api.get('/admin/categories', { params: { type } }),
  createCategory: (data: { name: string; type: 'faq' | 'blog'; icon?: string; order?: number }) =>
    api.post('/admin/categories', data),
  updateCategory: (id: string, data: { name?: string; icon?: string; order?: number; isActive?: boolean }) =>
    api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`)
};

export default api;
