const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = (data && data.message) || (typeof data === 'string' ? data : 'Erro na requisição');
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const authAPI = {
  register: async ({ name, email, password }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(res);
  },

  login: async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export const clothesAPI = {
  // Lista roupas: do usuário autenticado ou catálogo público se catalog=true
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/clothes${query ? `?${query}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE}/clothes/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  create: async (clothingData) => {
    const res = await fetch(`${API_BASE}/clothes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(clothingData)
    });
    return handleResponse(res);
  },

  update: async (id, clothingData) => {
    const res = await fetch(`${API_BASE}/clothes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(clothingData)
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE}/clothes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export default { authAPI, clothesAPI };
