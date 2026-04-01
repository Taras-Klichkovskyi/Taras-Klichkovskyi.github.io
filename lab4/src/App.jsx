import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import PaymentPage from "./pages/PaymentPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegistPage from "./pages/RegistPage";

const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

const App = () => {
  const today = formatDate(new Date());
  const [cart, setCart] = useState([]);

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

  const completePayment = () => {
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
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/paymant" element={<Navigate to="/payment" replace />} />
      </Route>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/signup" element={<RegistPage />}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
