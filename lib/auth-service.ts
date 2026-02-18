export const BASE_URL = "http://10.10.13.16:8700/api";

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const handleUnauthorized = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/auth/login";
  }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error("Unauthorized");
  }

  return response.json();
};

export const authApi = {
  login: async (data: any) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  resendOtp: async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  setNewPassword: async (data: any) => {
    const response = await fetch(`${BASE_URL}/auth/set-new-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Dashboard APIs
  getDashboardStats: () => fetchWithAuth(`${BASE_URL}/admin/dashboard/stats/`),
  getRecentActivity: () => fetchWithAuth(`${BASE_URL}/admin/recent-activity/`),
  getQuickStats: () => fetchWithAuth(`${BASE_URL}/admin/dashboard/quick-stats/`),

  // Product APIs
  getApprovedProducts: (page = 1) => 
    fetchWithAuth(`${BASE_URL}/admin/products-approved/list/?page=${page}`),
  
  getPendingProducts: (page = 1) => 
    fetchWithAuth(`${BASE_URL}/admin/products-pending/list/?page=${page}`),
  
  getRejectedProducts: (page = 1) => 
    fetchWithAuth(`${BASE_URL}/admin/products-rejected/list/?page=${page}`),

  getProductDetails: (id: number) =>
    fetchWithAuth(`${BASE_URL}/admin/product/${id}`),

  approveProduct: (id: number) => 
    fetchWithAuth(`${BASE_URL}/admin/product/${id}/approve/`, { method: "PATCH" }),

  rejectProduct: (id: number) => 
    fetchWithAuth(`${BASE_URL}/admin/product/${id}/reject/`, { method: "PATCH" }),

  createInStoreProduct: (data: any) => 
    fetchWithAuth(`${BASE_URL}/admin/product/instore-create/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createOnlineProduct: (data: any) => 
    fetchWithAuth(`${BASE_URL}/admin/product/online-create/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // User Management APIs
  getUsers: (page = 1, email = "") => {
    let url = `${BASE_URL}/admin/users/list/?page=${page}`;
    if (email) {
      url += `&email=${encodeURIComponent(email)}`;
    }
    return fetchWithAuth(url);
  },
  
  suspendUser: (id: number) => 
    fetchWithAuth(`${BASE_URL}/admin/user/suspend/`, {
      method: "POST",
      body: JSON.stringify({ user_id: id }),
    }),

  reactivateUser: (id: number) => 
    fetchWithAuth(`${BASE_URL}/admin/user/reactivate/`, {
      method: "POST",
      body: JSON.stringify({ user_id: id }),
    }),

  deleteUser: (id: number) => 
    fetchWithAuth(`${BASE_URL}/admin/user/delete/`, {
      method: "POST",
      body: JSON.stringify({ user_id: id }),
    }),
};
