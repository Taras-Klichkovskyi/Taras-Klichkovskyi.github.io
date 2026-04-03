import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import RentalList from "../components/RentalList";
import { AuthContext } from "../Provider";
import { equipment } from "../data/equipmentData";
import "../css/payment.css";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const currencyFormatter = new Intl.NumberFormat("uk-UA");
const equipmentById = new Map(equipment.map((item) => [String(item.id), item]));

const toDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }

  if (typeof value._seconds === "number") {
    return new Date(value._seconds * 1000);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatDate = (value, fallback = new Date()) => {
  const date = toDate(value) ?? fallback;

  return date.toLocaleDateString("en-CA");
};

const resolveRentalImage = (itemId) => {
  const equipmentItem = equipmentById.get(String(itemId));

  return equipmentItem?.img ?? "";
};

const getRentalDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);

  if (Number.isNaN(diff)) {
    return 1;
  }

  return Math.max(1, Math.floor(diff / DAY_IN_MS) + 1);
};

const getRentalStatus = (endDate) => {
  const today = new Date();
  const rentalEndDate = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  rentalEndDate.setHours(0, 0, 0, 0);

  if (Number.isNaN(rentalEndDate.getTime())) {
    return "active";
  }

  return rentalEndDate >= today ? "active" : "completed";
};

const normalizeRentalHistory = (orders = []) =>
  orders.flatMap((order, orderIndex) => {
    const paidAtFallback = toDate(order.createdAt) ?? new Date();

    return (order.items ?? []).map((item, index) => {
      const startDate = formatDate(item.startDate, paidAtFallback);
      const endDate = formatDate(item.endDate, toDate(startDate) ?? paidAtFallback);
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const days = getRentalDays(startDate, endDate);

      return {
        rentalId: `${order.id ?? orderIndex}-${item.id ?? index}-${index}`,
        id: item.id ?? `${order.id ?? orderIndex}-${index}`,
        category: item.category ?? "",
        img: resolveRentalImage(item.id),
        name: item.name ?? "Оренда",
        price,
        quantity,
        startDate,
        endDate,
        totalPrice: price * quantity * days,
        customerName: order.fullName ?? "",
        phone: order.phone ?? "",
        email: order.email ?? "",
        paymentLabel: order.paymentLabel ?? "Картка",
        paidAt: formatDate(order.createdAt, paidAtFallback),
      };
    });
  });

const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rentalHistory, setRentalHistory] = useState([]);
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const handlePriceFilterChange = ({ target }) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextValue = target.value.trim();

    if (nextValue) {
      nextParams.set(target.name, nextValue);
    } else {
      nextParams.delete(target.name);
    }

    setSearchParams(nextParams);
  };

useEffect(() => {
  let isMounted = true;

  const loadRentalHistory = async () => {
    if (!user) {
      setRentalHistory([]);
      return;
    }

    try {
      const token = await user.getIdToken();
      const requestParams = new URLSearchParams();

      if (minPrice) {
        requestParams.set("minPrice", minPrice);
      }

      if (maxPrice) {
        requestParams.set("maxPrice", maxPrice);
      }

      const requestUrl = requestParams.toString()
        ? `http://localhost:5000/api/payment?${requestParams.toString()}`
        : "http://localhost:5000/api/payment";

      const res = await fetch(requestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();

      if (!isMounted) {
        return;
      }

      setRentalHistory(normalizeRentalHistory(data));
    } catch (error) {
      console.error(error);

      if (isMounted) {
        setRentalHistory([]);
      }
    }
  };

  loadRentalHistory();

  return () => {
    isMounted = false;
  };
}, [user, minPrice, maxPrice]);


  const activeRentals = rentalHistory.filter(
    (rental) => getRentalStatus(rental.endDate) === "active"
  );
  const completedRentals = rentalHistory.filter(
    (rental) => getRentalStatus(rental.endDate) === "completed"
  );
  const totalRevenue = rentalHistory.reduce(
    (sum, rental) => sum + rental.totalPrice,
    0
  );

  return (
    <>
      <section className="paymant-page">
        <div className="paymant-hero">
          <div className="paymant-hero-copy">
            <p className="paymant-kicker">RentSport History</p>
            <h1>Історія оренди</h1>
            <p>
              Тут зберігаються активні бронювання та завершені оренди. Після
              натискання кнопки оплати товари автоматично зникають з кошика й
              переходять сюди.
            </p>
            <div className="paymant-filters">
              <label className="paymant-filter">
                <span>Мінімальна ціна</span>
                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  placeholder="Від"
                  value={minPrice ?? ""}
                  onChange={handlePriceFilterChange}
                />
              </label>
              <label className="paymant-filter">
                <span>Максимальна ціна</span>
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  placeholder="До"
                  value={maxPrice ?? ""}
                  onChange={handlePriceFilterChange}
                />
              </label>
            </div>
          </div>

          <div className="paymant-stats">
            <article>
              <span>Усього оренд</span>
              <strong>{rentalHistory.length}</strong>
            </article>
            <article>
              <span>Активні зараз</span>
              <strong>{activeRentals.length}</strong>
            </article>
            <article>
              <span>Завершені</span>
              <strong>{completedRentals.length}</strong>
            </article>
            <article>
              <span>На суму</span>
              <strong>{currencyFormatter.format(totalRevenue)} грн</strong>
            </article>
          </div>
        </div>

        <div className="paymant-layout">
          <RentalList
            title="Активні оренди"
            description="Замовлення, які ще тривають або завершаться пізніше."
            count={activeRentals.length}
            rentals={activeRentals}
            status="active"
          />

          <RentalList
            title="Архів оренд"
            description="Уже завершені оренди для швидкого перегляду історії."
            count={completedRentals.length}
            rentals={completedRentals}
            status="completed"
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PaymentPage;
