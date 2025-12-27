export const API_BASE =
  "https://iluminous-candle-uk-be.onrender.com";

export async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
