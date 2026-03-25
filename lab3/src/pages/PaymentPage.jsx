import Footer from "../components/Footer";
import RentalList from "../components/RentalList";
import "../css/payment.css";

const currencyFormatter = new Intl.NumberFormat("uk-UA");

const getRentalStatus = (endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(endDate) >= today ? "active" : "completed";
};

const sortByDate = (items, sortOrder) =>
  [...items].sort((left, right) => {
    const leftDate = new Date(left.endDate);
    const rightDate = new Date(right.endDate);

    return sortOrder === "asc" ? leftDate - rightDate : rightDate - leftDate;
  });

const PaymentPage = ({ rentalHistory = [] }) => {
  const activeRentals = sortByDate(
    rentalHistory.filter((rental) => getRentalStatus(rental.endDate) === "active"),
    "asc"
  );
  const completedRentals = sortByDate(
    rentalHistory.filter((rental) => getRentalStatus(rental.endDate) === "completed"),
    "desc"
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
