"use strict";

"use strict";

/* ================= TEXT REVEAL ================= */
window.addEventListener("load", () => {
  const heading = document.querySelector(".reveal-text");
  if (!heading) return;

  heading.style.transition =
    "opacity 1.2s cubic-bezier(0.19,1,0.22,1), transform 1.2s cubic-bezier(0.19,1,0.22,1)";
  heading.style.opacity = "1";
  heading.style.transform = "translateY(0)";
});


/* ================= SHOP FILTERS ================= */
(() => {
  const products = document.querySelectorAll(".shop-card");

  const categoryList = document.querySelector(".category-list");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const searchInput = document.getElementById("searchInput");

  if (!products.length) return;

  let activeCategory = "all";

  /* ---- AUTO-BUILD CATEGORIES ---- */
  const categories = ["all"];

  products.forEach(card => {
    const c = card.dataset.category;
    if (c && !categories.includes(c)) categories.push(c);
  });

  if (categoryList) {
    categoryList.innerHTML = "";

    categories.forEach(cat => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button data-category="${cat}" class="${cat === 'all' ? 'active' : ''}">
          ${cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      `;
      categoryList.appendChild(li);
    });
  }

  function filterProducts() {
    const maxPrice = Number(priceRange?.value || 9999);
    const query = (searchInput?.value || "").toLowerCase();

    products.forEach(card => {
      const price = Number(card.dataset.price);
      const category = card.dataset.category;
      const name = card.querySelector("h5")?.textContent.toLowerCase() || "";

      const matchCategory =
        activeCategory === "all" || category === activeCategory;

      const matchPrice = price <= maxPrice;
      const matchSearch = name.includes(query);

      card.style.display =
        matchCategory && matchPrice && matchSearch ? "" : "none";
    });
  }

  categoryList?.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    categoryList
      .querySelectorAll("button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    activeCategory = btn.dataset.category;
    filterProducts();
  });

  priceRange?.addEventListener("input", () => {
    priceValue.textContent = `$${priceRange.value}`;
    filterProducts();
  });

  searchInput?.addEventListener("input", filterProducts);
})();

/* ================= PARALLAX HERO PRODUCT ================= */
(() => {
  const img = document.querySelector(".hero-product img");
  if (!img) return;

  document.addEventListener("mousemove", e => {
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    img.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
})();

/* ================= CART DRAWER ================= */
(() => {
  const cartBtn = document.getElementById("openCart");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");

  if (!cartItemsEl) return;

  let cart = [];

  const openDrawer = () => {
    cartDrawer?.classList.add("active");
    cartOverlay?.classList.add("active");
  };

  const closeDrawer = () => {
    cartDrawer?.classList.remove("active");
    cartOverlay?.classList.remove("active");
  };

  cartBtn?.addEventListener("click", openDrawer);
  closeCart?.addEventListener("click", closeDrawer);
  cartOverlay?.addEventListener("click", closeDrawer);

  function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;

      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <div class="qty-controls">
            <button data-act="dec" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <button data-act="remove" data-id="${item.id}">✕</button>
      `;
      cartItemsEl.appendChild(el);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    cartCountEl.textContent = count;
  }

  function updateQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
    renderCart();
  }

  cartItemsEl.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (btn.dataset.act === "inc") updateQty(id, 1);
    if (btn.dataset.act === "dec") updateQty(id, -1);
    if (btn.dataset.act === "remove") {
      cart = cart.filter(p => p.id !== id);
      renderCart();
    }
  });

  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.push({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
        qty: 1
      });
      renderCart();
      openDrawer();
    });
  });
})();

/* ================= EXPERIENCE CARD REVEAL ================= */
(() => {
  const expCards = document.querySelectorAll(".exp-card");
  if (!expCards.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.3 }
  );

  expCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    observer.observe(card);
  });
})();

/* ================= FAQ ACCORDION ================= */
(() => {
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      document.querySelectorAll(".faq-item").forEach(i => {
        if (i !== item) {
          i.classList.remove("active");
          i.querySelector(".faq-icon").textContent = "+";
        }
      });
      item.classList.toggle("active");
      btn.querySelector(".faq-icon").textContent =
        item.classList.contains("active") ? "−" : "+";
    });
  });
})();

/* ================= HERO TITLE FINAL SYNC ================= */
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-content h1");
  heroTitle?.classList.add("is-visible");
});
