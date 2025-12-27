export const API_BASE = "https://iluminous-candle-uk-be.onrender.com";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
    throw new Error("Unauthorized");
  }

  return res.json();
}

export async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
