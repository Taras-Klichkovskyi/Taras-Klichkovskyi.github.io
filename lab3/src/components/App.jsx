import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Layout from "./Layout";
import HomePage from "../pages/HomePage";
import RentalsPage from "../pages/RentalsPage";
import PaymentPage from "../pages/PaymentPage";
import NotFoundPage from "../pages/NotFoundPage";
import { equipment } from "../data/equipmentData";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

const shiftDate = (daysOffset) => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysOffset);
  return formatDate(nextDate);
};

const getRentalDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);

  if (Number.isNaN(diff)) {
    return 1;
  }

  return Math.max(1, Math.floor(diff / DAY_IN_MS) + 1);
};

const buildPaymentLabel = (cardNumber) => {
  const digits = (cardNumber ?? "").replace(/\D/g, "");

  if (digits.length >= 4) {
    return `Картка •••• ${digits.slice(-4)}`;
  }

  return "Картка •••• 4242";
};

const buildRentalEntry = (item, paymentData = {}, overrides = {}) => {
  const quantity = overrides.quantity ?? item.quantity ?? 1;
  const startDate = overrides.startDate ?? item.startDate ?? formatDate(new Date());
  const endDate = overrides.endDate ?? item.endDate ?? startDate;
  const days = getRentalDays(startDate, endDate);

  return {
    rentalId:
      overrides.rentalId ??
      `rental-${Date.now()}-${item.id}-${Math.random().toString(16).slice(2, 6)}`,
    id: item.id,
    category: item.category,
    img: item.img,
    name: item.name,
    price: item.price,
    quantity,
    startDate,
    endDate,
    totalPrice: item.price * quantity * days,
    customerName: overrides.customerName ?? paymentData.fullName ?? "Користувач RentSport",
    phone: overrides.phone ?? paymentData.phone ?? "+380 67 000 00 00",
    email: overrides.email ?? paymentData.email ?? "customer@rentsport.ua",
    paymentLabel: overrides.paymentLabel ?? buildPaymentLabel(paymentData.cardNumber),
    paidAt: overrides.paidAt ?? formatDate(new Date()),
  };
};

const createSampleRental = (itemId, overrides) => {
  const item = equipment.find((entry) => entry.id === itemId);

  if (!item) {
    return null;
  }

  return buildRentalEntry(
    {
      ...item,
      quantity: overrides.quantity,
      startDate: overrides.startDate,
      endDate: overrides.endDate,
    },
    {
      fullName: overrides.customerName,
      phone: overrides.phone,
      email: overrides.email,
      cardNumber: overrides.cardNumber,
    },
    overrides
  );
};

const defaultRentalHistory = [
  createSampleRental(1, {
    rentalId: "sample-active-bike",
    customerName: "Ірина Соколовська",
    phone: "+380 67 321 11 22",
    email: "iryna@example.com",
    cardNumber: "4242 4242 4242 4821",
    paymentLabel: "Visa •••• 4821",
    quantity: 1,
    startDate: shiftDate(-2),
    endDate: shiftDate(3),
    paidAt: shiftDate(-2),
  }),
  createSampleRental(3, {
    rentalId: "sample-completed-tent",
    customerName: "Олексій Бойко",
    phone: "+380 50 118 45 09",
    email: "boyko@example.com",
    cardNumber: "5555 5555 5555 1881",
    paymentLabel: "Mastercard •••• 1881",
    quantity: 2,
    startDate: shiftDate(-12),
    endDate: shiftDate(-7),
    paidAt: shiftDate(-13),
  }),
  createSampleRental(4, {
    rentalId: "sample-completed-board",
    customerName: "Марія Коваль",
    phone: "+380 93 447 20 18",
    email: "maria.koval@example.com",
    cardNumber: "4444 3333 2222 3114",
    paymentLabel: "Visa •••• 3114",
    quantity: 1,
    startDate: shiftDate(-24),
    endDate: shiftDate(-18),
    paidAt: shiftDate(-25),
  }),
].filter(Boolean);

const App = () => {
  const today = formatDate(new Date());
  const [cart, setCart] = useState([]);
  const [rentalHistory, setRentalHistory] = useState(defaultRentalHistory);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1, startDate: today, endDate: today }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Number(newQuantity) }
          : item
      )
    );
  };

  const updateStartDate = (id, date) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, startDate: formatDate(date) }
          : item
      )
    );
  };

  const updateEndDate = (id, date) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, endDate: formatDate(date) }
          : item
      )
    );
  };

  const completePayment = (paymentData) => {
    if (cart.length === 0) {
      return;
    }

    const paidRentals = cart.map((item) => buildRentalEntry(item, paymentData));

    setRentalHistory((prevHistory) => [...paidRentals, ...prevHistory]);
    setCart([]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage cart={cart} addToCart={addToCart} />} />
        <Route
          path="/rentals"
          element={
            <RentalsPage
              cart={cart}
              updateQuantity={updateQuantity}
              startDate={updateStartDate}
              endDate={updateEndDate}
              removeFromCart={removeFromCart}
              completePayment={completePayment}
            />
          }
        />
        <Route
          path="/payment"
          element={<PaymentPage rentalHistory={rentalHistory} />}
        />
        <Route path="/paymant" element={<Navigate to="/payment" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
