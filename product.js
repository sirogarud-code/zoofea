/* ============================
   ZooFeed – product.js
   Сторінка окремого товару
   ============================ */

const $ = (q, p = document) => p.querySelector(q);

// ті самі ключі для кошика, що й у app.js
const LS_CART = "zf_cart"; // якщо в app.js інша назва – ЗАМІНИ тут так само

function moneyUAH(n) {
  return new Intl.NumberFormat("uk-UA").format(Number(n || 0)) + " ₴";
}

// простий читач кошика (щоб працювала кнопка "додати в кошик",
// навіть якщо ми не використовуємо app.js гарно)
function loadCart() {
  try {
    const raw = localStorage.getItem(LS_CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(LS_CART, JSON.stringify(items));
}

function addToCart(product) {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1,
      img: product.img,
      weight: product.weight
    });
  }
  saveCart(cart);
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function labelCat(cat) {
  switch (cat) {
    case "dogs": return "Для собак";
    case "cats": return "Для котів";
    case "birds": return "Для птахів";
    case "rodents": return "Для гризунів";
    default: return "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // PRODUCTS підтягується з data.js
  if (typeof loadProductsFromLS === "function") {
    loadProductsFromLS(); // заповнить глобальний PRODUCTS
  }
  const list = window.PRODUCTS || [];
  const pid = getProductIdFromUrl();

  const titleEl  = $("#ppTitle");
  const title2El = $("#ppTitle2");
  const imgEl    = $("#ppImg");
  const priceEl  = $("#ppPrice");
  const weightEl = $("#ppWeight");
  const brandEl  = $("#ppBrand");
  const catEl    = $("#ppCat");
  const descEl   = $("#ppDesc");
  const hintEl   = $("#ppHint");
  const addBtn   = $("#ppAddToCart");

  if (!pid) {
    titleEl.textContent = "Товар не знайдено";
    if (descEl) descEl.textContent = "Не передано ID товару в адресному рядку.";
    return;
  }

  const product = list.find(p => String(p.id) === String(pid));

  if (!product) {
    titleEl.textContent = "Товар не знайдено";
    if (descEl) descEl.textContent = "Можливо, товар було видалено або ID некоректний.";
    return;
  }

  // Заповнюємо дані
  titleEl.textContent  = product.title || "Товар";
  title2El.textContent = product.title || "Товар";
  imgEl.src            = product.img || "";
  imgEl.alt            = product.title || "";

  priceEl.textContent  = moneyUAH(product.price);
  weightEl.textContent = product.weight ? "Фасування: " + product.weight : "";
  brandEl.textContent  = product.brand ? "Бренд: " + product.brand : "";
  catEl.textContent    = ["Магазин", labelCat(product.cat)].filter(Boolean).join(" • ");

  descEl.textContent   = product.desc || "Поки що немає опису цього товару.";

  // Кнопка "додати в кошик"
  addBtn.addEventListener("click", () => {
    addToCart(product);
    hintEl.textContent = "Додано в кошик.";
    setTimeout(() => {
      hintEl.textContent = "";
    }, 1500);
  });
});
