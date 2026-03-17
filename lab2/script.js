const equipment = [
  { img: "images/bike.png", name: "Гірський велосипед", price: 300 },
  { img: "images/kayak.png", name: "Каяк", price: 250 },
  { img: "images/tent.png", name: "Намет", price: 750 },
  { img: "images/snowboard.png", name: "Сноуборд", price: 350 }
];

const initialActiveRents = [
  { name: "Гірський велосипед", endDate: "2026-04-25", quantity: 1, days: 10 },
  { name: "Каяк", endDate: "2026-03-21", quantity: 1, days: 4 }
];

const grid = document.querySelector(".equipment-grid");
const cartItemsContainer = document.querySelector("#cartItems");
const totalPrice = document.querySelector("#totalPrice");
const rentSection = document.querySelector(".rents");
const toggleRentButton = document.querySelector("#hide-btn");
const checkoutButton = document.querySelector("#checkout-btn");
const paymentSection = document.querySelector("#paymant");
const paymentForm = document.querySelector("#payment-form");
const paymentMessage = document.querySelector("#payment-message");
const activeRentsList = document.querySelector("#active-rents-list");
const today = new Date().toISOString().split("T")[0];
const cart = [];

function formatDate(dateString) {
  if (!dateString) {
    return "Не обрано";
  }

  return new Date(dateString).toLocaleDateString("uk-UA");
}

function getRentalDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end - start;

  if (Number.isNaN(difference) || difference < 0) {
    return 0;
  }

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
}

function setPaymentMessage(text, isError) {
  paymentMessage.textContent = text;
  paymentMessage.classList.remove("hidden", "payment-error", "payment-success");
  paymentMessage.classList.add(isError ? "payment-error" : "payment-success");
}

function clearPaymentMessage() {
  paymentMessage.textContent = "";
  paymentMessage.classList.add("hidden");
  paymentMessage.classList.remove("payment-error", "payment-success");
}

function updateRentButtons() {
  const buttons = document.querySelectorAll(".rent-btn");
  let index = 0;

  while (index < buttons.length) {
    const button = buttons[index];
    const productId = Number(button.dataset.index);
    const isInCart = cart.some((item) => item.id === productId);

    if (isInCart) {
      button.classList.add("selected");
      button.textContent = "У кошику";
    } else {
      button.classList.remove("selected");
      button.textContent = "Орендувати";
    }

    index += 1;
  }
}

function updateCheckoutButton() {
  checkoutButton.disabled = cart.length === 0;
}

function renderActiveRents() {
  activeRentsList.innerHTML = "";
  let index = 0;

  do {
    const item = initialActiveRents[index];

    if (!item) {
      break;
    }

    const rentItem = document.createElement("li");
    rentItem.innerHTML = `- <a href="#">${item.name}</a> до ${formatDate(item.endDate)} (${item.quantity} шт., ${item.days} дн.)`;
    activeRentsList.append(rentItem);
    index += 1;
  } while (index < initialActiveRents.length);
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = `
      <p class="cart-empty">Кошик порожній. Додайте товар, щоб обрати дати оренди та кількість.</p>
    `;
    totalPrice.textContent = "Сума: 0 грн";
    updateRentButtons();
    updateCheckoutButton();
    return;
  }

  let total = 0;
  let index = 0;

  do {
    const item = cart[index];
    const days = getRentalDays(item.startDate, item.endDate);
    const itemTotal = days > 0 ? item.price * item.quantity * days : 0;
    total += itemTotal;

    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-content">
        <div class="cart-item-top">
          <div>
            <h3>${item.name}</h3>
            <p class="cart-item-price">${item.price} грн/день</p>
          </div>
          <button class="cart-remove" data-id="${item.id}" type="button">Видалити</button>
        </div>
        <div class="cart-controls">
          <label>
            Дата початку
            <input type="date" class="cart-date" data-field="startDate" data-id="${item.id}" min="${today}" value="${item.startDate}">
          </label>
          <label>
            Дата завершення
            <input type="date" class="cart-date" data-field="endDate" data-id="${item.id}" min="${item.startDate || today}" value="${item.endDate}">
          </label>
          <label>
            Кількість
            <input type="number" class="cart-quantity" data-id="${item.id}" min="1" value="${item.quantity}">
          </label>
        </div>
        <p class="cart-summary">
          ${days > 0
            ? `Оренда з ${formatDate(item.startDate)} по ${formatDate(item.endDate)}: ${days} дн. × ${item.quantity} шт. = ${itemTotal} грн`
            : "Оберіть коректні дати оренди, щоб побачити підсумок."}
        </p>
      </div>
    `;

    cartItemsContainer.append(cartItem);
    index += 1;
  } while (index < cart.length);

  totalPrice.textContent = `Сума: ${total} грн`;
  updateRentButtons();
  updateCheckoutButton();
}

function addToCart(productId) {
  const selectedProduct = equipment[productId];
  const existingItem = cart.find((item) => item.id === productId);

  if (!selectedProduct || existingItem) {
    return;
  }

  cart.push({
    id: productId,
    img: selectedProduct.img,
    name: selectedProduct.name,
    price: selectedProduct.price,
    quantity: 1,
    startDate: today,
    endDate: today
  });

  renderCart();
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex === -1) {
    return;
  }

  cart.splice(itemIndex, 1);
  renderCart();
}

function updateCartItem(productId, field, value) {
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) {
    return;
  }

  if (field === "quantity") {
    cartItem.quantity = Math.max(1, Number(value) || 1);
  } else {
    cartItem[field] = value;

    if (field === "startDate" && cartItem.endDate < value) {
      cartItem.endDate = value;
    }
  }

  renderCart();
}

function addItemsToActiveRents(items) {
  let index = 0;

  do {
    const item = items[index];

    if (!item) {
      break;
    }

    const rentItem = document.createElement("li");
    const days = getRentalDays(item.startDate, item.endDate);
    rentItem.innerHTML = `- <a href="#">${item.name}</a> до ${formatDate(item.endDate)} (${item.quantity} шт., ${days} дн.)`;
    activeRentsList.prepend(rentItem);
    index += 1;
  } while (index < items.length);
}

function validatePaymentForm() {
  const fullname = paymentForm.fullname.value.trim();
  const email = paymentForm.email.value.trim();
  const phone = paymentForm.phone.value.trim();
  const card = paymentForm.card.value.replace(/\s+/g, "");
  const expiry = paymentForm.expiry.value.trim();
  const cvv = paymentForm.cvv.value.trim();

  if (!cart.length) {
    return { valid: false, message: "Кошик порожній. Спочатку додайте товари." };
  }

  if (!fullname || fullname.length < 3) {
    return { valid: false, message: "Введіть ім'я та прізвище." };
  }

  if (!email.includes("@") || !email.includes(".")) {
    return { valid: false, message: "Введіть коректну електронну пошту." };
  }

  if (!/^\+?\d[\d\s-]{8,}$/.test(phone)) {
    return { valid: false, message: "Введіть коректний номер телефону." };
  }

  if (!/^\d{16}$/.test(card)) {
    return { valid: false, message: "Номер картки має містити 16 цифр." };
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { valid: false, message: "Введіть термін дії у форматі MM/YY." };
  }

  if (!/^\d{3}$/.test(cvv)) {
    return { valid: false, message: "CVV має містити 3 цифри." };
  }

  const hasInvalidDates = cart.some((item) => getRentalDays(item.startDate, item.endDate) === 0);

  if (hasInvalidDates) {
    return { valid: false, message: "Оберіть коректні дати оренди для всіх товарів." };
  }

  return {
    valid: true,
    customer: {
      fullname,
      email,
      phone
    }
  };
}

function processPayment(customer) {
  const purchasedItems = cart.map((item) => ({ ...item }));
  addItemsToActiveRents(purchasedItems);
  cart.length = 0;
  paymentForm.reset();
  renderCart();
  setPaymentMessage("Оплата пройшла успішно. Товари додано в активні оренди.", false);
  document.querySelector("#orend").scrollIntoView({ behavior: "smooth" });
}

function renderEquipment() {
  let index = 0;

  do {
    const item = equipment[index];

    if (!item) {
      break;
    }

    const article = document.createElement("article");
    article.classList.add("product-card");

    article.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="price">Ціна: ${item.price} грн/день</p>
      <button class="btn small rent-btn" data-index="${index}" type="button">Орендувати</button>
    `;

    grid.append(article);
    index += 1;
  } while (index < equipment.length);
}

function decorateProductCards() {
  const cards = document.querySelectorAll(".product-card");

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];

    if (index % 2 === 0) {
      card.classList.add("product-accent");
    } else {
      card.classList.remove("product-accent");
    }
  }
}

function attachRentButtonEvents() {
  const buttons = document.querySelectorAll(".rent-btn");

  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];

    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.index));
    });

    button.addEventListener("mouseenter", () => {
      if (button.classList.contains("selected")) {
        button.textContent = "Вже додано";
      } else {
        button.textContent = "Додати в кошик";
      }
    });

    button.addEventListener("mouseleave", () => {
      const productId = Number(button.dataset.index);

      if (cart.some((item) => item.id === productId)) {
        button.textContent = "У кошику";
      } else {
        button.textContent = "Орендувати";
      }
    });
  }
}

function attachNavigationHover() {
  const navLinks = document.querySelectorAll(".navLink");

  for (let index = 0; index < navLinks.length; index += 1) {
    const link = navLinks[index];

    link.addEventListener("mouseenter", () => {
      link.textContent = `Перейти: ${link.textContent}`;
    });

    link.addEventListener("mouseleave", () => {
      if (link.getAttribute("href") === "#equipment") {
        link.textContent = "Обладнання";
      } else if (link.getAttribute("href") === "#orend") {
        link.textContent = "Мої оренди";
      } else {
        link.textContent = "Оплата";
      }
    });
  }
}

renderEquipment();
renderActiveRents();
renderCart();
decorateProductCards();
attachRentButtonEvents();
attachNavigationHover();

cartItemsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-remove");

  if (!removeButton) {
    return;
  }

  removeFromCart(Number(removeButton.dataset.id));
});

cartItemsContainer.addEventListener("input", (event) => {
  const target = event.target;
  const productId = Number(target.dataset.id);

  if (target.classList.contains("cart-quantity")) {
    updateCartItem(productId, "quantity", target.value);
  } else if (target.classList.contains("cart-date")) {
    updateCartItem(productId, target.dataset.field, target.value);
  }
});

checkoutButton.addEventListener("click", () => {
  if (!cart.length) {
    setPaymentMessage("Спочатку додайте товар у кошик.", true);
    return;
  }

  clearPaymentMessage();
  paymentSection.scrollIntoView({ behavior: "smooth" });
});

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const validation = validatePaymentForm();

  if (!validation.valid) {
    setPaymentMessage(validation.message, true);
    return;
  }

  processPayment(validation.customer);
});

toggleRentButton.addEventListener("click", () => {
  rentSection.classList.toggle("hidden");

  if (rentSection.classList.contains("hidden")) {
    toggleRentButton.textContent = "Показати оренди";
  } else {
    toggleRentButton.textContent = "Сховати оренди";
  }
});
