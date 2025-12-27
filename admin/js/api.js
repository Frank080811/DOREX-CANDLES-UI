export const API_BASE =
  "https://iluminous-candle-uk-be.onrender.com";

/**
 * Centralized API fetch with JWT support
 */
export async function apiFetch(
  endpoint,
  options = {}
) {
  const token = localStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // 🔐 Attach JWT automatically for admin routes
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired or invalid → force logout
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}
