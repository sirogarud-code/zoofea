/* ======================================
   ZooFeed – register.js
   Логіка сторінки реєстрації
   ====================================== */

// ВАЖЛИВО!
// Цей ключ має збігатися з тим, який ти використовуєш в app.js
// для зберігання поточного користувача.
// Якщо в app.js у тебе, наприклад, LS_USER = "zf_user",
// залишай так само.
const LS_USER = "zf_user";

// Додаткові прапори для авторизації
const LS_AUTH_EMAIL = "zf_auth_email";
const LS_AUTH_PASS = "zf_auth_pass";
const LS_AUTH_LOGGED = "zf_isLoggedIn";

function $(q, p = document) {
  return p.querySelector(q);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#registerForm");
  const hintEl = $("#regHint");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    hintEl.textContent = "";

    const name = $("#regName").value.trim();
    const email = $("#regEmail").value.trim().toLowerCase();
    const pass = $("#regPassword").value;
    const pass2 = $("#regPassword2").value;
    const phone = $("#regPhone").value.trim();
    const city = $("#regCity").value.trim();

    // --- Прості перевірки ---
    if (!name) {
      hintEl.textContent = "Вкажіть імʼя або нікнейм.";
      return;
    }
    if (!email || !email.includes("@")) {
      hintEl.textContent = "Вкажіть коректний e-mail.";
      return;
    }
    if (!pass || pass.length < 4) {
      hintEl.textContent = "Пароль має містити щонайменше 4 символи.";
      return;
    }
    if (pass !== pass2) {
      hintEl.textContent = "Паролі не співпадають.";
      return;
    }

    // --- Створюємо обʼєкт користувача ---
    const user = {
      id: "u_" + Date.now(),
      name,
      email,
      phone,
      city,
      createdAt: new Date().toISOString()
      // пароль можна не зберігати або зберегти як є
    };

    // Зберігаємо в localStorage (без бекенду)
    try {
      localStorage.setItem(LS_USER, JSON.stringify(user));
      localStorage.setItem(LS_AUTH_EMAIL, email);
      localStorage.setItem(LS_AUTH_PASS, pass);
      localStorage.setItem(LS_AUTH_LOGGED, "1");
    } catch (err) {
      console.error("Помилка збереження користувача:", err);
      hintEl.textContent =
        "Не вдалося зберегти акаунт (перевірте налаштування браузера).";
      return;
    }

    hintEl.textContent = "Акаунт створено, зараз повернемо вас на головну…";

    // Невелика пауза, щоб користувач побачив повідомлення
    setTimeout(() => {
      window.location.href = "index.html";
    }, 400);
  });

  // Посилання "Увійти" – просто повертаємо на головну
  // (додатково ставимо прапор, якщо хочеш відкривати одразу модалку входу)
  const loginLink = $("#regGoLogin");
  if (loginLink) {
    loginLink.addEventListener("click", e => {
      e.preventDefault();
      // опціонально: попросити головну відкрити одразу модалку логіну
      localStorage.setItem("zf_openAuthOnLoad", "1");
      window.location.href = "index.html";
    });
  }
});
// Note: stray demo fetch removed to avoid runtime errors when include this script.
