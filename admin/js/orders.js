import { apiFetch, API_BASE } from "./api.js";

/* ================== ELEMENTS ================== */
const body = document.getElementById("ordersBody");
const searchInput = document.getElementById("search");
const statusSelect = document.getElementById("status");

/* ================== LOAD ORDERS ================== */
async function loadOrders() {
  body.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center; padding:2rem;">
        Loading orders…
      </td>
    </tr>
  `;

  try {
    const orders = await apiFetch("/admin/orders");

    const query = searchInput?.value.toLowerCase() || "";
    const status = statusSelect?.value || "";

    const filtered = orders.filter(o => {
      const matchesSearch =
        o.id.toLowerCase().includes(query) ||
        (o.email || "").toLowerCase().includes(query);

      const matchesStatus = !status || o.status === status;

      return matchesSearch && matchesStatus;
    });

    body.innerHTML = "";

    if (!filtered.length) {
      body.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:2rem;">
            No orders found
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(o => {
      body.innerHTML += `
        <tr>
          <td>${o.id}</td>
          <td>${o.customer_name}</td>
          <td>
            <span class="status ${o.status.toLowerCase()}">
              ${o.status}
            </span>
          </td>
          <td>$${Number(o.total).toFixed(2)}</td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
          <td>
            <a href="order.html?id=${o.id}" class="btn-link">
              View
            </a>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Failed to load orders:", err);
    body.innerHTML = `
      <tr>
        <td colspan="6" style="color:red; text-align:center;">
          Failed to load orders
        </td>
      </tr>
    `;
  }
}

/* ================== EVENTS ================== */
searchInput?.addEventListener("input", loadOrders);
statusSelect?.addEventListener("change", loadOrders);

/* ================== INITIAL LOAD ================== */
loadOrders();

/* ================== NAV ACTIVE STATE ================== */
document.querySelectorAll(".nav-link").forEach(link => {
  if (link.href === location.href) {
    link.classList.add("active");
  }
});

/* ================== LOGOUT ================== */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  location.href = "admin-login.html";
});
