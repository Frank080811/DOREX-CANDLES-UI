if (!localStorage.getItem("adminToken")) {
    window.location.href = "admin-login.html";
  }  

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
  });
  
import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {

  /* ================= FETCH ORDERS ================= */
  let orders = [];

  try {
    orders = await apiFetch("/admin/orders");
  } catch (err) {
    console.error("Failed to fetch orders", err);
    return;
  }

  /* ================= EMPTY STATE ================= */
  if (!orders.length) {
    document.getElementById("totalRevenue").textContent = "$0.00";
    document.getElementById("totalOrders").textContent = "0";
    document.getElementById("avgOrder").textContent = "$0.00";
    document.getElementById("ordersCount").textContent = "0";
    document.getElementById("paidCount").textContent = "0";
    document.getElementById("pendingCount").textContent = "0";
    document.getElementById("todayRevenue").textContent = "$0.00";
    return;
  }

  /* ================= PROCESS DATA ================= */
  const paidOrders = orders.filter(o => o.status === "PAID");
  const pendingOrders = orders.filter(o => o.status === "PENDING");

  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  const totalOrders = orders.length;
  const avgOrder = paidOrders.length
    ? totalRevenue / paidOrders.length
    : 0;

  /* ================= TODAY REVENUE ================= */
  const today = new Date().toDateString();

  const todayRevenue = paidOrders
    .filter(o => new Date(o.created_at).toDateString() === today)
    .reduce((s, o) => s + Number(o.total), 0);

  /* ================= KPI RENDER ================= */
  document.getElementById("totalRevenue").textContent =
    `$${totalRevenue.toFixed(2)}`;

  document.getElementById("totalOrders").textContent =
    totalOrders;

  document.getElementById("avgOrder").textContent =
    `$${avgOrder.toFixed(2)}`;

  document.getElementById("ordersCount").textContent =
    totalOrders;

  document.getElementById("paidCount").textContent =
    paidOrders.length;

  document.getElementById("pendingCount").textContent =
    pendingOrders.length;

  document.getElementById("todayRevenue").textContent =
    `$${todayRevenue.toFixed(2)}`;

  /* ================= REVENUE BY DAY (LAST 7 DAYS) ================= */
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const revenueByDay = last7Days.map(date => {
    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    const revenue = paidOrders
      .filter(o =>
        new Date(o.created_at).toDateString() === date.toDateString()
      )
      .reduce((s, o) => s + Number(o.total), 0);

    return { day: label, revenue };
  });

  /* ================= REVENUE LINE CHART ================= */
  new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: revenueByDay.map(d => d.day),
      datasets: [{
        label: "Revenue ($)",
        data: revenueByDay.map(d => d.revenue),
        borderColor: "#ff7a00",
        backgroundColor: "rgba(255,122,0,.18)",
        tension: 0.45,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: "easeOutQuart"
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#111",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#eee" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  /* ================= ORDERS STATUS CHART ================= */
  new Chart(document.getElementById("ordersChart"), {
    type: "doughnut",
    data: {
      labels: ["Paid", "Pending"],
      datasets: [{
        data: [paidOrders.length, pendingOrders.length],
        backgroundColor: ["#ff7a00", "#ddd"],
        hoverOffset: 10
      }]
    },
    options: {
      cutout: "65%",
      animation: {
        animateScale: true,
        duration: 1000
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12
          }
        }
      }
    }
  });

});
