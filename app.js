/* =========================
   ZooFeed — app.js (магазин)
   ========================= */

const PAGE_SIZE = 8;
const REVIEWS_PER_PAGE = 3;

const LS_CART      = "zf_cart";
const LS_FAV       = "zf_fav";
const LS_CMP       = "zf_cmp";
const LS_USER      = "zf_user";      // поточний користувач
const LS_USERS     = "zf_users";     // список усіх користувачів
const LS_TOKEN     = "zf_token";     // JWT токен
const LS_LANG      = "zf_lang";
const LS_REVIEWS   = "zf_reviews";
const LS_PCOMMENTS = "zf_pcomments"; // коментарі до товарів
const LS_ORDERS    = "zf_orders";    // список оформлених замовлень

// ---------- Налаштування контактів / соцмереж (footer) ----------

const LS_SETTINGS = "zf_settings";

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

function loadFooterSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const data = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...data,
      socials: { ...DEFAULT_SETTINGS.socials, ...(data.socials || {}) }
    };
  } catch (e) {
    console.warn("Cannot load footer settings", e);
    return { ...DEFAULT_SETTINGS };
  }
}

/* ---------- i18n ---------- */

const I18N = {
  uk: {
    nav_shop: "Магазин",
    nav_about: "Про нас",
    nav_reviews: "Відгуки",
    nav_faq: "FAQ",
    nav_contacts: "Контакти",

    hero_badge: "Найкращий зоомагазин України",
    hero_title: "Щасливі тварини починаються з правильного харчування",
    hero_subtitle: "Підбір кормів з доставкою протягом 24 годин.",
    hero_cta_shop: "До каталогу",
    hero_cta_help: "Підібрати корм",
    hero_b1: "100% натуральні інгредієнти",
    hero_b2: "Офіційні постачальники",
    hero_b3: "Бонуси за кожне замовлення",

    benefits_title: "Чому ZooFeed?",
    benefits_sub: "Невеликий магазин з великим досвідом у кормах для тварин.",
    benefit_fast: "Доставка за 24 години",
    benefit_fast_text: "Відправляємо замовлення в той же або наступний робочий день.",
    benefit_vet: "Рекомендації ветеринарів",
    benefit_vet_text: "Обираємо корми з перевіреним складом і репутацією.",
    benefit_bonus: "Бонуси за покупки",
    benefit_bonus_text: "Нараховуємо внутрішні бонуси для наступних замовлень.",

    catalog_title: "Каталог кормів",
    catalog_sub: "Виберіть категорію, бренд або скористайтесь пошуком.",
    filter_cat_all: "Усі категорії",
    filter_cat_dogs: "Для собак",
    filter_cat_cats: "Для котів",
    filter_cat_birds: "Для птахів",
    filter_cat_rodents: "Для гризунів",
    filter_brand_all: "Усі бренди",
    filter_search: "Пошук...",
    sort_popular: "За популярністю",
    sort_price_asc: "Спочатку дешевші",
    sort_price_desc: "Спочатку дорожчі",

    about_title: "Про ZooFeed",
    about_text: "ZooFeed — інтернет-магазин кормів для тварин.",

    about_card1_title: "Для кого магазин?",
    about_card1_text: "Для власників собак, котів, птахів і гризунів, які хочуть швидко підібрати якісний корм.",
    about_card2_title: "Що всередині?",
    about_card2_text: "Каталог товарів, кошик, обране, порівняння, відгуки, базова авторизація та форма контактів.",
    about_card3_title: "Навіщо це потрібно?",
    about_card3_text: "Щоб попрактикуватись у верстці, JavaScript та роботі з localStorage на реалістичному проекті.",

    reviews_title: "Відгуки покупців",
    reviews_text: "Для простоти показуємо кілька історій і даємо можливість залишити свій відгук.",
    reviews_prev_btn: "Попередні",
    reviews_next_btn: "Наступні",
    reviews_toggle_btn: "Залишити відгук",
    review_form_title: "Залишити відгук",
    review_name_label: "Ваше ім'я",
    review_pet_label: "Питомeць / порода",
    review_city_label: "Місто",
    review_rating_label: "Оцінка",
    review_text_label: "Ваш відгук",
    review_placeholder_name: "Олена",
    review_placeholder_pet: "Собака, мопс; кіт, британец тощо",
    review_placeholder_city: "Київ",
    review_placeholder_text: "Розкажіть, як вам сервіс і корм 😊",
    review_submit_btn: "Відправити відгук",
    review_hint_text: "Дякуємо за відгук! Він збережений у вашому браузері.",
    reviews_empty_text: "Поки немає відгуків. Будьте першим!",

    faq_title: "Часті питання",
    faq_q1: "Це справжній магазин?",
    faq_a1: "Це демо-сайт для навчання фронтенду.",
    faq_q2: "Де зберігаються кошик та обране?",
    faq_a2: "Дані зберігаються у вашому браузері (localStorage).",

    contacts_title: "Контакти",
    contacts_text: "Є питання щодо корму, доставки або сайту? Напишіть нам — відповімо у робочий час.",

    contacts_strip_title: "Будьте на зв'язку з ZooFeed",
    contacts_strip_sub: "Задайте питання про замовлення, доставку або сайт — відповімо у робочий час.",
    contacts_name_placeholder: "Ім'я",
    contacts_email_placeholder: "E-mail",
    contacts_topic_placeholder: "Про що питання?",
    contacts_topic_order: "Замовлення та доставка",
    contacts_topic_food: "Підбір корму",
    contacts_topic_payment: "Оплата",
    contacts_topic_other: "Інше",
    contacts_send_btn: "Відправити",

    cart_title: "Кошик",
    cart_total: "Разом:",
    cart_checkout: "Оформити замовлення",

    auth_title: "Особистий кабінет",
    auth_subtitle: "Увійдіть або зареєструйтесь.",
    auth_password: "Пароль",
    auth_login_btn: "Вхід",

    support_label: "Підтримка",
    support_title: "Служба підтримки",
    support_status: "Онлайн • відповімо за кілька хвилин",
    support_tip: "Напишіть питання про замовлення, доставку чи роботу сайту.",
    support_hello: "Вітаю! Я Оля з підтримки ZooFeed 🐾 Чим можу допомогти?",
    support_placeholder: "Коротко опишіть питання…",
    support_send_btn: "Відправити",
    support_footnote: "Це чат. Повідомлення зберігаються лише у вашому браузері.",

    comments_title: "Коментарі покупців",
    comments_toggle_show: "Показати коментарі",
    comments_toggle_hide: "Приховати коментарі",
    comments_empty: "Поки немає коментарів. Будьте першим!",
    comments_name_label: "Ваше ім'я",
    comments_name_placeholder: "Ім'я",
    comments_text_label: "Ваш коментар",
    comments_text_placeholder: "Поділіться враженнями про товар",
    comments_submit: "Відправити",
    comments_saved_hint: "Дякуємо! Коментар збережено у вашому браузері.",
    product_desc_fallback: "Опис цього товару тимчасово відсутній. Ми скоро додамо 🙂",

    footer_note: "© 2025 ZooFeed Demo. Дані зберігаються лише у вашому браузері.",
    footer_col_shop: "Покупцям",
    footer_col_info: "Інформація",
    footer_col_social: "Ми в соцмережах",
    footer_col_pay: "Оплата",
    footer_link_catalog: "Каталог товарів",
    footer_link_reviews: "Відгуки",
    footer_link_faq: "Поширені запитання",
    footer_link_contacts: "Контакти",
    footer_rating_label: "Рейтинг магазину:",
    footer_rating_source: "на основі оцінок",
    footer_made_by: "Створено для навчання фронтенду"
  },

  ru: {
    nav_shop: "Магазин",
    nav_about: "О нас",
    nav_reviews: "Отзывы",
    nav_faq: "FAQ",
    nav_contacts: "Контакты",

    hero_badge: "Лучший зоомагазин Украины",
    hero_title: "Счастливые питомцы начинаются с правильного питания",
    hero_subtitle: "Подбор кормов с доставкой в течение 24 часов.",
    hero_cta_shop: "К каталогу",
    hero_cta_help: "Подобрать корм",
    hero_b1: "100% натуральные ингредиенты",
    hero_b2: "Официальные поставщики",
    hero_b3: "Бонусы за каждый заказ",

    benefits_title: "Почему ZooFeed?",
    benefits_sub: "Небольшой магазин с большим опытом в кормах для животных.",
    benefit_fast: "Доставка за 24 часа",
    benefit_fast_text: "Отправляем заказ в тот же или следующий рабочий день.",
    benefit_vet: "Рекомендации ветеринаров",
    benefit_vet_text: "Выбираем корма с проверенным составом и репутацией.",
    benefit_bonus: "Бонусы за покупки",
    benefit_bonus_text: "Начисляем внутренние бонусы для следующих заказов.",

    catalog_title: "Каталог кормов",
    catalog_sub: "Выберите категорию, бренд или используйте поиск.",
    filter_cat_all: "Все категории",
    filter_cat_dogs: "Для собак",
    filter_cat_cats: "Для котов",
    filter_cat_birds: "Для птиц",
    filter_cat_rodents: "Для грызунов",
    filter_brand_all: "Все бренды",
    filter_search: "Поиск...",
    sort_popular: "По популярности",
    sort_price_asc: "Сначала дешевле",
    sort_price_desc: "Сначала дороже",

    about_title: "О ZooFeed",
    about_text: "ZooFeed — интернет-магазин кормов для животных.",
  about_text: "ZooFeed — интернет-магазин кормов для животных.",

    about_card1_title: "Для кого магазин?",
    about_card1_text: "Для владельцев собак, кошек, птиц и грызунов, которые хотят быстро подобрать качественный корм.",
    about_card2_title: "Что внутри?",
      about_card2_title: "Что внутри?",
    about_card2_text: "Каталог товаров, корзина, избранное, сравнение, отзывы, базовая авторизация и форма контактов.",
    about_card3_title: "Зачем всё это?",
    about_card3_text: "Чтобы попрактиковаться в вёрстке, JavaScript и работе с localStorage на реалистичном проекте.",

    reviews_title: "Отзывы покупателей",
    reviews_text: "Для простоты показываем несколько историй и даём оставить свой отзыв.",

    reviews_prev_btn: "Предыдущие",
    reviews_next_btn: "Следующие",
    reviews_toggle_btn: "Оставить отзыв",
    review_form_title: "Оставить отзыв",
    review_name_label: "Ваше имя",
    review_pet_label: "Питомец / порода",
    review_city_label: "Город",
    review_rating_label: "Оценка",
    review_text_label: "Ваш отзыв",
    review_placeholder_name: "Елена",
    review_placeholder_pet: "Собака, мопс; кот, британец и т.п.",
    review_placeholder_city: "Киев",
    review_placeholder_text: "Расскажите, как вам сервис и корм 😊",
    review_submit_btn: "Отправить отзыв",
    review_hint_text: "Спасибо за отзыв! Он сохранён в вашем браузере.",
    reviews_empty_text: "Пока нет отзывов. Будьте первым!",

    faq_title: "Частые вопросы",
    faq_q1: "Это настоящий магазин?",
    faq_a1: "Это сайт для обучения фронтенду.",
      faq_a1: "Это сайт для обучения фронтенду.",
    faq_q2: "Где хранятся корзина и избранное?",
    faq_a2: "Данные хранятся в вашем браузере в localStorage.",

    contacts_title: "Контакты",
    contacts_text: "Есть вопрос по корму, доставке или сайту? Напишите нам — ответим в рабочее время.",

    contacts_strip_title: "Будьте на связи с ZooFeed",
    contacts_strip_sub: "Задайте вопрос о заказе, доставке или сайте — ответим в рабочее время.",
    contacts_name_placeholder: "Имя",
    contacts_email_placeholder: "E-mail",
    contacts_topic_placeholder: "О чём вопрос?",
    contacts_topic_order: "Заказ и доставка",
    contacts_topic_food: "Подбор корма",
    contacts_topic_payment: "Оплата",
    contacts_topic_other: "Другой вопрос",
    contacts_send_btn: "Отправить сообщение",

    cart_title: "Корзина",
    cart_total: "Итого:",
    cart_checkout: "Оформить заказ",

    auth_title: "Личный кабинет",
    auth_subtitle: "Войдите или зарегистрируйтесь.",
      auth_subtitle: "Войдите или зарегистрируйтесь.",
    auth_password: "Пароль",
    auth_login_btn: "Войти",

    support_label: "Поддержка",
    support_title: "Служба поддержки",
    support_status: "Онлайн • ответим за несколько минут",
    support_tip: "Напишите нам вопрос по заказу, доставке или работе сайта.",
    support_hello: "Здравствуйте! Я Оля из поддержки ZooFeed 🐾 Чем могу помочь?",
    support_placeholder: "Кратко опишите ваш вопрос…",
    support_send_btn: "Отправить",
    support_footnote: "Это чат. Сообщения хранятся только в вашем браузере.",
  support_footnote: "Это чат. Сообщения хранятся только в вашем браузере.",

    comments_title: "Комментарии покупателей",
    comments_toggle_show: "Показать комментарии",
    comments_toggle_hide: "Скрыть комментарии",
    comments_empty: "Пока нет комментариев. Будьте первым!",
    comments_name_label: "Ваше имя",
    comments_name_placeholder: "Имя",
    comments_text_label: "Ваш комментарий",
    comments_text_placeholder: "Поделитесь впечатлениями о товаре",
    comments_submit: "Отправить комментарий",
    comments_saved_hint: "Спасибо за комментарий! Он сохранён в вашем браузере.",
    product_desc_fallback: "Описание этого товара временно отсутствует. Мы скоро его добавим 🙂",

    footer_note: "© 2025 ZooFeed Demo. Данные хранятся только в вашем браузере.",
    footer_col_shop: "Покупателям",
    footer_col_info: "Информация",
    footer_col_social: "Мы в соцсетях",
    footer_col_pay: "Оплата",
    footer_link_catalog: "Каталог товаров",
    footer_link_reviews: "Отзывы",
    footer_link_faq: "Частые вопросы",
    footer_link_contacts: "Контакты",
    footer_rating_label: "Рейтинг магазина:",
    footer_rating_source: "на основе оценок",
      footer_rating_source: "на основе оценок",
    // ---------- i18n ----------
    footer_made_by: "Создано для обучения фронтенду"
  },

  en: {
    nav_shop: "Shop",
    nav_about: "About",
    nav_reviews: "Reviews",
    nav_faq: "FAQ",
    nav_contacts: "Contacts",

    hero_badge: "Best pet shop in Ukraine (demo)",
    hero_title: "Pet food store",
    hero_subtitle: "Choose quality food for dogs, cats, birds, and rodents.",
    hero_cta_shop: "Go to catalog",
    hero_cta_help: "Help me choose food",
    hero_b1: "100% natural ingredients",
    hero_b2: "Official suppliers",
    hero_b3: "Bonus points for each order",

    benefits_title: "Why ZooFeed?",
    benefits_sub: "A small shop with big experience in pet nutrition.",
    benefit_fast: "Delivery within 24h",
    benefit_fast_text: "We ship the same or the next business day.",
    benefit_vet: "Vet recommended",
    benefit_vet_text: "We pick foods with proven formulas and reputation.",
    benefit_bonus: "Loyalty bonuses",
    benefit_bonus_text: "Earn internal bonuses you can use on the next order.",

    catalog_title: "Product catalog",
    catalog_sub: "Choose a category, brand or use search.",
    filter_cat_all: "All categories",
    filter_cat_dogs: "For dogs",
    filter_cat_cats: "For cats",
    filter_cat_birds: "For birds",
    filter_cat_rodents: "For rodents",
    filter_brand_all: "All brands",
    filter_search: "Search...",
    sort_popular: "By popularity",
    sort_price_asc: "Cheaper first",
    sort_price_desc: "More expensive first",

    about_title: "About ZooFeed",
    about_text: "ZooFeed is a demo pet food e-commerce site.",

    about_card1_title: "Who is the store for?",
    about_card1_text: "For owners of dogs, cats, birds and rodents who want to quickly choose quality food.",
    about_card2_title: "What's inside the demo?",
    about_card2_text: "Product catalog, cart, favorites, comparison, reviews, basic auth and contact form.",
    about_card3_title: "Why build this?",
    about_card3_text: "To practice layout, JavaScript and localStorage in a realistic project.",

    reviews_title: "Customer reviews",
    reviews_text: "We show a few demo stories and let you add your own review.",
    reviews_prev_btn: "Previous",
    reviews_next_btn: "Next",
    reviews_toggle_btn: "Leave a review",
    review_form_title: "Leave a review",
    review_name_label: "Your name",
    review_pet_label: "Pet / breed",
    review_city_label: "City",
    review_rating_label: "Rating",
    review_text_label: "Your review",
    review_placeholder_name: "Name",
    review_placeholder_pet: "Dog, pug; cat, british etc.",
    review_placeholder_city: "City",
    review_placeholder_text: "Tell us what you think about our service and food 😊",
    review_submit_btn: "Send review",
    review_hint_text: "Thanks for your review! It is stored in your browser.",
    reviews_empty_text: "No reviews yet. Be the first!",

    faq_title: "Frequently Asked Questions",
    faq_q1: "Is this a real store?",
    faq_a1: "This is a demo site for learning frontend.",
    faq_q2: "Where are cart and favorites stored?",
    faq_a2: "They are stored in your browser (localStorage).",

    contacts_title: "Contacts",
    contacts_text: "Have a question about food, delivery or the site? Write to us — we’ll answer within a working day.",

    contacts_strip_title: "Stay in touch with ZooFeed",
    contacts_strip_sub: "Ask about orders, delivery or the site — we’ll answer on a working day.",
    contacts_name_placeholder: "Name",
    contacts_email_placeholder: "E-mail",
    contacts_topic_placeholder: "What is your question about?",
    contacts_topic_order: "Order & delivery",
    contacts_topic_food: "Food selection",
    contacts_topic_payment: "Payment",
    contacts_topic_other: "Other question",
    contacts_send_btn: "Send message",

    cart_title: "Cart",
    cart_total: "Total:",
    cart_checkout: "Checkout (demo)",

    auth_title: "Account",
    auth_subtitle: "Log in or register (demo).",
    auth_password: "Password",
    auth_login_btn: "Login",

    support_label: "Support",
    support_title: "Support service",
    support_status: "Online • we reply in a few minutes",
    support_tip: "Write us a question about your order, delivery or the website.",
    support_hello: "Hello! I’m Olha from ZooFeed support 🐾 How can I help you?",
    support_placeholder: "Briefly describe your question…",
    support_send_btn: "Send",
    support_footnote: "This is a demo chat. Messages are stored only in your browser.",

    comments_title: "Customer comments",
    comments_toggle_show: "Show comments",
    comments_toggle_hide: "Hide comments",
    comments_empty: "No comments yet. Be the first!",
    comments_name_label: "Your name",
    comments_name_placeholder: "Name",
    comments_text_label: "Your comment",
    comments_text_placeholder: "Share your thoughts about this product",
    comments_submit: "Send comment",
    comments_saved_hint: "Thanks! Your comment is stored in your browser.",
    product_desc_fallback: "The description of this product is temporarily unavailable. We’ll add it soon 🙂",

    footer_note: "© 2025 ZooFeed Demo. Data is stored only in your browser.",
    footer_col_shop: "For customers",
    footer_col_info: "Information",
    footer_col_social: "We are on social media",
    footer_col_pay: "Payment",
    footer_link_catalog: "Product catalog",
    footer_link_reviews: "Reviews",
    footer_link_faq: "FAQ",
    footer_link_contacts: "Contacts",
    footer_rating_label: "Store rating:",
    footer_rating_source: "based on demo ratings",
    footer_made_by: "Built for learning frontend"
  }
};
/* ---------- ПЛАВНА ПОЯВА СТОРІНКИ ---------- */

window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

/* ---------- Scroll-reveal (анімація при скролі) ---------- */

let scrollRevealObserver = null;

function initScrollReveal() {
  // Якщо IntersectionObserver немає — просто показуємо все
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal-on-scroll").forEach(el => {
      el.classList.add("sr-visible");
    });
    return;
  }

  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sr-visible");
          // Анімуємо елемент один раз
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    });
  }

  document.querySelectorAll(".reveal-on-scroll").forEach(el => {
    if (!el.dataset.srInit) {
      el.dataset.srInit = "1";
      scrollRevealObserver.observe(el);
    }
  });
}


/* ---------- описи товарів для різних мов ---------- */

const PRODUCT_DESCRIPTIONS = {
  // DOGS
  d1: {
    uk: "Сухий повнораціонний корм для дорослих собак середніх порід. Підтримує м’язовий тонус, здоров’я суглобів та травлення. Велика упаковка 15 кг зручна для регулярного годування.",
    ru: "Сухой полнорационный корм для взрослых собак средних пород. Поддерживает мышечный тонус, здоровье суставов и пищеварения. Большая упаковка 15 кг удобна для регулярного кормления.",
    en: "Complete dry food for adult medium-breed dogs. Supports muscle tone, joint and digestive health. Large 15 kg bag is convenient for everyday feeding."
  },
  d2: {
    uk: "Сухий корм для цуценят та молодих собак середніх порід. Рецептура з легкою куркою й рисом без пшениці підходить для чутливого травлення та рівномірного зростання.",
    ru: "Сухой корм для щенков и молодых собак средних пород. Формула с курицей и рисом без пшеницы подходит для чувствительного пищеварения и равномерного роста.",
    en: "Dry food for puppies and young medium-breed dogs. Wheat-free recipe with chicken and rice, gentle on digestion and supporting healthy growth."
  },
  d3: {
    uk: "Повнораціонний корм для дорослих собак середніх порід. Містить пребіотики та збалансований вміст білків і жирів для здорового травлення та блискучої шерсті.",
    ru: "Полнорационный корм для взрослых собак средних пород. Содержит пребиотики и сбалансированное количество белков и жиров для здорового пищеварения и блестящей шерсти.",
    en: "Complete food for adult medium-breed dogs. Contains prebiotics and a balanced level of protein and fat for healthy digestion and a shiny coat."
  },
  d4: {
    uk: "Гіпоалергенний корм для дорослих собак середніх порід. Підходить тваринам з чутливою шкірою та травленням, підтримує імунітет і гарний стан шерсті.",
    ru: "Гипоаллергенный корм для взрослых собак средних пород. Подходит животным с чувствительной кожей и пищеварением, поддерживает иммунитет и состояние шерсти.",
    en: "Hypoallergenic food for adult medium-breed dogs. Suitable for dogs with sensitive skin and digestion, supports immunity and coat condition."
  },
  d5: {
    uk: "Багатий на м’ясо сухий корм для активних дорослих собак. Високий вміст білка підтримує м’язи, а натуральні інгредієнти сприяють чудовому самопочуттю.",
    ru: "Мясной сухой корм для активных взрослых собак. Высокое содержание белка поддерживает мышцы, а натуральные ингредиенты улучшают общее самочувствие.",
    en: "Meat-rich dry food for active adult dogs. High protein level supports strong muscles, while natural ingredients help keep your dog in great condition."
  },
  d6: {
    uk: "Сухий корм для дорослих собак середніх порід із чутливим травленням. Містить пробіотики, антиоксиданти та якісні білки для здоров’я кишківника.",
    ru: "Сухой корм для взрослых собак средних пород с чувствительным пищеварением. Содержит пробиотики, антиоксиданты и качественные белки для здоровья кишечника.",
    en: "Dry food for adult medium-breed dogs with sensitive digestion. Contains probiotics, antioxidants and high-quality proteins for gut health."
  },
  d7: {
    uk: "Щоденний збалансований корм для дорослих собак. Підходить більшості порід, містить вітаміни та мінерали для міцного імунітету та здорової шерсті.",
    ru: "Ежедневный сбалансированный корм для взрослых собак. Подходит большинству пород, содержит витамины и минералы для крепкого иммунитета и здоровой шерсти.",
    en: "Everyday balanced food for adult dogs of most breeds. Enriched with vitamins and minerals to support strong immunity and a healthy coat."
  },
  d8: {
    uk: "Корм супер-преміум класу для дорослих собак. Поєднує якісні білки, корисні жири та фітодобавки для підтримки суглобів, травлення та блиску шерсті.",
    ru: "Корм супер-премиум класса для взрослых собак. Сочетает качественные белки, полезные жиры и фитодобавки для поддержки суставов, пищеварения и блеска шерсти.",
    en: "Super-premium food for adult dogs. Combines high-quality proteins, healthy fats and herbal additives to support joints, digestion and a shiny coat."
  },

  // CATS
  c1: {
    uk: "Сухий корм для дорослих котів. Підтримує здоров’я сечовидільної системи та красиву шерсть, підходить для щоденного годування.",
    ru: "Сухой корм для взрослых кошек. Поддерживает здоровье мочевыделительной системы и красивую шерсть, подходит для ежедневного кормления.",
    en: "Dry food for adult cats. Supports urinary tract health and a shiny coat, suitable for daily feeding."
  },
  c2: {
    uk: "Спеціальний корм для домашніх котів, які живуть у приміщенні. Зменшує запах випорожнень і допомагає підтримувати нормальну вагу.",
    ru: "Специальный корм для домашних котов, живущих в помещении. Уменьшает запах испражнений и помогает поддерживать нормальный вес.",
    en: "Special food for indoor cats. Helps reduce stool odour and supports healthy weight management."
  },
  c3: {
    uk: "Корм для стерилізованих котів. Контролює калорійність раціону, підтримує сечовидільну систему та оптимальну вагу.",
    ru: "Корм для стерилизованных кошек. Контролирует калорийность рациона, поддерживает мочевыделительную систему и оптимальный вес.",
    en: "Food for sterilised cats. Controlled calories support urinary health and help maintain ideal weight."
  },
  c4: {
    uk: "Ніжні консерви для котів з відбірними інгредієнтами. Добре підходять як ласощі або доповнення до сухого корму.",
    ru: "Нежные консервы для кошек из отборных ингредиентов. Подходят как лакомство или дополнение к сухому корму.",
    en: "Tender wet food for cats made from selected ingredients. Perfect as a treat or complement to dry food."
  },
  c5: {
    uk: "Апетитні вологі паучі для котів у соусі. Допомагають урізноманітнити раціон і підвищити поїдання корму.",
    ru: "Аппетитные влажные паучи для кошек в соусе. Помогают разнообразить рацион и улучшить поедаемость.",
    en: "Tasty wet pouches for cats in sauce. Help diversify the diet and improve palatability."
  },
  c6: {
    uk: "Сухий корм для дорослих котів із урахуванням потреб домашніх тварин. Містить вітаміни та мінерали для здорових зубів і шерсті.",
    ru: "Сухой корм для взрослых кошек с учётом потребностей домашних питомцев. Содержит витамины и минералы для здоровых зубов и шерсти.",
    en: "Dry food for adult indoor cats. Enriched with vitamins and minerals for healthy teeth and coat."
  },
  c7: {
    uk: "Корм для котів, що живуть у приміщенні. Сприяє м’якому травленню та зменшує утворення грудок шерсті.",
    ru: "Корм для кошек, живущих в помещении. Способствует мягкому пищеварению и снижает образование комков шерсти.",
    en: "Food for indoor cats. Supports gentle digestion and helps reduce hairball formation."
  },
  c8: {
    uk: "М’ясний корм супер-преміум класу для котів. Підходить для вибагливих тварин, сприяє блиску шерсті та відмінному самопочуттю.",
    ru: "Мясной корм супер-премиум класса для кошек. Подходит для привередливых животных, улучшает состояние шерсти и общее самочувствие.",
    en: "Meat-rich super-premium food for cats. Suitable for fussy eaters, supports a glossy coat and excellent well-being."
  },

  // BIRDS
  b1: {
    uk: "Збалансований корм для канарок із сумішшю зерен і вітамінами для щоденного годування.",
    ru: "Сбалансированный корм для канареек с зерновой смесью и витаминами для ежедневного кормления.",
    en: "Balanced seed mix for canaries with added vitamins for everyday feeding."
  },
  b2: {
    uk: "Зернова суміш для папуг. Підтримує енергійність птахів та гарний стан оперення.",
    ru: "Зерновая смесь для попугаев. Поддерживает активность птиц и хорошее состояние оперения.",
    en: "Seed mixture for parrots. Supports energetic birds and healthy plumage."
  },
  b3: {
    uk: "Преміальна зернова суміш для папуг із додатковими вітамінами та мінералами.",
    ru: "Премиальная зерновая смесь для попугаев с дополнительными витаминами и минералами.",
    en: "Premium seed mixture for parrots enriched with extra vitamins and minerals."
  },
  b4: {
    uk: "Корм для хвилястих папуг із підібраною сумішшю зерна для щоденного раціону.",
    ru: "Корм для волнистых попугаев с подобранной смесью зерна для ежедневного рациона.",
    en: "Daily food mix for budgerigars with a carefully selected grain blend."
  },
  b5: {
    uk: "Корм для хвилястих папуг з дрібною зерновою сумішшю, яку легко поїдати.",
    ru: "Корм для волнистых попугаев с мелкой зерновой смесью, которую легко поедать.",
    en: "Fine seed mix for budgerigars that is easy to eat."
  },
  b6: {
    uk: "Меню для великих папуг з різними видами зерна та корисними добавками.",
    ru: "Меню для крупных попугаев с разными видами зерна и полезными добавками.",
    en: "Menu mixture for large parrots with various seeds and beneficial ingredients."
  },
  b7: {
    uk: "Корм для канарок із дрібною сумішшю насіння та вітамінів.",
    ru: "Корм для канареек с мелкой смесью семян и витаминов.",
    en: "Seed mix for canaries with small seeds and added vitamins."
  },
  b8: {
    uk: "Преміум-суміш для хвилястих папуг, підходить для щоденного годування.",
    ru: "Премиум-смесь для волнистых попугаев, подходит для ежедневного кормления.",
    en: "Premium mix for budgerigars suitable for daily feeding."
  },

  // RODENTS
  r1: {
    uk: "Сухий корм для дорослих кроликів. Збалансований склад підтримує зуби, шерсть та здорове травлення.",
    ru: "Сухой корм для взрослых кроликов. Сбалансированный состав поддерживает зубы, шерсть и здоровое пищеварение.",
    en: "Dry food for adult rabbits. Balanced formula supports teeth, coat and healthy digestion."
  },
  r2: {
    uk: "Кормова суміш для хом’ячків з різними видами зерна та хрусткими шматочками.",
    ru: "Кормовая смесь для хомяков с разными видами зерна и хрустящими кусочками.",
    en: "Food mix for hamsters with various grains and crunchy pieces."
  },
  r3: {
    uk: "Меню для хом’яків з зерном, овочами та вітамінами для щоденного годування.",
    ru: "Меню для хомяков с зерном, овощами и витаминами для ежедневного кормления.",
    en: "Daily menu for hamsters with grains, vegetables and vitamins."
  },
  r4: {
    uk: "Корм для морських свинок із підвищеним вмістом клітковини та вітаміну C.",
    ru: "Корм для морских свинок с повышенным содержанием клетчатки и витамина C.",
    en: "Food for guinea pigs with extra fibre and vitamin C."
  },
  r5: {
    uk: "Хрустка мюслі-суміш для дрібних гризунів. Підходить хом’якам і щурам.",
    ru: "Хрустящая мюсли-смесь для мелких грызунов. Подходит хомякам и крысам.",
    en: "Crunchy muesli mix for small rodents such as hamsters and rats."
  },
  r6: {
    uk: "Корм для морських свинок із травами та овочами. Підтримує здоров’я травлення.",
    ru: "Корм для морских свинок с травами и овощами. Поддерживает здоровье пищеварения.",
    en: "Food for guinea pigs with herbs and vegetables to support digestion."
  },
  r7: {
    uk: "Сухий корм для кроликів супер-преміум класу з високим вмістом клітковини.",
    ru: "Сухой корм для кроликов супер-премиум класса с высоким содержанием клетчатки.",
    en: "Super-premium dry food for rabbits with a high fibre content."
  },
  r8: {
    uk: "Повнораціонний корм для хом’яків. Містить зерно, овочі та хрусткі гранули.",
    ru: "Полнорационный корм для хомяков. Содержит зерно, овощи и хрустящие гранулы.",
    en: "Complete food for hamsters with grains, vegetables and crunchy pellets."
  }
};

let currentLang = localStorage.getItem(LS_LANG) || "uk";
window.currentLang = currentLang; // щоб labelCat() з data.js знав поточну мову

function getProductDescription(prod) {
  const lang = currentLang || "uk";
  const entry = PRODUCT_DESCRIPTIONS[prod.id];
  if (entry) {
    return entry[lang] || entry.uk;
  }
  const dict = I18N[lang] || I18N.uk;
  return dict.product_desc_fallback || I18N.uk.product_desc_fallback;
}

function applyI18n() {
  const dict = I18N[currentLang] || I18N.uk;
  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });

  // плейсхолдери полів коментаря до товару
  const pmCN = $("#pmCommentName");
  if (pmCN && dict.comments_name_placeholder) {
    pmCN.placeholder = dict.comments_name_placeholder;
  }
  const pmCT = $("#pmCommentText");
  if (pmCT && dict.comments_text_placeholder) {
    pmCT.placeholder = dict.comments_text_placeholder;
  }
}

// Auto-translate feature removed

/* ---------- reviews (як раніше) ---------- */

const DEFAULT_REVIEWS = [
  {
    id: "r1",
    rating: 5,
    name_uk: "Олена",
    name_ru: "Елена",
    name_en: "Olena",
    pet_uk: "Собака, 3 роки • Royal Canin",
    pet_ru: "Собака, 3 года • Royal Canin",
    pet_en: "Dog, 3 y.o. • Royal Canin",
    city_uk: "Київ • постійний клієнт",
    city_ru: "Киев • постоянный клиент",
    city_en: "Kyiv • regular customer",
    text_uk: "Замовляю корм для собаки вже пів року — все чітко, доставляють за день, зручно слідкувати за ціною та акціями. Пес задоволений 🙂",
    text_ru: "Заказываю корм для собаки уже полгода — всё чётко, доставляют за день, удобно следить за ценой и акциями. Пёс доволен 🙂",
    text_en: "I’ve been ordering dog food here for half a year — delivery takes one day and it’s easy to track prices and promos. My dog is happy 🙂"
  },
  {
    id: "r2",
    rating: 4,
    name_uk: "Ігор",
    name_ru: "Игорь",
    name_en: "Ihor",
    pet_uk: "Кіт, 5 років • Josera",
    pet_ru: "Кот, 5 лет • Josera",
    pet_en: "Cat, 5 y.o. • Josera",
    city_uk: "Львів • зроблено 4 замовлення",
    city_ru: "Львов • сделано 4 заказа",
    city_en: "Lviv • 4 orders made",
    text_uk: "Дуже подобається, що можна порівняти корми різних брендів і додати в обране. Кошик зберігається навіть після перезавантаження сторінки.",
    text_ru: "Очень нравится, что можно сравнить корма разных брендов и добавить в избранное. Корзина сохраняется даже после перезагрузки страницы.",
    text_en: "I like that you can compare different brands and add items to favorites. The cart stays even after reloading the page."
  },
  {
    id: "r3",
    rating: 5,
    name_uk: "Марина",
    name_ru: "Марина",
    name_en: "Maryna",
    pet_uk: "Папуга та хом’як • Vitakraft",
    pet_ru: "Попугай и хомяк • Vitakraft",
    pet_en: "Parrot & hamster • Vitakraft",
    city_uk: "Одеса • нова клієнтка",
    city_ru: "Одесса • новая клиентка",
    city_en: "Odesa • new customer",
    text_uk: "Зручно, що в одному місці є корми і для птахів, і для гризунів. Інтерфейс простий, фільтри працюють як треба, замовлення оформлюється за пару кліків.",
    text_ru: "Удобно, что в одном месте есть корма и для птиц, и для грызунов. Интерфейс простой, фильтры работают как надо, заказ оформляется за пару кликов.",
    text_en: "I like that I can buy food for both birds and rodents in one place. Filters work great and the order takes just a few clicks."
  }
];

function getDefaultsForLang() {
  const lang = currentLang;
  return DEFAULT_REVIEWS.map(r => ({
    name: r["name_" + lang] || r.name_uk,
    pet: r["pet_" + lang] || r.pet_uk,
    city: r["city_" + lang] || r.city_uk,
    rating: r.rating,
    text: r["text_" + lang] || r.text_uk,
    isDefault: true
  }));
}

/* ---------- state ---------- */

let state = {
  page: 1,
  cat: "all",
  brand: "all",
  search: "",
  sort: "popular"
};

let cart = [];
let fav  = [];
let cmp  = [];
let currentUser = null;
let userReviews = [];
let reviewsPage = 1;

// коментарі до конкретних товарів
let productComments = {}; // { productId: [ { name, text, createdAt, userId, userEmail } ] }
let currentProductId = null;

/* ---------- User / LS helpers ---------- */

// генерація унікального ID користувача
function generateUserId() {
  const part = () => Math.random().toString(16).slice(2, 6).toUpperCase();
  return `ZOO-${part()}-${part()}`;
}

// зберігаємо список користувачів у localStorage
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

// дуже просте "хешування" пароля (для тестування)
function hashPassword(pwd) {
  return btoa(pwd || "");
}

// поточний користувач береться з змінної currentUser
function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(LS_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(LS_USER);
  }
  updateAccountTitle();
}

function saveToken(token) {
  if (token) localStorage.setItem(LS_TOKEN, token);
  else localStorage.removeItem(LS_TOKEN);
}

function getToken() {
  return localStorage.getItem(LS_TOKEN);
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: 'Bearer ' + t } : {};
}

/* ---------- LS helpers ---------- */

function loadLS() {
  cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
  fav  = JSON.parse(localStorage.getItem(LS_FAV)  || "[]" );
  cmp  = JSON.parse(localStorage.getItem(LS_CMP)  || "[]");
  currentUser = JSON.parse(localStorage.getItem(LS_USER) || "null");

  // якщо користувач є, але ще без id – додаємо йому id
  if (currentUser && !currentUser.id) {
    currentUser.id = generateUserId();
    localStorage.setItem(LS_USER, JSON.stringify(currentUser));
  }

  // міграція для старих користувачів у LS_USERS
  try {
    const users = loadUsers();
    let changed = false;
    users.forEach(u => {
      if (!u.id) {
        u.id = generateUserId();
        changed = true;
      }
    });
    if (changed) saveUsers(users);
  } catch {}

  const savedReviews = localStorage.getItem(LS_REVIEWS);
  if (savedReviews) {
    try {
      userReviews = JSON.parse(savedReviews);
    } catch {
      userReviews = [];
    }
  } else {
    userReviews = [];
  }

  const savedPComments = localStorage.getItem(LS_PCOMMENTS);
  if (savedPComments) {
    try {
      productComments = JSON.parse(savedPComments) || {};
    } catch {
      productComments = {};
    }
  } else {
    productComments = {};
  }
}

function saveLS() {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
  localStorage.setItem(LS_FAV,  JSON.stringify(fav));
  localStorage.setItem(LS_CMP,  JSON.stringify(cmp));
  if (currentUser) {
    localStorage.setItem(LS_USER, JSON.stringify(currentUser));
  }
  localStorage.setItem(LS_REVIEWS, JSON.stringify(userReviews));
  localStorage.setItem(LS_PCOMMENTS, JSON.stringify(productComments));
}

// збережені замовлення (тільки локально)
function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(LS_ORDERS) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
}

/* ---------- каталог ---------- */

function getFilteredProducts() {
  let items = [...PRODUCTS];

  if (state.cat !== "all")   items = items.filter(p => p.cat === state.cat);
  if (state.brand !== "all") items = items.filter(p => p.brand === state.brand);

  if (state.search.trim()) {
    const q = state.search.trim().toLowerCase();
    items = items.filter(p => p.title.toLowerCase().includes(q));
  }

  if (state.sort === "price_asc")       items.sort((a,b) => a.price - b.price);
  else if (state.sort === "price_desc") items.sort((a,b) => b.price - a.price);

  return items;
}

function renderBrandFilter() {
  const brands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
  const select = $("#brandFilter");
  if (!select) return;
  select.innerHTML =
    `<option value="all" data-i18n="filter_brand_all">Усі бренди</option>` +
    brands.map(b => `<option value="${b}">${b}</option>`).join("");
}

function renderPager(totalPages) {
  const pager = $("#pager");
  if (!pager) return;
  if (totalPages <= 1) { pager.innerHTML = ""; return; }
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" data-page="${i}" class="${i===state.page ? "active" : ""}">${i}</button>`;
  }
  pager.innerHTML = html;
}

// псевдо-склад
function getStockInfo(p) {
  const code = (p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 4;
  if (code === 0) return { label: "В наявності", state: "ok" };
  if (code === 1) return { label: "Залишилось мало", state: "low" };
  if (code === 2) return { label: "Передзамовлення", state: "pre" };
  return { label: "Тимчасово немає", state: "out" };
}

// псевдо-рейтинг
function getRatingInfo(p) {
  const base = (p.price % 40) / 100;
  const rating = 4.2 + base;
  const count = 18 + (p.price % 60);
  return {
    rating: rating.toFixed(1),
    count
  };
}

// ціна за кг, якщо у вазі є "кг"
function getPricePerKg(p) {
  const m = /([\d.,]+)\s*кг/i.exec(p.weight || "");
  if (!m) return null;
  const kg = parseFloat(m[1].replace(",", "."));
  if (!kg || !isFinite(kg)) return null;
  return Math.round(p.price / kg);
}

function labelCat(cat) {
  const lang = window.currentLang || "uk";
  const dict = {
    dogs:    {uk:"Для собак",   ru:"Для собак",   en:"For dogs"},
    cats:    {uk:"Для котів",   ru:"Для котов",   en:"For cats"},
    birds:   {uk:"Для птахів",  ru:"Для птиц",    en:"For birds"},
    rodents: {uk:"Для гризунів",ru:"Для грызунов",en:"For rodents"}
  };
  return (dict[cat] && dict[cat][lang]) || cat;
}

function renderGrid() {
  const grid = $("#grid");
  if (!grid) return;
  const items = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  grid.innerHTML = pageItems.map(p => {
    const inFav = fav.includes(p.id);
    const inCmp = cmp.includes(p.id);
    const emoji = (function(cat) {
      switch (cat) {
        case "dogs": return "🐶";
        case "cats": return "🐱";
        case "birds": return "🦜";
        case "rodents": return "🐹";
        default: return "🐾";
      }
    })(p.cat);
    const thumbHtml = p.img
      ? `<img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">`
      : emoji;

    return `
      <article class="card" data-id="${p.id}">
        <div class="card-thumb">${thumbHtml}</div>
        <div class="card-title">${escapeHtml(p.title)}</div>
        <div class="card-meta">
          <span>${escapeHtml(p.weight)}</span>
          <span>${escapeHtml(p.brand)}</span>
        </div>
        <div class="card-meta">
          <span>${escapeHtml(labelCat(p.cat))}</span>
          <span class="card-price">${moneyUAH(p.price)}</span>
        </div>
        <div class="card-actions">
          <div class="card-icon-row">
            <button class="card-icon js-fav ${inFav ? "active" : ""}" title="Обране" aria-label="Додати до обраного">❤️</button>
            <button class="card-icon js-cmp ${inCmp ? "active" : ""}" title="Порівняти" aria-label="Додати до порівняння">⚖️</button>
          </div>
          <button class="btn primary card-btn js-add" type="button">У кошик</button>
        </div>
      </article>
    `;
  }).join("");

  renderPager(totalPages);
  updateBadges();
}

/* ---------- reviews ---------- */

function ratingToStars(rating) {
  const r = Math.max(1, Math.min(5, Number(rating) || 5));
  const full = "★★★★★".slice(0, r);
  const empty = "☆☆☆☆☆".slice(0, 5 - r);
  return full + empty;
}

function getAllReviewsForCurrentLang() {
  const defaults = getDefaultsForLang();
  return [...defaults, ...userReviews];
}

// ensure we have at least `minCount` reviews (fills with demo defaults when list is short)
function ensureMinReviews(minCount) {
  const all = getAllReviewsForCurrentLang();
  const defaults = getDefaultsForLang();
  const need = Math.max(0, minCount - all.length);
  if (need <= 0) return;

  for (let i = 0; i < need; i++) {
    const src = defaults[i % defaults.length];
    const clone = {
      name: src.name + " (demo)",
      pet: src.pet,
      city: src.city,
      rating: src.rating,
      text: src.text
    };
    userReviews.push(clone);
  }
  saveLS();
}

function makeAvatarLetter(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "🙂";
  return trimmed[0].toUpperCase();
}

function renderReviews() {
  const grid = $("#reviewsGrid");
  if (!grid) return;

  ensureMinReviews(REVIEWS_PER_PAGE * 2);
  const all = getAllReviewsForCurrentLang();
  const dict = I18N[currentLang] || I18N.uk;

  if (!all.length) {
    const msg = dict.reviews_empty_text || "Ще немає відгуків. Будьте першим!";
    grid.innerHTML =
      `<p style="font-size:13px;color:#9ca3af">${escapeHtml(msg)}</p>`;
    const ind = $("#reviewsPageIndicator");
    if (ind) ind.textContent = "1 / 1";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(all.length / REVIEWS_PER_PAGE));
  if (reviewsPage > totalPages) reviewsPage = totalPages;
  const start = (reviewsPage - 1) * REVIEWS_PER_PAGE;
  const pageItems = all.slice(start, start + REVIEWS_PER_PAGE);

  grid.innerHTML = pageItems.map(r => `
    <article class="review-card">
      <div class="review-header">
        <div class="review-header-left">
          <div class="review-avatar">${escapeHtml(makeAvatarLetter(r.name))}</div>
          <div>
            <div class="review-name">${escapeHtml(r.name || "Клієнт")}</div>
            ${r.pet ? `<div class="review-pet">${escapeHtml(r.pet)}</div>` : ""}
          </div>
        </div>
        <div class="review-rating" aria-label="${r.rating || 5} з 5">
          ${ratingToStars(r.rating)}
        </div>
      </div>
      <p class="review-text">
        ${escapeHtml(r.text || "")}
      </p>
      ${r.city ? `<div class="review-meta">${escapeHtml(r.city)}</div>` : ""}
    </article>
  `).join("");

  requestAnimationFrame(() => {
    $$(".review-card", grid).forEach(card => {
      card.classList.add("is-visible");
    });
  });

  const ind = $("#reviewsPageIndicator");
  if (ind) ind.textContent = `${reviewsPage} / ${totalPages}`;
  const prevBtn = $("#reviewsPrev");
  const nextBtn = $("#reviewsNext");
  if (prevBtn) prevBtn.disabled = reviewsPage <= 1;
  if (nextBtn) nextBtn.disabled = reviewsPage >= totalPages;
}


/* ---------- fav / cmp / cart ---------- */

function getFavProducts() {
  return PRODUCTS.filter(p => fav.includes(p.id));
}

function openFav() {
  closeCart();
  closeCmp();
  const drawer = $("#favDrawer");
  if (!drawer) return;
  drawer.classList.add("is-open");
  renderFav();
}

function closeFav() {
  const drawer = $("#favDrawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
}

function renderFav() {
  const list = $("#favList");
  if (!list) return;
  const items = getFavProducts();

  if (!items.length) {
    list.innerHTML = `<p style="font-size:13px;color:#9ca3af">Список обраного порожній.</p>`;
    return;
  }

  list.innerHTML = items.map(p => {
    const emoji = (function(cat) {
      switch (cat) {
        case "dogs": return "🐶";
        case "cats": return "🐱";
        case "birds": return "🦜";
        case "rodents": return "🐹";
        default: return "🐾";
      }
    })(p.cat);
    const thumbHtml = p.img
      ? `<img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">`
      : emoji;

    return `
      <div class="fav-item" data-id="${p.id}">
        <div class="fav-thumb">${thumbHtml}</div>
        <div class="fav-info">
          <div class="fav-title">${escapeHtml(p.title)}</div>
          <div class="fav-meta">
            <span>${escapeHtml(p.brand)}</span>
            <span>${moneyUAH(p.price)}</span>
          </div>
        </div>
        <div class="fav-actions">
          <button type="button" class="btn-sm js-fav-add">У кошик</button>
          <button type="button" class="btn-icon js-fav-remove" title="Прибрати" aria-label="Прибрати з обраного">✕</button>
        </div>
      </div>
    `;
  }).join("");
}

function getCmpProducts() {
  return PRODUCTS.filter(p => cmp.includes(p.id));
}

function openCmp() {
  closeCart();
  closeFav();
  const drawer = $("#cmpDrawer");
  if (!drawer) return;
  drawer.classList.add("is-open");
  renderCmp();
}

function closeCmp() {
  const drawer = $("#cmpDrawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
}

function renderCmp() {
  const list = $("#cmpList");
  if (!list) return;
  const items = getCmpProducts();

  if (!items.length) {
    list.innerHTML = `<p style="font-size:13px;color:#9ca3af">Список порівняння порожній.</p>`;
    return;
  }

  list.innerHTML = items.map(p => {
    const emoji = (function(cat) {
      switch (cat) {
        case "dogs": return "🐶";
        case "cats": return "🐱";
        case "birds": return "🦜";
        case "rodents": return "🐹";
        default: return "🐾";
      }
    })(p.cat);
    const thumbHtml = p.img
      ? `<img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">`
      : emoji;

    return `
      <div class="fav-item cmp-item" data-id="${p.id}">
        <div class="fav-thumb">${thumbHtml}</div>
        <div class="fav-info">
          <div class="fav-title">${escapeHtml(p.title)}</div>
          <div class="fav-meta">
            <span>${escapeHtml(p.brand)}</span>
            <span>${moneyUAH(p.price)}</span>
          </div>
        </div>
        <div class="fav-actions">
          <button type="button" class="btn-sm js-cmp-add">У кошик</button>
          <button type="button" class="btn-icon js-cmp-remove" title="Прибрати" aria-label="Прибрати з порівняння">✕</button>
        </div>
      </div>
    `;
  }).join("");
}

function updateBadges() {
  const cartCount = cart.reduce((s,i)=>s + i.qty, 0);
  const cartEl = $("#cartCount");
  const favEl  = $("#favCount");
  const cmpEl  = $("#cmpCount");
  if (cartEl) cartEl.textContent = cartCount;
  if (favEl)  favEl.textContent  = fav.length;
  if (cmpEl)  cmpEl.textContent  = cmp.length;
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({id:p.id, title:p.title, price:p.price, qty:1});
  saveLS();
  updateBadges();
  renderCart();
  openCart();
}

function renderCart() {
  const list = $("#cartList");
  if (!list) return;
  if (!cart.length) {
    list.innerHTML = `<p style="font-size:13px;color:#9ca3af">Кошик порожній.</p>`;
    const tot = $("#cartTotal");
    if (tot) tot.textContent = moneyUAH(0);
    return;
  }
  let total = 0;
  list.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item" data-id="${item.id}">
        <div>
          <div class="cart-item-title">${escapeHtml(item.title)}</div>
          <div class="cart-item-meta">${moneyUAH(item.price)}</div>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="js-dec" aria-label="Зменшити кількість">−</button>
          <span>${item.qty}</span>
          <button type="button" class="js-inc" aria-label="Збільшити кількість">+</button>
        </div>
      </div>
    `;
  }).join("");
  const tot = $("#cartTotal");
  if (tot) tot.textContent = moneyUAH(total);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveLS();
  updateBadges();
  renderCart();
}

/* ---------- cart drawer ---------- */

function openCart() {
  closeFav();
  closeCmp();
  const drawer = $("#cartDrawer");
  if (!drawer) return;
  drawer.classList.add("is-open");
}

function closeCart() {
  const drawer = $("#cartDrawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
}

/* ---------- checkout modal (серйозне оформлення замовлення) ---------- */

function renderOrderSummaryModal() {
  const listEl  = $("#orderSummaryItems");
  const totalEl = $("#orderSummaryTotal");
  const countEl = $("#orderSummaryCount");
  if (!listEl) return;

  if (!cart.length) {
    listEl.innerHTML =
      '<div style="font-size:13px;color:#9ca3af;">Кошик порожній.</div>';
    if (totalEl) totalEl.textContent = moneyUAH(0);
    if (countEl) countEl.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  listEl.innerHTML = cart.map(item => {
    const qty = Number(item.qty || 1);
    const price = Number(item.price || 0);
    const sum = qty * price;
    total += sum;
    count += qty;
    return `
      <div class="order-summary-item">
        <div>
          <div class="order-summary-title">${escapeHtml(item.title || "")}</div>
          <div class="order-summary-meta">ID: ${escapeHtml(item.id || "")}</div>
        </div>
        <div>x${qty}</div>
        <div>${moneyUAH(price)}</div>
        <div>${moneyUAH(sum)}</div>
      </div>
    `;
  }).join("");

  if (totalEl) totalEl.textContent = moneyUAH(total);
  if (countEl) countEl.textContent = String(count);
}

function openOrderModal() {
  const modal = $("#orderModal");
  if (!modal) return;
  closeCart();
  renderOrderSummaryModal();
  modal.classList.add("is-open");
}

function closeOrderModal() {
  const modal = $("#orderModal");
  if (!modal) return;
  modal.classList.remove("is-open");
}

/* ---------- auth ---------- */

function updateAccountTitle() {
  const btn = document.getElementById("accountBtn");
  if (!btn) return;

  if (currentUser) {
    const title = currentUser.id
      ? `${currentUser.email} • ID: ${currentUser.id}`
      : currentUser.email;
    btn.setAttribute("title", title);
    btn.setAttribute("aria-label", "Особистий кабінет");
  } else {
    btn.setAttribute("title", "Вхід / Кабінет");
    btn.setAttribute("aria-label", "Вхід / Кабінет");
  }
}

function openAuth() {
  const modal = document.getElementById("authModal");
  const emailInput = document.getElementById("authEmail");
  const passInput  = document.getElementById("authPassword");
  const hint = document.getElementById("authHint");

  if (!modal || !emailInput || !passInput) return;

  if (currentUser && currentUser.email) {
    emailInput.value = currentUser.email;
  } else {
    emailInput.value = "";
  }

  passInput.value = "";
  if (hint) hint.textContent = "";

  modal.classList.add("is-open");
}

function closeAuth() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("is-open");
}

/* ---------- nav scroll ---------- */
const NAV_OFFSET = 80;

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
  window.scrollTo({
    top,
    behavior: "smooth"
  });
}

function initNavScroll() {
  const links = $$("[data-nav]");
  const sections = $$("[data-section]");

  links.forEach(link => {
    const id = link.dataset.nav;
    const target = document.getElementById(id);
    if (!target) return;
    link.addEventListener("click", e => {
      e.preventDefault();
      scrollToSection(id);
    });
  });

  function updateActiveLink() {
    const scrollPos = window.scrollY + NAV_OFFSET + 1;
    let currentId = null;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        currentId = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.toggle("is-active", link.dataset.nav === currentId);
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
}

/* ---------- product modal + comments ---------- */

function formatCommentDate(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleDateString("uk-UA");
  } catch {
    return "";
  }
}

function renderProductComments(productId) {
  const listEl  = $("#pmCommentsList");
  const emptyEl = $("#pmCommentsEmptyText");
  if (!listEl || !emptyEl) return;

  const dict = I18N[currentLang] || I18N.uk;
  const items = productComments[productId] || [];

  if (!items.length) {
    emptyEl.style.display = "block";
    emptyEl.textContent = dict.comments_empty || "Ще немає коментарів. Будьте першим!";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";
  listEl.innerHTML = items.map(c => {
    const dateStr = formatCommentDate(c.createdAt);
    return `
      <div class="pm-comment">
        <div class="pm-comment-header">
          <span class="pm-comment-author">${escapeHtml(c.name || "Анонім")}</span>
          ${dateStr ? `<span class="pm-comment-date">${escapeHtml(dateStr)}</span>` : ""}
        </div>
        <div class="pm-comment-text">${escapeHtml(c.text || "")}</div>
      </div>
    `;
  }).join("");
}

function openProductModalById(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentProductId = id;

  const modal       = $("#productModal");
  const imgEl       = $("#pmImg");
  const brandEl     = $("#pmBrand");
  const catEl       = $("#pmCategory");
  const weightEl    = $("#pmWeight");
  const titleEl     = $("#pmTitle");
  const priceEl     = $("#pmPrice");
  const priceKgEl   = $("#pmPricePerKg");
  const stockBadge  = $("#pmStockBadge");
  const ratingBadge = $("#pmRatingBadge");
  const descEl      = $("#pmDesc");

  if (!modal) return;

  if (imgEl) {
    if (p.img) {
      imgEl.src = p.img;
      imgEl.alt = p.title;
    } else {
      imgEl.src = "";
      imgEl.alt = "";
    }
  }

  if (brandEl)  brandEl.textContent  = p.brand;
  if (catEl)    catEl.textContent    = labelCat(p.cat);
  if (weightEl) weightEl.textContent = p.weight;
  if (titleEl)  titleEl.textContent  = p.title;
  if (priceEl)  priceEl.textContent  = moneyUAH(p.price);

  const ppk = getPricePerKg(p);
  if (priceKgEl) {
    priceKgEl.textContent = ppk ? `~ ${ppk} ₴ / кг` : "";
  }

  const stock = getStockInfo(p);
  if (stockBadge) {
    stockBadge.textContent = stock.label;
    stockBadge.dataset.state = stock.state;
  }

  const rating = getRatingInfo(p);
  if (ratingBadge) {
    ratingBadge.textContent = `${rating.rating} ★ (${rating.count}+)`;
  }

  if (descEl) {
    descEl.textContent = getProductDescription(p);
  }

  const pmCommentsBody = $("#pmCommentsBody");
  const pmCommentsToggleBtn = $("#pmCommentsToggleBtn");
  const dict = I18N[currentLang] || I18N.uk;
  if (pmCommentsBody && pmCommentsToggleBtn) {
    pmCommentsBody.classList.remove("is-hidden");
    pmCommentsToggleBtn.textContent =
      dict.comments_toggle_hide || "Сховати коментарі";
  }

  renderProductComments(id);
  modal.classList.add("is-open");
}

function closeProductModal() {
  const modal = $("#productModal");
  if (!modal) return;
  modal.classList.remove("is-open");
}

/* ---------- Сторінка реєстрації (register.html) ---------- */

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return; // ми не на сторінці реєстрації

  const nameInput     = document.getElementById("regName");
  const emailInput    = document.getElementById("regEmail");
  const passInput     = document.getElementById("regPassword");
  const pass2Input    = document.getElementById("regPasswordConfirm");
  const phoneInput    = document.getElementById("regPhone");
  const cityInput     = document.getElementById("regCity");
  const errorBox      = document.getElementById("registerError");

  function showError(msg) {
    if (errorBox) errorBox.textContent = msg || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

    const name  = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const pass  = (passInput?.value || "").trim();
    const pass2 = (pass2Input?.value || "").trim();
    const phone = (phoneInput?.value || "").trim();
    const city  = (cityInput?.value || "").trim();

    if (!name || !email || !pass || !pass2) {
      showError("Заповніть усі обов’язкові поля (*).");
      return;
    }

    if (pass !== pass2) {
      showError("Паролі не співпадають.");
      return;
    }

    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) {
      showError("Некоректний e-mail.");
      return;
    }

    // Спроба зареєструвати через бекенд (новий API)
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone, city })
    })
      .then(async (resp) => {
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data && data.status === 'ok') {
          const user = data.user;
          // зберігаємо токен
          try { saveToken(data.token); } catch (e) {}
          // Зберігаємо локально список користувачів
          try {
            const users = loadUsers();
            const exists = users.some(u => (u.email||"").toLowerCase() === (user.email||"").toLowerCase());
            if (!exists) {
              users.push(user);
              saveUsers(users);
            }
          } catch (err) {}

          setCurrentUser(user);
          alert(`Ви успішно зареєструвались як ${user.email}. Ваш ID: ${user.id}.`);
          window.location.href = "index.html";
        } else {
          showError(data && data.message ? data.message : "Помилка реєстрації (сервер)");
        }
      })
      .catch(() => {
        // Якщо бекенд недоступний — fallback: зберігаємо в localStorage як раніше
        const users = loadUsers();
        const exists = users.some(
          u => (u.email || "").toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          showError("Користувач з таким email вже існує. Спробуйте увійти.");
          return;
        }

        const user = {
          id: generateUserId(),
          createdAt: new Date().toISOString(),
          email,
          name,
          passwordHash: hashPassword(pass),
          phone: phone || null,
          city: city || null
        };

        users.push(user);
        saveUsers(users);
        setCurrentUser(user);

        alert(`Ви успішно зареєструвались як ${email}. Ваш ID: ${user.id}.`);

        window.location.href = "index.html";
      });
  });
}

/* ---------- INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  // товари з data.js
  if (typeof loadProductsFromLS === "function") {
    loadProductsFromLS();
  }

  loadLS();

  const langSel = $("#langSel");
  if (langSel) {
    langSel.value = currentLang;
    langSel.addEventListener("change", () => {
      currentLang = langSel.value;
      window.currentLang = currentLang;
      localStorage.setItem(LS_LANG, currentLang);
      applyI18n();
      renderGrid();
      renderReviews();
  
  // Try to load products from backend and re-render grid when ready
  try {
    if (typeof fetch === 'function') {
      fetch('/api/products')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length) {
            PRODUCTS = data.map(p => ({
              id: p.id || p._id || (p._id && p._id.toString && p._id.toString()),
              title: p.title,
              cat: p.category || p.cat,
              brand: p.brand,
              price: p.price,
              weight: p.weight,
              img: p.image || p.img,
              desc: p.description || p.desc,
              stock: p.stock || 0,
              rating: p.rating || 0
            }));
            try { saveProductsToLS(); } catch (e) {}
            renderGrid();
            renderBrandFilter();
          }
        })
        .catch(() => {});
    }
  } catch (e) {}
  
  // Якщо є токен — спробувати отримати користувача з /api/auth/me
  try {
    const t = getToken();
    if (t && !currentUser) {
      fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + t } })
        .then(async r => {
          if (!r.ok) return;
          const d = await r.json().catch(() => null);
          if (d && d.status === 'ok' && d.user) {
            setCurrentUser(d.user);
          }
        }).catch(() => {});
    }
  } catch (e) {}

      const modal = $("#productModal");
      if (modal && modal.classList.contains("is-open") && currentProductId) {
        openProductModalById(currentProductId);
      }
    });
  }

  applyI18n();
  renderBrandFilter();
  renderGrid();
  renderCart();
  renderReviews();

  // Фільтри
  const catFilter = $("#catFilter");
  if (catFilter) {
    catFilter.addEventListener("change", e => {
      state.cat = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  const brandFilter = $("#brandFilter");
  if (brandFilter) {
    brandFilter.addEventListener("change", e => {
      state.brand = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      state.search = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  const sortSelect = $("#sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      state.sort = e.target.value;
      state.page = 1;
      renderGrid();
    });
  }

  const pager = $("#pager");
  if (pager) {
    pager.addEventListener("click", e => {
      const btn = e.target.closest("button[data-page]");
      if (!btn) return;
      state.page = Number(btn.dataset.page) || 1;
      renderGrid();
    });
  }

  // клік по картках
  const grid = $("#grid");
  if (grid) {
    grid.addEventListener("click", e => {
      const card = e.target.closest(".card");
      if (!card) return;
      const id = card.dataset.id;

      if (e.target.closest(".js-add")) {
        addToCart(id);
      } else if (e.target.closest(".js-fav")) {
        if (fav.includes(id)) fav = fav.filter(x => x !== id);
        else fav.push(id);
        saveLS();
        renderGrid();
        renderFav();
        updateBadges();
      } else if (e.target.closest(".js-cmp")) {
        if (cmp.includes(id)) cmp = cmp.filter(x => x !== id);
        else cmp.push(id);
        saveLS();
        renderGrid();
        renderCmp();
        updateBadges();
      } else {
        openProductModalById(id);
      }
    });
  }

  // Обране
  const favBtn = $("#favBtn");
  if (favBtn) favBtn.addEventListener("click", openFav);

  const favClose = $("#favClose");
  if (favClose) favClose.addEventListener("click", closeFav);

  const favDrawer = $("#favDrawer");
  if (favDrawer) {
    favDrawer.addEventListener("click", e => {
      if (e.target === favDrawer) closeFav();
    });
  }

  const favList = $("#favList");
  if (favList) {
    favList.addEventListener("click", e => {
      const row = e.target.closest(".fav-item");
      if (!row) return;
      const id = row.dataset.id;

      if (e.target.closest(".js-fav-add")) {
        addToCart(id);
      }
      if (e.target.closest(".js-fav-remove")) {
        fav = fav.filter(x => x !== id);
        saveLS();
        renderFav();
        renderGrid();
        updateBadges();
      }
    });
  }

  // Порівняння
  const cmpBtn = $("#cmpBtn");
  if (cmpBtn) cmpBtn.addEventListener("click", openCmp);

  const cmpClose = $("#cmpClose");
  if (cmpClose) cmpClose.addEventListener("click", closeCmp);

  const cmpDrawer = $("#cmpDrawer");
  if (cmpDrawer) {
    cmpDrawer.addEventListener("click", e => {
      if (e.target === cmpDrawer) closeCmp();
    });
  }

  const cmpList = $("#cmpList");
  if (cmpList) {
    cmpList.addEventListener("click", e => {
      const row = e.target.closest(".cmp-item");
      if (!row) return;
      const id = row.dataset.id;

      if (e.target.closest(".js-cmp-add")) {
        addToCart(id);
      }
      if (e.target.closest(".js-cmp-remove")) {
        cmp = cmp.filter(x => x !== id);
        saveLS();
        updateBadges();
        renderCmp();
        renderGrid();
      }
    });
  }

  // Кошик
  const cartBtn = $("#cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);

  const cartClose = $("#cartClose");
  if (cartClose) cartClose.addEventListener("click", closeCart);

  const cartDrawer = $("#cartDrawer");
  if (cartDrawer) {
    cartDrawer.addEventListener("click", e => {
      if (e.target === cartDrawer) closeCart();
    });
  }

  const cartList = $("#cartList");
  if (cartList) {
    cartList.addEventListener("click", e => {
      const row = e.target.closest(".cart-item");
      if (!row) return;
      const id = row.dataset.id;
      if (e.target.closest(".js-inc")) changeQty(id, +1);
      if (e.target.closest(".js-dec")) changeQty(id, -1);
    });
  }

  // ---- НОВИЙ checkout через модалку ----
  const cartCheckoutBtn = $("#cartCheckoutBtn");
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", () => {
      if (!cart.length) {
        alert("Кошик порожній.");
        return;
      }

      // якщо модалка існує – відкриваємо її
      if ("#orderModal" && $("#orderModal")) {
        // require login to proceed to checkout via API
        const token = getToken();
        if (!token || !currentUser) {
          alert('Будь ласка, увійдіть або зареєструйтесь, щоб оформити замовлення.');
          // відкриваємо модалку авторизації, якщо є
          const authModalEl = document.getElementById('authModal');
          if (authModalEl) authModalEl.classList.add('is-open');
          return;
        }
        openOrderModal();
      } else {
        alert('Оформлення доступне лише після входу. Відкрийте сайт на сервері або увійдіть.');
      }
    });
  }

  // обробка форми модалки, якщо вона є
  const orderModalEl   = $("#orderModal");
  const orderForm      = $("#orderForm");
  const orderCloseBtn  = $("#btnCloseOrderModal");
  const orderCancelBtn = $("#btnCancelOrder");
  const orderHint      = $("#orderFormHint");

  if (orderModalEl) {
    orderModalEl.addEventListener("click", e => {
      if (e.target === orderModalEl) {
        closeOrderModal();
      }
    });
  }

  if (orderCloseBtn) {
    orderCloseBtn.addEventListener("click", closeOrderModal);
  }
  if (orderCancelBtn) {
    orderCancelBtn.addEventListener("click", closeOrderModal);
  }

  if (orderForm) {
    orderForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!cart.length) {
        if (orderHint) orderHint.textContent = "Кошик порожній.";
        return;
      }

      const name    = ($("#ofName")?.value || "").trim();
      const phone   = ($("#ofPhone")?.value || "").trim();
      const email   = ($("#ofEmail")?.value || "").trim();
      const city    = ($("#ofCity")?.value || "").trim();
      const delivery = $("#ofDelivery")?.value || "nova_poshta";
      const payment  = $("#ofPayment")?.value || "card";
      const comment  = ($("#ofComment")?.value || "").trim();

      if (!name || !phone || !city) {
        if (orderHint) orderHint.textContent = "Заповніть ім’я, телефон і місто / відділення.";
        return;
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const orderId = "ZF-" + Date.now().toString(36).toUpperCase();

      // Prepare payload for API
      const payload = {
        items: cart.map(i => ({ productId: i.id, title: i.title, qty: i.qty, price: i.price })),
        total,
        delivery: {
          name,
          phone,
          email: email || (currentUser ? currentUser.email : null),
          address: city,
          deliveryMethod: delivery,
          paymentMethod: payment,
          comment
        }
      };

      // require authentication
      const token = getToken();
      if (!token) {
        if (orderHint) orderHint.textContent = "Будь ласка, увійдіть, щоб оформити замовлення.";
        return;
      }

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      })
        .then(async resp => {
          const data = await resp.json().catch(() => ({}));
          if (resp.ok) {
            // success - clear cart and show message
            cart = [];
            saveLS();
            renderCart();
            updateBadges();
            if (orderHint) orderHint.textContent = 'Замовлення оформлено! Дякуємо 💚';
            setTimeout(() => { if (orderHint) orderHint.textContent = ''; closeOrderModal(); }, 1500);
          } else {
            // fallback: save locally if API fails
            const order = {
              id: orderId,
              createdAt: new Date().toISOString(),
              name,
              phone,
              comment: `${city} | Доставка: ${delivery}, оплата: ${payment}${comment ? " | " + comment : ""}`,
              items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
              total,
              userId: currentUser ? currentUser.id : null,
              userEmail: email || (currentUser ? currentUser.email : null),
              status: "new"
            };
            const orders = loadOrders();
            orders.push(order);
            saveOrders(orders);
            cart = [];
            saveLS();
            renderCart();
            updateBadges();
            if (orderHint) orderHint.textContent = data && data.message ? data.message : 'Помилка при оформленні, замовлення збережено локально.';
            setTimeout(() => { if (orderHint) orderHint.textContent = ''; closeOrderModal(); }, 1500);
          }
        })
        .catch(() => {
          // network error - fallback to local save
          const order = {
            id: orderId,
            createdAt: new Date().toISOString(),
            name,
            phone,
            comment: `${city} | Доставка: ${delivery}, оплата: ${payment}${comment ? " | " + comment : ""}`,
            items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
            total,
            userId: currentUser ? currentUser.id : null,
            userEmail: email || (currentUser ? currentUser.email : null),
            status: "new"
          };
          const orders = loadOrders();
          orders.push(order);
          saveOrders(orders);
          cart = [];
          saveLS();
          renderCart();
          updateBadges();
          if (orderHint) orderHint.textContent = 'Мережна помилка — замовлення збережено локально.';
          setTimeout(() => { if (orderHint) orderHint.textContent = ''; closeOrderModal(); }, 1500);
        });
    });
  }

  // акаунт / авторизація
  updateAccountTitle();

  const accountBtn = document.getElementById("accountBtn");
  const authModal = document.getElementById("authModal");
  const authCloseBtns = document.querySelectorAll("[data-auth-close]");

  if (accountBtn && authModal) {
    accountBtn.addEventListener("click", () => {
      authModal.classList.add("is-open");
    });

    authCloseBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        authModal.classList.remove("is-open");
      });
    });

    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) {
        authModal.classList.remove("is-open");
      }
    });
  }

  const authForm = document.getElementById("authForm");
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("authEmail");
      const passInput  = document.getElementById("authPassword");
      const hint       = document.getElementById("authHint");

      const email = (emailInput?.value || "").trim();
      const pass  = (passInput?.value || "").trim();

      if (!email || !pass) {
        if (hint) hint.textContent = "Заповніть e-mail та пароль.";
        return;
      }

      // helper: try localStorage fallback auth (returns true if success)
      function tryLocalFallback() {
        try {
          const users = loadUsers();
          const user = users.find(u => (u.email || "").toLowerCase() === email.toLowerCase());
          if (!user) return false;
          if (hashPassword(pass) !== (user.passwordHash || user.password || '')) return false;
          setCurrentUser(user);
          try { saveToken(null); } catch (e) {}
          if (hint) {
            hint.textContent = `Ви увійшли локально як ${user.email} (ID: ${user.id}).`;
            setTimeout(() => { hint.textContent = ''; closeAuth(); }, 900);
          } else {
            closeAuth();
          }
          return true;
        } catch (err) {
          console.warn('local fallback error', err);
          return false;
        }
      }

      // Спроба авторизації через бекенд (новий API)
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
      })
        .then(async resp => {
          const data = await resp.json().catch(() => ({}));
          if (resp.ok && data && data.status === 'ok') {
            const user = data.user;
            try { saveToken(data.token); } catch (e) {}
            // синхронізуємо локальний LS
            try {
              const users = loadUsers();
              const exists = users.some(u => (u.email||"").toLowerCase() === (user.email||"").toLowerCase());
              if (!exists) {
                users.push(user);
                saveUsers(users);
              }
            } catch (err) {}

            setCurrentUser(user);
            if (hint) {
              hint.textContent = `Ви увійшли як ${user.email} (ID: ${user.id}).`;
              setTimeout(() => {
                hint.textContent = "";
                closeAuth();
              }, 900);
            } else {
              closeAuth();
            }
          } else {
            // server auth failed — first try local fallback
            const okLocal = tryLocalFallback();
            if (okLocal) return;

            if (hint) hint.textContent = data && data.message ? data.message : 'Невдала авторизація';

            // Add inline server-override UI for phone users
            try {
              if (!document.getElementById('authServerOverrideBox')) {
                const box = document.createElement('div');
                box.id = 'authServerOverrideBox';
                box.style.marginTop = '8px';
                box.style.display = 'flex';
                box.style.gap = '6px';
                box.style.alignItems = 'center';

                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'authServerOverrideInput';
                input.placeholder = 'http://192.168.1.10:3000';
                input.style.flex = '1';
                input.style.padding = '6px 8px';
                input.style.fontSize = '13px';

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.id = 'authServerOverrideBtn';
                btn.textContent = 'Підключитися';
                btn.className = 'btn';
                btn.style.padding = '6px 10px';
                btn.style.fontSize = '13px';

                const status = document.createElement('span');
                status.id = 'authServerOverrideStatus';
                status.style.marginLeft = '6px';
                status.style.fontSize = '12px';

                btn.addEventListener('click', () => {
                  const base = (input.value || '').trim();
                  if (!base) {
                    alert('Вкажіть адресу сервера, наприклад http://192.168.1.10:3000');
                    return;
                  }
                  const url = base.replace(/\/$/, '') + '/api/auth/login';
                  status.textContent = 'Підключаю...';

                  fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pass })
                  })
                    .then(async r2 => {
                      const d2 = await r2.json().catch(() => ({}));
                      if (r2.ok && d2 && d2.status === 'ok') {
                        try { saveToken(d2.token); } catch (e) {}
                        try {
                          const users = loadUsers();
                          const exists = users.some(u => (u.email||'').toLowerCase() === (d2.user.email||'').toLowerCase());
                          if (!exists) { users.push(d2.user); saveUsers(users); }
                        } catch (err) {}
                        setCurrentUser(d2.user);
                        status.textContent = 'Успіх';
                        setTimeout(() => { status.textContent = ''; closeAuth(); }, 900);
                      } else {
                        status.textContent = '';
                        alert((d2 && d2.message) ? d2.message : 'Авторизація не вдалась на вказаному сервері.');
                      }
                    })
                    .catch(() => {
                      status.textContent = '';
                      alert('Не вдалося зв’язатися з вказаним сервером. Перевірте адресу та доступність порту.');
                    });
                });

                box.appendChild(input);
                box.appendChild(btn);
                box.appendChild(status);

                if (hint && hint.parentNode) hint.parentNode.appendChild(box);
              }
            } catch (err) {
              console.warn('auth override helper error', err);
            }
          }
        })
        .catch(() => {
          // network or unexpected error — try local fallback, otherwise show message
          try {
            const okLocal = tryLocalFallback();
            if (okLocal) return;
          } catch (e) {}
          if (hint) hint.textContent = 'Не вдалося зв’язатися з сервером.';
        });
    });
  }
      // REVIEW FORM handler (restore if missing)
      const reviewForm = $("#reviewForm");
      if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = ($("#reviewName")?.value || "").trim() || "Анонім";
          const pet  = ($("#reviewPet")?.value || "").trim() || "";
          const city = ($("#reviewCity")?.value || "").trim() || "";
          const rating = Number($("#reviewRating")?.value || 5);
          const text = ($("#reviewText")?.value || "").trim();
          if (!text) return;

          userReviews.unshift({
            name,
            pet,
            city,
            rating,
            text,
            createdAt: Date.now(),
            userId: currentUser ? currentUser.id : null,
            userEmail: currentUser ? currentUser.email : null
          });

          if (userReviews.length > 20) userReviews = userReviews.slice(0, 20);
          saveLS();
          reviewsPage = 1;
          renderReviews();
          reviewForm.reset();
          const ratingSel = $("#reviewRating");
          if (ratingSel) ratingSel.value = "5";

          const dict = I18N[currentLang] || I18N.uk;
          const hint = $("#reviewHint");
          if (hint) {
            const msg = dict.review_hint_text || "Дякуємо за відгук! Він збережений у вашому браузері.";
            hint.textContent = msg;
            setTimeout(() => { hint.textContent = ""; }, 3000);
          }
        });
      }

  // пагінація відгуків
  const reviewsPrev = $("#reviewsPrev");
  const reviewsNext = $("#reviewsNext");
  if (reviewsPrev) {
    reviewsPrev.addEventListener("click", () => {
      if (reviewsPage > 1) {
        reviewsPage--;
        renderReviews();
      }
    });
  }
  if (reviewsNext) {
    reviewsNext.addEventListener("click", () => {
      reviewsPage++;
      renderReviews();
    });
  }

  // форма контактів
  const contactsForm = $("#contactsForm");
  if (contactsForm) {
    contactsForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Дякуємо! У цій версії повідомлення нікуди не відправляються 🙂");
      contactsForm.reset();
    });
  }

  /* ---------- support widget ---------- */

  const supportToggle = document.getElementById("supportToggle");
  const supportPanel  = document.getElementById("supportPanel");
  const supportClose  = document.querySelector(".support-close");
  const supportForm   = document.getElementById("supportForm");
  const supportText   = document.getElementById("supportText");
  const supportBody   = document.querySelector(".support-body");

  function openSupport() {
    if (!supportPanel) return;
    supportPanel.classList.add("is-open");
  }

  function closeSupport() {
    if (!supportPanel) return;
    supportPanel.classList.remove("is-open");
  }

  if (supportToggle && supportPanel) {
    supportToggle.addEventListener("click", () => {
      if (supportPanel.classList.contains("is-open")) {
        closeSupport();
      } else {
        openSupport();
      }
    });
  }

  if (supportClose) {
    supportClose.addEventListener("click", closeSupport);
  }

  if (supportForm && supportText && supportBody) {
    // Simple support bot: shows user bubble and then an automated reply
    const BOT_NAME = "Оля";
    const BOT_RESPONSES = [
      "Дякую за повідомлення! Перевірю й відповім незабаром.",
      "Зазвичай відповідаємо протягом робочого дня — тримаю вас у курсі.",
      "Чи можете додати трохи більше деталей щодо замовлення?",
      "Дякуємо — отримали ваше питання і почнемо розбиратися.",
      "Перевірте, будь ласка, правильність номера замовлення, і я допоможу далі."
    ];

    function appendUserMessage(text) {
      const bubble = document.createElement("div");
      bubble.className = "support-msg support-msg-user";
      bubble.textContent = text;
      supportBody.appendChild(bubble);
      supportBody.scrollTop = supportBody.scrollHeight;
    }

    function appendAgentMessage(text) {
      const bubble = document.createElement("div");
      bubble.className = "support-msg support-msg-agent";
      bubble.textContent = text;
      supportBody.appendChild(bubble);
      supportBody.scrollTop = supportBody.scrollHeight;
    }

    function showTypingIndicator() {
      const typing = document.createElement("div");
      typing.className = "support-msg support-msg-agent support-typing";
      typing.textContent = `${BOT_NAME} пише...`;
      supportBody.appendChild(typing);
      supportBody.scrollTop = supportBody.scrollHeight;
      return typing;
    }

    function chooseResponse(userText) {
      const t = (userText || "").toLowerCase();
      if (t.includes("замовл") || t.includes("order") ) return BOT_RESPONSES[4];
      if (t.includes("коли") || t.includes("скільки") || t.includes("доставка")) return BOT_RESPONSES[1];
      if (t.includes("дяку") || t.includes("спас")) return BOT_RESPONSES[3];
      if (t.includes("не працює") || t.includes("помилка")) return BOT_RESPONSES[2];
      // default: random polite reply
      return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
    }

    supportForm.addEventListener("submit", e => {
      e.preventDefault();
      const text = supportText.value.trim();
      if (!text) return;

      appendUserMessage(text);
      supportText.value = "";

      // show typing indicator
      const typingEl = showTypingIndicator();

      // simulate agent thinking time (1.2s - 2.8s)
      const delay = 1200 + Math.floor(Math.random() * 1600);
      setTimeout(() => {
        // remove typing indicator
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
        // choose response based on message
        const reply = chooseResponse(text);
        appendAgentMessage(reply);
      }, delay);
    });
  }

  // product modal close / backdrop
  const productModal = $("#productModal");
  const pmCloseBtn   = $("#pmCloseBtn");
  if (pmCloseBtn) {
    pmCloseBtn.addEventListener("click", closeProductModal);
  }
  if (productModal) {
    productModal.addEventListener("click", e => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // toggle коментарів (показати/сховати)
  const pmCommentsToggleBtn = $("#pmCommentsToggleBtn");
  const pmCommentsBody = $("#pmCommentsBody");
  if (pmCommentsToggleBtn && pmCommentsBody) {
    pmCommentsToggleBtn.addEventListener("click", () => {
      const dict = I18N[currentLang] || I18N.uk;
      const showTxt = dict.comments_toggle_show || "Показати коментарі";
      const hideTxt = dict.comments_toggle_hide || "Сховати коментарі";

      const isHidden = pmCommentsBody.classList.toggle("is-hidden");
      pmCommentsToggleBtn.textContent = isHidden ? showTxt : hideTxt;
    });
  }

  // форма коментаря у товарі
  const pmCommentForm = $("#pmCommentForm");
  const pmCommentName = $("#pmCommentName");
  const pmCommentText = $("#pmCommentText");
  const pmCommentHint = $("#pmCommentHint");

  if (pmCommentForm && pmCommentText) {
    pmCommentForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!currentProductId) return;

      const name = (pmCommentName && pmCommentName.value.trim()) || "Анонім";
      const text = pmCommentText.value.trim();
      if (!text) return;

      const list = productComments[currentProductId] || [];
      list.unshift({
        name,
        text,
        createdAt: Date.now(),
        userId: currentUser ? currentUser.id : null,
        userEmail: currentUser ? currentUser.email : null
      });
      productComments[currentProductId] = list;
      saveLS();
      renderProductComments(currentProductId);

      pmCommentForm.reset();
      const dict = I18N[currentLang] || I18N.uk;
      const msg =
        dict.comments_saved_hint ||
        "Дякуємо за коментар! Він збережений у вашому браузері.";
      if (pmCommentHint) {
        pmCommentHint.textContent = msg;
        setTimeout(() => { pmCommentHint.textContent = ""; }, 3000);
      }
    });
  }

  updateBadges();
  initNavScroll();

  // кнопки в hero
  const heroShopBtn = $("#heroShopBtn");
  if (heroShopBtn) {
    heroShopBtn.addEventListener("click", () => scrollToSection("store"));
  }

  const heroHelpBtn = $("#heroHelpBtn");
  if (heroHelpBtn) {
    heroHelpBtn.addEventListener("click", () => scrollToSection("contacts"));
  }

  // Escape для модалок
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      closeFav();
      closeCmp();
      closeAuth();
      closeProductModal();
      closeOrderModal();
      if (typeof closeSupport === "function") {
        closeSupport();
      }
    }
  });

  // ініт сторінки реєстрації
  initRegisterPage();
});

/* ---------- Соцмережі та оплата у футері ---------- */

const SOCIAL_URLS = {
  instagram: "https://instagram.com/",
  facebook:  "https://facebook.com/",
  telegram:  "https://t.me/",
  viber:     "viber://chat"
};

document.querySelectorAll("[data-social]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.social;
    const url = SOCIAL_URLS[key];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
});

// Payment buttons: selection, persist choice, and availability checks
const PAYMENT_LS = "zf_payment_method";
function initPaymentButtons() {
  const btns = Array.from(document.querySelectorAll("[data-payment]"));
  if (!btns.length) return;

  const saved = localStorage.getItem(PAYMENT_LS);

  btns.forEach(btn => {
    const name = (btn.dataset.payment || "").toString();

    // Basic availability checks
    const lower = name.toLowerCase();
    if (lower.includes("apple")) {
      const appleOk = !!(window.ApplePaySession && ApplePaySession.canMakePayments && ApplePaySession.canMakePayments());
      if (!appleOk) {
        btn.classList.add("disabled");
        btn.setAttribute("aria-disabled", "true");
      }
    }
    if (lower.includes("google")) {
      // No direct Google Pay JS here — use Payment Request API as a hint
      const prOk = !!window.PaymentRequest;
      if (!prOk) {
        btn.classList.add("disabled");
        btn.setAttribute("aria-disabled", "true");
      }
    }

    // restore saved selection
    if (saved && saved === name) {
      btn.classList.add("active");
      // sync selects if any
      const sel1 = document.getElementById("orderPayment");
      const sel2 = document.getElementById("ofPayment");
      if (sel1) sel1.value = name;
      if (sel2) sel2.value = name;
    }

    btn.addEventListener("click", () => {
      if (btn.classList.contains("disabled")) {
        const msg = `Платіжний метод «${name}» недоступний у цьому браузері.`;
        alert(msg);
        return;
      }

      // toggle active state (single selection)
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem(PAYMENT_LS, name);

      // sync with checkout selects if present
      const selA = document.getElementById("orderPayment");
      const selB = document.getElementById("ofPayment");
      if (selA) selA.value = name;
      if (selB) selB.value = name;

      // Provide demo behaviour for Apple/Google
      if (lower.includes("apple")) {
        if (window.ApplePaySession && ApplePaySession.canMakePayments && ApplePaySession.canMakePayments()) {
          alert("Apple Pay доступний — тут можна ініціювати Apple Pay сесію.");
        } else {
          alert("Apple Pay недоступний у цьому середовищі.");
        }
      } else if (lower.includes("google")) {
        if (window.PaymentRequest) {
          alert("Google/PaymentRequest API доступний — тут можна ініціювати платіж.");
        } else {
          alert("Google Pay / Payment Request API недоступні у цьому браузері.");
        }
      } else {
        // generic card selection
        alert(`Обрано спосіб оплати: ${name}.`);
      }
    });
  });
}

// Ініціалізуємо при завантаженні DOM
document.addEventListener("DOMContentLoaded", () => {
  try { initPaymentButtons(); } catch (e) { console.warn("initPaymentButtons error", e); }
});

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem(LS_USER);

    alert("Ви успішно вийшли з акаунту!");

    updateAccountTitle();

    const accountBtn2 = document.getElementById("accountBtn");
    if (accountBtn2) {
      accountBtn2.classList.remove("active");
    }

    const authModal2 = document.getElementById("authModal");
    if (authModal2) {
      authModal2.classList.remove("is-open");
    }
  });
}

/* =========================================
   РЕЄСТРАЦІЯ НА СТОРІНЦІ register.html (дубль, якщо відкрито окремо)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerForm");
  if (!regForm) return; // ми не на сторінці реєстрації

  const nameInput  = document.getElementById("regName");
  const emailInput = document.getElementById("regEmail");
  const passInput  = document.getElementById("regPassword");
  const pass2Input = document.getElementById("regPassword2");
  const phoneInput = document.getElementById("regPhone");
  const cityInput  = document.getElementById("regCity");
  const errorBox   = document.getElementById("regError");

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorBox) errorBox.textContent = "";

    const name  = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const pass  = passInput.value;
    const pass2 = pass2Input.value;
    const phone = phoneInput.value.trim();
    const city  = cityInput.value.trim();

    // базова валідація
    if (!name || !email || !pass || !pass2) {
      if (errorBox) errorBox.textContent = "Заповніть усі обов’язкові поля.";
      return;
    }

    if (pass !== pass2) {
      if (errorBox) errorBox.textContent = "Паролі не співпадають.";
      return;
    }

    // проста перевірка e-mail
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      if (errorBox) errorBox.textContent = "Некоректний e-mail.";
      return;
    }
    // Спроба зареєструватися через бекенд (новий API)
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone, city })
    })
      .then(async resp => {
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data && data.status === 'ok') {
          const user = data.user;
          try {
            const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
            const exists = users.some(u => (u.email||"").toLowerCase() === (user.email||"").toLowerCase());
            if (!exists) {
              users.push(user);
              localStorage.setItem(LS_USERS, JSON.stringify(users));
            }
            localStorage.setItem(LS_USER, JSON.stringify(user));
            saveToken(data.token);
          } catch {}

          alert(
            `Акаунт створено!\n\n` +
            `E-mail: ${user.email}\n` +
            `ID: ${user.id}\n\n`
          );

          window.location.href = "index.html";
        } else {
          if (errorBox) errorBox.textContent = data && data.message ? data.message : "Помилка реєстрації";
        }
      })
      .catch(() => {
        // fallback: локальне збереження у випадку відсутності бекенду
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
        } catch {
          users = [];
        }

        const existing = users.find(u => u.email.toLowerCase() === email);
        if (existing) {
          if (errorBox) {
            errorBox.textContent =
              "Користувач з таким email вже існує. Спробуйте увійти.";
          }
          return;
        }

        const user = {
          id: generateUserId(),                 // береться з app.js
          createdAt: new Date().toISOString(),
          email,
          name,
          passwordHash: btoa(pass),             // тільки для тестування
          phone: phone || null,
          city: city || null
        };

        users.push(user);
        localStorage.setItem(LS_USERS, JSON.stringify(users));
        localStorage.setItem(LS_USER, JSON.stringify(user));

        alert(
          `Акаунт створено!\n\n` +
          `E-mail: ${email}\n` +
          `ID: ${user.id}\n\n` +
          `Дані зберігаються лише у вашому браузері.`
        );

        window.location.href = "index.html";
      });
  });
});
/* =========================================
   ПЛАВНІ ЕФЕКТИ ДЛЯ САЙТУ (без нових файлів)
   ========================================= */

/* ---------- 1. Плавна поява всієї сторінки ---------- */
// Коли все (HTML + картинки + шрифти) завантажилось – додаємо клас
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

/* ---------- 2. Плавна поява блоків при скролі ---------- */

(function () {
  let zfScrollObserver = null;

  function createScrollObserver() {
    if (!("IntersectionObserver" in window)) {
      // Якщо браузер старий – просто показати всі елементи
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.classList.add("sr-visible");
      });
      return null;
    }

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-visible");
            zfScrollObserver.unobserve(entry.target); // анімація тільки один раз
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
      }
    );
  }

  function applyRevealToTargets() {
    if (!zfScrollObserver) return;

    const selectors = [
      // основні секції (перевір, що такі id є в твоєму index.html)
      "#hero",
      "#store",
      "#reviews",
      "#faq",
      "#contacts",
      ".contacts-strip",
      ".benefits-section",
      // картки товарів
      ".card"
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!el.classList.contains("reveal-on-scroll")) {
          el.classList.add("reveal-on-scroll");
        }
        if (!el.dataset.srInit) {
          el.dataset.srInit = "1";
          zfScrollObserver.observe(el);
        }
      });
    });
  }

  function initScrollReveal() {
    zfScrollObserver = createScrollObserver();
    if (!zfScrollObserver) return;

    // одразу підвісити на вже існуючі елементи
    applyRevealToTargets();

    // якщо оновлюється список товарів (#grid) – підвісити на нові картки
    const grid = document.getElementById("grid");
    if (grid && "MutationObserver" in window) {
      const mo = new MutationObserver(() => {
        applyRevealToTargets();
      });
      mo.observe(grid, { childList: true, subtree: true });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
  });
})();
// ========= ПЛАВНА ПОЯВА СТОРІНКИ + БЛОКІВ =========

document.addEventListener("DOMContentLoaded", () => {
  // 1) плавна поява всієї сторінки (.page)
  const pageEl = document.querySelector(".page");
  if (pageEl) {
    // маленька затримка, щоб браузер встиг застосувати початкові стилі
    requestAnimationFrame(() => {
      pageEl.classList.add("page-loaded");
    });
  }

  // 2) елементи, які мають клас .reveal-on-scroll
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (!revealEls.length) return;

  // якщо браузер підтримує IntersectionObserver — робимо плавну появу
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-visible");
            observer.unobserve(entry.target); // анімація тільки 1 раз
          }
        });
      },
      {
        threshold: 0.15 // 15% елемента у в'юпорті — запускаємо анімацію
      }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // старі браузери — просто одразу показуємо
    revealEls.forEach(el => el.classList.add("sr-visible"));
  }
});
/* =========================
   ORDER MODAL (safe version)
   ========================= */
(function () {
  // ключ для localStorage (інша назва, щоб точно не конфліктувати)
  const ORDER_LS_KEY = "zf_orders";

  // якщо escapeHtml немає – додаємо
  if (typeof window.escapeHtml !== "function") {
    window.escapeHtml = function (str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
  }

  // шукаємо модалку; якщо її немає на сторінці – тихенько виходимо
  const backdrop = document.getElementById("orderModal");
  const form = document.getElementById("orderForm");
  if (!backdrop || !form) {
    return;
  }

  const summaryItemsEl = document.getElementById("orderSummaryItems");
  const summaryTotalEl = document.getElementById("orderSummaryTotal");
  const summaryItemsCountEl = document.getElementById("orderSummaryItemsCount");
  const summaryCountEl = document.getElementById("orderSummaryCount");
  const hintEl = document.getElementById("orderHint");

  const nameEl = document.getElementById("orderName");
  const phoneEl = document.getElementById("orderPhone");
  const emailEl = document.getElementById("orderEmail");
  const addressEl = document.getElementById("orderAddress");
  const deliveryEl = document.getElementById("orderDelivery");
  const paymentEl = document.getElementById("orderPayment");
  const commentEl = document.getElementById("orderComment");

  function loadOrders() {
    try {
      const raw = localStorage.getItem(ORDER_LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDER_LS_KEY, JSON.stringify(orders));
  }

  function openModal() {
    fillSummaryFromCart();
    if (hintEl) hintEl.textContent = "";
    backdrop.classList.add("is-open");
  }

  function closeModal() {
    backdrop.classList.remove("is-open");
  }

  // кнопки відкриття/закриття (через data-атрибути)
  document.addEventListener("click", e => {
    const openBtn = e.target.closest("[data-order-open]");
    if (openBtn) {
      e.preventDefault();
      openModal();
      return;
    }

    const closeBtn = e.target.closest("[data-order-close]");
    if (closeBtn) {
      e.preventDefault();
      closeModal();
      return;
    }
  });

  // клік по фону
  backdrop.addEventListener("click", e => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // формуємо деталізацію кошика
  function getCartDetailed() {
    if (!window.CART || !window.PRODUCTS) return [];

    return CART.map(item => {
      const p = PRODUCTS.find(x => String(x.id) === String(item.id));
      if (!p) return null;
      const qty = Number(item.qty || 1);
      const price = Number(p.price || 0);
      return {
        id: p.id,
        title: p.title,
        weight: p.weight,
        qty,
        price,
        sum: price * qty
      };
    }).filter(Boolean);
  }

  function fillSummaryFromCart() {
    if (!summaryItemsEl) return;

    const items = getCartDetailed();
    if (!items.length) {
      summaryItemsEl.innerHTML =
        '<div style="font-size:13px;color:#9ca3af;">Кошик порожній.</div>';
      if (summaryTotalEl) summaryTotalEl.textContent = "0 ₴";
      if (summaryItemsCountEl) summaryItemsCountEl.textContent = "0";
      if (summaryCountEl) summaryCountEl.textContent = "0 товарів";
      return;
    }

    let total = 0;
    summaryItemsEl.innerHTML = items
      .map(it => {
        total += it.sum;
        return `
          <article class="order-summary-item">
            <div class="order-summary-title">
              ${escapeHtml(it.title)}
              <div class="order-summary-meta">ID: ${escapeHtml(it.id)}</div>
            </div>
            <div class="order-summary-qty">x${it.qty}</div>
            <div class="order-summary-price">${moneyUAH(it.price)}</div>
            <div class="order-summary-sum">${moneyUAH(it.sum)}</div>
          </article>
        `;
      })
      .join("");

    const countLabel =
      items.length === 1 ? "1 товар" : items.length + " товари";

    if (summaryTotalEl) summaryTotalEl.textContent = moneyUAH(total);
    if (summaryItemsCountEl) summaryItemsCountEl.textContent = String(items.length);
    if (summaryCountEl) summaryCountEl.textContent = countLabel;
  }

  // надсилання форми
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!window.CART || !CART.length) {
      if (hintEl) hintEl.textContent = "Кошик порожній.";
      return;
    }

    const name = (nameEl?.value || "").trim();
    const phone = (phoneEl?.value || "").trim();
    const email = (emailEl?.value || "").trim();
    const address = (addressEl?.value || "").trim();
    const delivery = deliveryEl?.value || "nova_poshta";
    const payment = paymentEl?.value || "card";
    const comment = (commentEl?.value || "").trim();

    if (!name || !phone || !address) {
      if (hintEl) hintEl.textContent = "Заповніть обов’язкові поля.";
      return;
    }

    const items = getCartDetailed();
    let total = 0;
    items.forEach(it => (total += it.sum));

    const orders = loadOrders();

    const newOrder = {
      id: "ord-" + Date.now(),
      name,
      phone,
      userEmail: email,
      address,
      delivery,
      payment,
      comment,
      items,
      total,
      status: "new",
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    // очищаємо кошик – тут використовуємо твою існуючу логіку
    if (window.CART) {
      CART = [];
    }
    if (typeof saveCartToLS === "function") saveCartToLS();
    if (typeof renderCart === "function") renderCart();
    if (typeof updateBadges === "function") updateBadges();

    if (hintEl) hintEl.textContent = "Замовлення збережено. Дякуємо!";

    setTimeout(() => {
      closeModal();
    }, 700);
  });
})();
// ===== ОФОРМЛЕННЯ ЗАМОВЛЕННЯ (модалка) =====
(function () {
  const cartDrawer = document.getElementById("cartDrawer");
  const cartList = document.getElementById("cartList");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("cartCheckoutBtn");

  const orderModal = document.getElementById("orderModal");
  const orderForm = document.getElementById("orderForm");
  const orderSummaryItems = document.getElementById("orderSummaryItems");
  const orderSummaryItemsCount = document.getElementById("orderSummaryItemsCount");
  const orderSummaryCount = document.getElementById("orderSummaryCount");
  const orderSummaryTotal = document.getElementById("orderSummaryTotal");
  const orderHint = document.getElementById("orderHint");

  if (!checkoutBtn || !orderModal || !orderForm) return;

  const closeBtns = orderModal.querySelectorAll("[data-order-close]");

  function fillSummaryFromCart() {
    if (!cartList) return;

    // копіюємо вміст кошика в ліву колонку модалки
    orderSummaryItems.innerHTML = cartList.innerHTML;

    const itemsCount = cartList.children.length;
    orderSummaryItemsCount.textContent = String(itemsCount);

    let label = "0 товарів";
    if (itemsCount === 1) label = "1 товар";
    else if (itemsCount >= 2 && itemsCount <= 4) label = itemsCount + " товари";
    else if (itemsCount >= 5) label = itemsCount + " товарів";
    orderSummaryCount.textContent = label;

    orderSummaryTotal.textContent = cartTotalEl
      ? cartTotalEl.textContent
      : "0 ₴";
  }

  function openOrderModal() {
    // якщо кошик порожній — нічого не відкриваємо
    if (!cartList || cartList.children.length === 0) {
      alert("Кошик порожній 🙂");
      return;
    }

    fillSummaryFromCart();
    orderHint.textContent = "";

    orderModal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // ховаємо сам кошик
    if (cartDrawer) {
      cartDrawer.classList.remove("is-open");
    }
  }

  function closeOrderModal() {
    orderModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  checkoutBtn.addEventListener("click", openOrderModal);

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeOrderModal);
  });

  // клік по темному фону поза вікном – теж закриває
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) {
      closeOrderModal();
    }
  });

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const address = document.getElementById("orderAddress").value.trim();
    const email = document.getElementById("orderEmail").value.trim();
    const delivery = document.getElementById("orderDelivery").value;
    const payment = document.getElementById("orderPayment").value;
    const comment = document.getElementById("orderComment").value.trim();

    if (!name || !phone || !address) {
      orderHint.textContent = "Заповніть, будь ласка, всі обов’язкові поля.";
      orderHint.style.color = "#f97373";
      return;
    }

    // зберігаємо дані замовлення в localStorage
    const orderData = {
      name,
      phone,
      email,
      address,
      delivery,
      payment,
      comment,
      total: orderSummaryTotal.textContent,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("zoofeed_last_order", JSON.stringify(orderData));
    } catch (err) {
      // якщо localStorage недоступний – просто ігноруємо
    }

    orderHint.textContent =
      "Дякуємо! Замовлення збережено (без реальної відправки).";
    orderHint.style.color = "#22c55e";

    // Очищаємо кошик (використовуємо існуючі функції з app.js, якщо вони є)
    try {
      if (Array.isArray(cart)) {
        cart.length = 0;
      }
      if (typeof saveLS === "function") saveLS();
      if (typeof renderCart === "function") renderCart();
      if (typeof updateBadges === "function") updateBadges();
    } catch (err) {
      // якщо цих змінних/функцій немає – просто пропускаємо
    }

    // Через трохи закриваємо модалку
    setTimeout(() => {
      closeOrderModal();
    }, 900);
  });
})();
// ===== ДОДАВАННЯ В КОШИК З МОДАЛКИ ТОВАРУ =====
(function () {
  const btn = document.getElementById("pmAddToCartBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // currentProductId виставляється в openProductModalById(id)
    if (typeof currentProductId === "undefined" || !currentProductId) {
      console.warn("currentProductId не заданий, не можу додати в кошик");
      return;
    }

    if (typeof addToCart === "function") {
      addToCart(currentProductId);
    } else {
      console.warn("Функція addToCart не знайдена");
    }
  });
})();
