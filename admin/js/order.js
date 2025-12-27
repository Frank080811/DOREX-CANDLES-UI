/* ================= AUTH GUARD ================= */
if (!localStorage.getItem("adminToken")) {
    window.location.href = "admin-login.html";
  }
  
  /* ================= LOGOUT ================= */
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
  });
  
  import { apiFetch, API_BASE } from "./api.js";
  
  /* ================= GET ORDER ID ================= */
  const id = new URLSearchParams(window.location.search).get("id");
  
  if (!id) {
    alert("Missing order ID");
    location.href = "orders.html";
  }
  
  /* ================= LOAD ORDER ================= */
  (async () => {
    try {
      const data = await apiFetch(`/order/${id}`);
  
      document.getElementById("orderInfo").innerHTML = `
        <p><strong>Customer:</strong> ${data.order.customer_name}</p>
        <p><strong>Email:</strong> ${data.order.email}</p>
        <p><strong>Total:</strong> $${Number(data.order.total).toFixed(2)}</p>
        <p><strong>Status:</strong>
          <span class="status ${data.order.status.toLowerCase()}">
            ${data.order.status}
          </span>
        </p>
      `;
  
      /* ================= DOWNLOAD LABEL (JWT SAFE) ================= */
      document.getElementById("downloadLabel").onclick = async () => {
        try {
          const res = await fetch(
            `${API_BASE}/admin/orders/${id}/label`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
              }
            }
          );
  
          if (!res.ok) throw new Error("Unauthorized");
  
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
  
        } catch (err) {
          alert("Failed to download label (unauthorized)");
        }
      };
  
      /* ================= RESEND EMAIL ================= */
      document.querySelector(".email-btn").onclick = async (e) => {
        const btn = e.currentTarget;
        setLoading(btn, "Sending…");
  
        try {
          await apiFetch(`/admin/orders/${id}/resend-email`, {
            method: "POST"
          });
          alert("Confirmation email resent successfully.");
        } catch {
          alert("Failed to resend email.");
        } finally {
          clearLoading(btn);
        }
      };
  
      /* ================= VIEW INVOICE ================= */
      document.getElementById("viewInvoice")?.addEventListener("click", async () => {
        try {
          const res = await fetch(
            `${API_BASE}/admin/orders/${id}/invoice`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
              }
            }
          );
  
          if (!res.ok) throw new Error("Unauthorized");
  
          const blob = await res.blob();
          window.open(URL.createObjectURL(blob));
  
        } catch {
          alert("Unable to open invoice.");
        }
      });
  
    } catch (err) {
      console.error("Order fetch failed:", err);
      alert("Unable to load order.");
    }
  })();
  
  /* ================= NAV ACTIVE STATE ================= */
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.href === location.href) {
      link.classList.add("active");
    }
  });
  
  /* ================= BUTTON UX HELPERS ================= */
  function setLoading(btn, text = "Processing…") {
    btn.classList.add("loading");
    btn.disabled = true;
    btn.dataset.original = btn.innerText;
    btn.innerText = text;
  }
  
  function clearLoading(btn) {
    btn.classList.remove("loading");
    btn.disabled = false;
    btn.innerText = btn.dataset.original;
  }
  