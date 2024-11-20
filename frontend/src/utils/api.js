const API_BASE = '/api/v1';

export const fetchData = async (url, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${url}`, { method, headers, body: body ? JSON.stringify(body) : null });
    return response.json();
};
