/* =========================
   ZooFeed – admin.js
   Повна логіка адмін-панелі
   ========================= */

/* УВАГА: $
   і $$ вже оголошені в data.js, тому тут їх НЕ переоголошуємо.
   Використовуємо ті, що прийшли з data.js.
*/

/* якщо moneyUAH не підтягнувся з data.js – зробимо fallback */
if (typeof moneyUAH === "undefined") {
  window.moneyUAH = n =>
    new Intl.NumberFormat("uk-UA").format(Number(n || 0)) + " ₴";
}

/* ---- ключі localStorage (мають збігатися з app.js) ---- */
/* LS_PRODUCTS тут НЕ оголошуємо – він уже є в data.js */
const LS_ORDERS   = "zf_orders";
const LS_REVIEWS  = "zf_reviews";
const LS_SETTINGS = "zf_settings";

/* ---- спільні стейти ---- */
/* PRODUCTS уже є в data.js (let PRODUCTS = []), тут тільки використовуємо */
let ORDERS = [];
let REVIEWS = [];
let FOOTER_SETTINGS = null;

/* вибрані елементи */
let currentProductId = null;
let currentOrderId = null;
let currentReviewIndex = null;

/* =========================
   ТАБИ
   ========================= */

function initTabs() {
  const tabs   = $$(".admin-tab[data-tab]");
  const panels = $$(".tab-panel[data-tab-panel]");

  function activateTab(key) {
    tabs.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.tab === key);
    });
    panels.forEach(p => {
      p.classList.toggle("is-active", p.dataset.tabPanel === key);
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.tab);
    });
  });

  activateTab("products");
}

/* =========================
   PRODUCTS
   ========================= */

function loadProductsFromLSAdmin() {
  // якщо функція з data.js є – використовуємо її (основний варіант)
  if (typeof loadProductsFromLS === "function") {
    loadProductsFromLS();
    // PRODUCTS вже заповнений у data.js, просто беремо посилання
    return;
  }

  // fallback – якщо раптом data.js інший
  try {
    const raw = localStorage.getItem(LS_PRODUCTS);
    window.PRODUCTS = raw ? JSON.parse(raw) : [];
  } catch {
    window.PRODUCTS = [];
  }
}

function saveProductsToLSAdmin() {
  if (typeof saveProductsToLS === "function") {
    saveProductsToLS();
  } else {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(PRODUCTS));
  }
}

/* генерація ID за категорією */
function generateProductId(category) {
  const prefix =
    category === "dogs"    ? "d" :
    category === "cats"    ? "c" :
    category === "birds"   ? "b" :
    category === "rodents" ? "r" : "x";

  const existing = PRODUCTS.filter(
    p => String(p.id || "").startsWith(prefix)
  );
  let maxNum = 0;
  existing.forEach(p => {
    const num = parseInt(String(p.id).slice(prefix.length), 10);
    if (!Number.isNaN(num) && num > maxNum) maxNum = num;
  });
  return prefix + (maxNum + 1);
}

/* коротка назва категорії в таблиці */
function labelCatShort(cat) {
  switch (cat) {
    case "dogs":    return "Соб";
    case "cats":    return "Кіт";
    case "birds":   return "Птх";
    case "rodents": return "Гриз";
    default:        return cat || "";
  }
}

function renderProductsTable() {
  const tbody = $("#productsTbody");
  if (!tbody) return;

  const catFilter = $("#filterCat")?.value || "all";
  const search    = ($("#filterSearch")?.value || "").trim().toLowerCase();

  let items = [...PRODUCTS];

  if (catFilter !== "all") {
    items = items.filter(p => p.cat === catFilter);
  }

  if (search) {
    items = items.filter(p => {
      const hay =
        (p.title || "") + " " +
        (p.brand || "") + " " +
        (p.id || "");
      return hay.toLowerCase().includes(search);
    });
  }

  if (!items.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="color:#9ca3af;font-size:13px;">Немає товарів за умовами фільтра.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(p => {
    const selected = p.id === currentProductId ? "is-selected" : "";
    return `
      <tr class="${selected}" data-id="${p.id}">
        <td>${p.id || ""}</td>
        <td>${escapeHtml(p.title || "")}</td>
        <td>${labelCatShort(p.cat)}</td>
        <td>${escapeHtml(p.brand || "")}</td>
        <td>${moneyUAH(p.price)}</td>
      </tr>
    `;
  }).join("");
}

function fillProductForm(prod) {
  $("#prodId").value       = prod?.id    || "";
  $("#prodTitle").value    = prod?.title || "";
  $("#prodCategory").value = prod?.cat   || "dogs";
  $("#prodBrand").value    = prod?.brand || "";
  $("#prodPrice").value    = prod?.price != null ? prod.price : "";
  $("#prodWeight").value   = prod?.weight || "";
  $("#prodImg").value      = prod?.img || "";
  $("#prodDesc").value     = prod?.desc || "";
  $("#prodHint").textContent = "";
}

function clearProductFormNew() {
  currentProductId = null;
  fillProductForm({ cat: "dogs" });
  $("#prodHint").textContent =
    "Створення нового товару. Заповніть форму й натисніть «Зберегти».";
}

function initProductsSection() {
  loadProductsFromLSAdmin();
  renderProductsTable();
  clearProductFormNew();

  // фільтри
  $("#filterCat")?.addEventListener("change", renderProductsTable);
  $("#filterSearch")?.addEventListener("input", renderProductsTable);

  // новий товар
  $("#btnNewProduct")?.addEventListener("click", () => {
    currentProductId = null;
    clearProductFormNew();
    renderProductsTable();
  });

  // клік по рядку таблиці
  $("#productsTbody")?.addEventListener("click", e => {
    const row = e.target.closest("tr[data-id]");
    if (!row) return;
    const id = row.dataset.id;
    currentProductId = id;
    const prod = PRODUCTS.find(p => String(p.id) === String(id));
    fillProductForm(prod || null);
    renderProductsTable();
  });

  // збереження товару
  $("#productForm")?.addEventListener("submit", e => {
    e.preventDefault();

    const idInput     = $("#prodId");
    const titleInput  = $("#prodTitle");
    const catSel      = $("#prodCategory");
    const brandInput  = $("#prodBrand");
    const priceInput  = $("#prodPrice");
    const weightInput = $("#prodWeight");
    const imgInput    = $("#prodImg");
    const descInput   = $("#prodDesc");
    const hint        = $("#prodHint");

    const title  = (titleInput.value || "").trim();
    let   id     = (idInput.value || "").trim();
    const cat    = catSel.value || "dogs";
    const brand  = (brandInput.value || "").trim();
    const price  = Number(priceInput.value || 0);
    const weight = (weightInput.value || "").trim();
    const img    = (imgInput.value || "").trim();
    const desc   = (descInput.value || "").trim();

    if (!title)  { hint.textContent = "Вкажіть назву товару.";  return; }
    if (!price || price < 0) {
      hint.textContent = "Вкажіть коректну ціну."; return;
    }
    if (!weight) { hint.textContent = "Вкажіть вагу / фасування."; return; }

    if (!id) {
      id = generateProductId(cat);
    } else {
      id = id.replace(/\s+/g, "");
    }

    const productObj = { id, title, cat, brand, price, weight, img, desc };

    const byCurrent = PRODUCTS.findIndex(
      p => String(p.id) === String(currentProductId)
    );
    const byNewId   = PRODUCTS.findIndex(
      p => String(p.id) === String(id)
    );

    if (byCurrent >= 0) {
      // оновлюємо існуючий
      PRODUCTS[byCurrent] = { ...PRODUCTS[byCurrent], ...productObj };

      // якщо змінили ID і під ним уже був інший товар – попереджаємо
      if (byNewId >= 0 && byNewId !== byCurrent) {
        hint.textContent =
          "Увага: товар з таким ID вже існував. Зараз оновлено поточний.";
      }
    } else {
      // новий товар
      if (byNewId >= 0) {
        hint.textContent =
          "Товар з таким ID вже існує. Змініть ID або залиште порожнім для автогенерації.";
        return;
      }
      PRODUCTS.push(productObj);
    }

    currentProductId = id;
    saveProductsToLSAdmin();
    renderProductsTable();
    idInput.value = id;
    hint.textContent = `Збережено. ID: ${id}`;
  });

  // видалення товару
  $("#btnDeleteProduct")?.addEventListener("click", () => {
    if (!currentProductId) {
      alert("Спочатку оберіть товар для видалення.");
      return;
    }
    const prod  = PRODUCTS.find(p => String(p.id) === String(currentProductId));
    const title = prod ? prod.title : currentProductId;

    if (!confirm(`Видалити товар «${title}» (ID: ${currentProductId})?`)) {
      return;
    }

    PRODUCTS = PRODUCTS.filter(
      p => String(p.id) !== String(currentProductId)
    );
    saveProductsToLSAdmin();
    currentProductId = null;
    clearProductFormNew();
    renderProductsTable();
  });
}

/* =========================
   ORDERS
   ========================= */

function loadOrders() {
  try {
    const raw = localStorage.getItem(LS_ORDERS);
    ORDERS = raw ? JSON.parse(raw) : [];
  } catch {
    ORDERS = [];
  }
}

function saveOrders() {
  localStorage.setItem(LS_ORDERS, JSON.stringify(ORDERS));
}

function formatDateTime(value) {
  if (!value) return "";
  try {
    const d = new Date(value);
    return (
      d.toLocaleDateString("uk-UA") +
      " " +
      d.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit"
      })
    );
  } catch {
    return String(value);
  }
}

function renderOrdersTable() {
  const tbody = $("#ordersTbody");
  if (!tbody) return;

  if (!ORDERS.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="color:#9ca3af;font-size:13px;">Замовлень поки немає.</td></tr>';
    return;
  }

  tbody.innerHTML = ORDERS.map((o, idx) => {
    const status = o.status || "new";
    const label =
      status === "done"       ? "Виконано" :
      status === "cancelled"  ? "Скасовано" :
      status === "in_progress"? "В обробці" :
                                "Нове";

    const selected = o.id === currentOrderId ? "is-selected" : "";
    return `
      <tr data-id="${o.id}" class="${selected}">
        <td>${idx + 1}</td>
        <td>${escapeHtml(o.id || "")}</td>
        <td>${escapeHtml(o.name || "")}</td>
        <td>${moneyUAH(o.total || 0)}</td>
        <td>${escapeHtml(formatDateTime(o.createdAt))}</td>
        <td>${label}</td>
      </tr>
    `;
  }).join("");
}

function fillOrderDetails(order) {
  const emptyBox = $("#orderDetailsEmpty");
  const box      = $("#orderDetailsBox");

  if (!order) {
    box.classList.add("is-hidden");
    emptyBox.classList.remove("is-hidden");
    return;
  }

  emptyBox.classList.add("is-hidden");
  box.classList.remove("is-hidden");

  $("#odId").textContent      = order.id       || "";
  $("#odClient").textContent  = order.name     || "";
  $("#odPhone").textContent   = order.phone    || "";
  $("#odEmail").textContent   = order.userEmail|| "";
  $("#odTotal").textContent   = moneyUAH(order.total || 0);
  $("#odCreated").textContent = formatDateTime(order.createdAt);
  $("#odComment").textContent = order.comment || "";

  $("#odStatus").value = order.status || "new";

  const itemsTbody = $("#odItemsTbody");
  itemsTbody.innerHTML = (order.items || []).map(i => {
    const sum = (i.price || 0) * (i.qty || 0);
    return `
      <tr>
        <td>${escapeHtml(i.title || "")}</td>
        <td>${i.qty || 0}</td>
        <td>${moneyUAH(i.price || 0)}</td>
        <td>${moneyUAH(sum)}</td>
      </tr>
    `;
  }).join("");

  $("#odHint").textContent = "";
}

function initOrdersSection() {
  loadOrders();
  renderOrdersTable();
  fillOrderDetails(null);

  $("#ordersTbody")?.addEventListener("click", e => {
    const row = e.target.closest("tr[data-id]");
    if (!row) return;
    const id = row.dataset.id;
    currentOrderId = id;
    const order = ORDERS.find(o => o.id === id);
    fillOrderDetails(order || null);
    renderOrdersTable();
  });

  $("#btnSaveOrderStatus")?.addEventListener("click", () => {
    if (!currentOrderId) return;
    const order = ORDERS.find(o => o.id === currentOrderId);
    if (!order) return;
    order.status = $("#odStatus").value || "new";
    saveOrders();
    renderOrdersTable();
    $("#odHint").textContent = "Статус збережено.";
  });
}

/* =========================
   REVIEWS
   ========================= */

function loadReviews() {
  try {
    const raw = localStorage.getItem(LS_REVIEWS);
    REVIEWS = raw ? JSON.parse(raw) : [];
  } catch {
    REVIEWS = [];
  }
}

function saveReviews() {
  localStorage.setItem(LS_REVIEWS, JSON.stringify(REVIEWS));
}

function renderReviewsTable() {
  const tbody = $("#reviewsTbody");
  if (!tbody) return;

  if (!REVIEWS.length) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="color:#9ca3af;font-size:13px;">Поки немає користувацьких відгуків.</td></tr>';
    return;
  }

  tbody.innerHTML = REVIEWS.map((r, idx) => {
    const selected = idx === currentReviewIndex ? "is-selected" : "";
    return `
      <tr data-index="${idx}" class="${selected}">
        <td>${idx + 1}</td>
        <td>${escapeHtml(r.name || "Анонім")}</td>
        <td>${escapeHtml(r.city || "")}</td>
        <td>${Number(r.rating || 5)}/5</td>
      </tr>
    `;
  }).join("");
}

function fillReviewDetails(review) {
  const emptyBox = $("#revDetailsEmpty");
  const box      = $("#revDetailsBox");

  if (!review) {
    box.classList.add("is-hidden");
    emptyBox.classList.remove("is-hidden");
    return;
  }

  emptyBox.classList.add("is-hidden");
  box.classList.remove("is-hidden");

  $("#revName").textContent   = review.name || "Анонім";
  $("#revCity").textContent   = review.city || "";
  $("#revPet").textContent    = review.pet || "";
  $("#revRating").textContent = (review.rating || 5) + "/5";
  $("#revText").textContent   = review.text || "";
  $("#revDate").textContent   = review.createdAt
    ? formatDateTime(review.createdAt)
    : "";
  $("#revHint").textContent   = "";
}

function initReviewsSection() {
  loadReviews();
  currentReviewIndex = null;
  renderReviewsTable();
  fillReviewDetails(null);

  $("#reviewsTbody")?.addEventListener("click", e => {
    const row = e.target.closest("tr[data-index]");
    if (!row) return;
    const idx = Number(row.dataset.index);
    if (Number.isNaN(idx)) return;
    currentReviewIndex = idx;
    fillReviewDetails(REVIEWS[idx] || null);
    renderReviewsTable();
  });

  $("#btnDeleteReview")?.addEventListener("click", () => {
    if (currentReviewIndex == null) return;
    const r    = REVIEWS[currentReviewIndex];
    const name = r ? r.name || "Анонім" : "";
    if (!confirm(`Видалити відгук користувача «${name}»?`)) return;
    REVIEWS.splice(currentReviewIndex, 1);
    saveReviews();
    currentReviewIndex = null;
    renderReviewsTable();
    fillReviewDetails(null);
    $("#revHint").textContent = "Відгук видалено.";
  });
}

/* =========================
   FOOTER / SETTINGS
   ========================= */

const DEFAULT_SETTINGS = {
  phone: "+38 (000) 000-00-00",
  email: "support@zoofeed.demo",
  delivery: "Доставка по Україні",
  card: "",
  socials: {
    instagram: "",
    facebook: "",
    telegram: "",
    viber: ""
  }
};

function loadFooterSettingsAdmin() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) {
      FOOTER_SETTINGS = { ...DEFAULT_SETTINGS };
      return;
    }
    const data = JSON.parse(raw);
    FOOTER_SETTINGS = {
      ...DEFAULT_SETTINGS,
      ...data,
      socials: { ...DEFAULT_SETTINGS.socials, ...(data.socials || {}) }
    };
  } catch {
    FOOTER_SETTINGS = { ...DEFAULT_SETTINGS };
  }
}

function saveFooterSettingsAdmin() {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(FOOTER_SETTINGS));
}

function fillSettingsForm() {
  const s = FOOTER_SETTINGS || DEFAULT_SETTINGS;
  $("#setPhone").value     = s.phone || "";
  $("#setEmail").value     = s.email || "";
  $("#setDelivery").value  = s.delivery || "";
  $("#setCard").value      = s.card || "";
  $("#setInstagram").value = s.socials.instagram || "";
  $("#setFacebook").value  = s.socials.facebook || "";
  $("#setTelegram").value  = s.socials.telegram || "";
  $("#setViber").value     = s.socials.viber || "";
  $("#setHint").textContent = "";
}

function initSettingsSection() {
  loadFooterSettingsAdmin();
  fillSettingsForm();

  $("#settingsForm")?.addEventListener("submit", e => {
    e.preventDefault();

    FOOTER_SETTINGS = {
      phone:    $("#setPhone").value.trim(),
      email:    $("#setEmail").value.trim(),
      delivery: $("#setDelivery").value.trim(),
      card:     $("#setCard").value.trim(),
      socials: {
        instagram: $("#setInstagram").value.trim(),
        facebook:  $("#setFacebook").value.trim(),
        telegram:  $("#setTelegram").value.trim(),
        viber:     $("#setViber").value.trim()
      }
    };

    saveFooterSettingsAdmin();
    $("#setHint").textContent = "Налаштування збережено.";
  });

  $("#btnResetSettings")?.addEventListener("click", () => {
    if (!confirm("Повернути стандартні налаштування?")) return;
    FOOTER_SETTINGS = { ...DEFAULT_SETTINGS };
    saveFooterSettingsAdmin();
    fillSettingsForm();
    $("#setHint").textContent = "Повернено дефолтні значення.";
  });
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initProductsSection();
  initOrdersSection();
  initReviewsSection();
  initSettingsSection();
});
