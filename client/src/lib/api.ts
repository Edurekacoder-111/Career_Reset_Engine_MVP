import { apiRequest } from "./queryClient";

export const api = {
  // Users
  createUser: async (userData: { email: string; whatsapp?: string }) => {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json();
  },

  getUserByEmail: async (email: string) => {
    const response = await apiRequest("GET", `/api/users/${email}`);
    return response.json();
  },

  // Progress
  getUserProgress: async (userId: number) => {
    const response = await apiRequest("GET", `/api/progress/${userId}`);
    return response.json();
  },

  updateUserProgress: async (userId: number, updates: any) => {
    const response = await apiRequest("PATCH", `/api/progress/${userId}`, updates);
    return response.json();
  },

  // Roles
  getRoles: async () => {
    const response = await apiRequest("GET", "/api/roles");
    return response.json();
  },

  getRole: async (id: number) => {
    const response = await apiRequest("GET", `/api/roles/${id}`);
    return response.json();
  },

  getUserRoles: async (userId: number) => {
    const response = await apiRequest("GET", `/api/users/${userId}/roles`);
    return response.json();
  },

  addUserRole: async (userId: number, roleId: number, isShortlisted = false) => {
    const response = await apiRequest("POST", `/api/users/${userId}/roles/${roleId}`, { isShortlisted });
    return response.json();
  },

  updateUserRole: async (userId: number, roleId: number, updates: any) => {
    const response = await apiRequest("PATCH", `/api/users/${userId}/roles/${roleId}`, updates);
    return response.json();
  },

  // Applications
  getUserApplications: async (userId: number) => {
    const response = await apiRequest("GET", `/api/users/${userId}/applications`);
    return response.json();
  },

  createApplication: async (applicationData: any) => {
    const response = await apiRequest("POST", "/api/applications", applicationData);
    return response.json();
  },

  updateApplication: async (id: number, updates: any) => {
    const response = await apiRequest("PATCH", `/api/applications/${id}`, updates);
    return response.json();
  },

  // Confidence
  addConfidenceEntry: async (userId: number, confidenceLevel: number) => {
    const response = await apiRequest("POST", "/api/confidence", { userId, confidenceLevel });
    return response.json();
  },

  getUserConfidenceHistory: async (userId: number) => {
    const response = await apiRequest("GET", `/api/users/${userId}/confidence`);
    return response.json();
  },

  // Waitlist
  addToWaitlist: async (email: string, type: string) => {
    const response = await apiRequest("POST", "/api/waitlist", { email, type });
    return response.json();
  },
};
