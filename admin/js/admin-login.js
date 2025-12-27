const API_BASE = "https://iluminous-candle-uk-be.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    // ✅ Store token
    localStorage.setItem("adminToken", data.access_token);

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (err) {
    errorMsg.textContent = "Invalid email or password";
  }
});
