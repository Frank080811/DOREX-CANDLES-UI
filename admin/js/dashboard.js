import { apiFetch } from "./api.js";

fetch("/admin/analytics", { headers })
  .then(r => r.json())
  .then(d => {
    rev.textContent = `$${d.totalRevenue.toFixed(2)}`;
    orders.textContent = d.totalOrders;
    today.textContent = `$${d.todayRevenue.toFixed(2)}`;
  });


(async () => {
  const orders = await apiFetch("/admin/orders");

  document.getElementById("ordersCount").textContent =
    `${orders.length} Orders`;

  document.getElementById("paidCount").textContent =
    orders.filter(o => o.status === "PAID").length + " Paid";

  document.getElementById("pendingCount").textContent =
    orders.filter(o => o.status !== "PAID").length + " Pending";
})();

/* Highlight active page */
document.querySelectorAll(".nav-link").forEach(link=>{
    if(link.href === location.href){
      link.classList.add("active");
    }
  });
  
  /* Logout */
  document.getElementById("logoutBtn")?.addEventListener("click",()=>{
    localStorage.removeItem("adminToken");
    location.href="admin-login.html";
  });
  