import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import PaymentForm from "./PaymentForm";
import "../css/rentals.css";
import { AuthContext } from "../Provider";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const currencyFormatter = new Intl.NumberFormat("uk-UA");

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const getRentalDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);

  if (Number.isNaN(diff)) {
    return 1;
  }

  return Math.max(1, Math.floor(diff / DAY_IN_MS) + 1);
};

const buildPaymentLabel = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, "");

  return `Картка •••• ${digits.slice(-4)}`.trim();
};

const Rentals = ({
  cart,
  updateQuantity,
  startDate: updateStartDate,
  endDate: updateEndDate,
  removeFromCart,
  completePayment,
}) => {
  const navigate = useNavigate();
  const { user, userData } = useContext(AuthContext);
  const [paymentData, setPaymentData] = useState({
    fullName: userData?.name ?? "",
    phone: userData?.phone ?? "",
    email: userData?.email ?? "",
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
    agreement: false,
  });

  const handlePaymentChange = ({ target }) => {
    const { name, type, checked, value } = target;
    let nextValue = type === "checkbox" ? checked : value;

    if (name === "cardNumber") {
      nextValue = formatCardNumber(value);
    }

    if (name === "expiry") {
      nextValue = formatExpiry(value);
    }

    if (name === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentData((prevPaymentData) => ({
      ...prevPaymentData,
      [name]: nextValue,
    }));
  };

  const handleStartDateChange = (itemId, nextStartDate, currentEndDate) => {
    updateStartDate(itemId, nextStartDate);

    if (new Date(currentEndDate) < new Date(nextStartDate)) {
      updateEndDate(itemId, nextStartDate);
    }
  };

  const handleQuantityChange = (itemId, nextQuantity) => {
    updateQuantity(itemId, Math.max(1, Number(nextQuantity) || 1));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
  const days = getRentalDays(item.startDate, item.endDate);

    return sum + item.price * item.quantity * days;
  }, 0);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        phone: paymentData.phone,
      });

      await addDoc(collection(db, "users", user.uid, "orders"), {
        fullName: paymentData.fullName,
        phone: paymentData.phone,
        email: paymentData.email,
        totalPrice,
        paymentLabel: buildPaymentLabel(paymentData.cardNumber),
        items: cart.map((item) => ({
          id: item.id,
          category: item.category,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
        createdAt: serverTimestamp(),
      });

      if (typeof completePayment === "function") {
        completePayment();
      }

      navigate("/payment");
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart cart-empty">
        <img
          src="https://xl-static.rozetka.com.ua/h-e401be41/assets/img/design/modal-cart-dummy.svg"
          alt="Порожній кошик"
        />
        <h3>Кошик порожній</h3>
        <p>Але це завжди можна швидко виправити :)</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <main className="cart cart-filled">
        {cart.map((item) => {
          const days = getRentalDays(item.startDate, item.endDate);
          const itemPrice = item.price * item.quantity * days;

          return (
            <article key={item.id} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-item-image" />

              <div className="cart-item-content">
                <div className="cart-item-top">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">{item.price} грн/день</p>
                  </div>

                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Видалити
                  </button>
                </div>

                <div className="cart-controls">
                  <label>
                    Дата початку
                    <input
                      type="date"
                      min={new Date().toLocaleDateString("en-CA")}
                      value={item.startDate}
                      onChange={(event) =>
                        handleStartDateChange(
                          item.id,
                          event.target.value,
                          item.endDate
                        )
                      }
                    />
                  </label>

                  <label>
                    Дата завершення
                    <input
                      type="date"
                      min={item.startDate}
                      value={item.endDate}
                      onChange={(event) =>
                        updateEndDate(item.id, event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Кількість
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(event) =>
                        handleQuantityChange(item.id, event.target.value)
                      }
                    />
                  </label>
                </div>

                <p className="cart-summary">
                  Оренда з {item.startDate} по {item.endDate}: {days} дн. x{" "}
                  {item.quantity} шт. = {currencyFormatter.format(itemPrice)} грн
                </p>
              </div>
            </article>
          );
        })}
      </main>

      <aside className="cart-aside">
        <div className="cart-aside-header">
          <p className="cart-aside-kicker">Оформлення оплати</p>
          <h3>Дані для оплати</h3>
          <p className="cart-aside-description">
            Перевірте суму замовлення та заповніть реквізити картки, щоб
            завершити бронювання.
          </p>
        </div>

        <div className="cart-total-card">
          <div className="cart-total-row">
            <span>Товарів у кошику</span>
            <strong>{totalItems}</strong>
          </div>
          <div className="cart-total-row">
            <span>До сплати</span>
            <strong>{currencyFormatter.format(totalPrice)} грн</strong>
          </div>
        </div>

        <PaymentForm
          paymentData={paymentData}
          totalPrice={totalPrice}
          onPaymentChange={handlePaymentChange}
          onSubmit={handlePaymentSubmit}
        />
      </aside>
    </div>
  );
};

export default Rentals;
