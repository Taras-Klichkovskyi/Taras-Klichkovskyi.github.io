const DAY_IN_MS = 1000 * 60 * 60 * 24;
const currencyFormatter = new Intl.NumberFormat("uk-UA");

const getRentalDays = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);

  if (Number.isNaN(diff)) {
    return 1;
  }

  return Math.max(1, Math.floor(diff / DAY_IN_MS) + 1);
};

const formatDateLabel = (date) =>
  new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const RentalCard = ({ rental, status }) => {
  const days = getRentalDays(rental.startDate, rental.endDate);

  return (
    <article className={`rental-card rental-card-${status}`}>
      <img src={rental.img} alt={rental.name} className="rental-card-image" />

      <div className="rental-card-content">
        <div className="rental-card-top">
          <div>
            <span className={`rental-badge rental-badge-${status}`}>
              {status === "active" ? "Активна оренда" : "Завершена оренда"}
            </span>
            <h3>{rental.name}</h3>
            <p className="rental-customer">{rental.customerName}</p>
          </div>

          <strong className="rental-total">
            {currencyFormatter.format(rental.totalPrice)} грн
          </strong>
        </div>

        <div className="rental-card-grid">
          <div>
            <span>Період</span>
            <strong>
              {formatDateLabel(rental.startDate)} - {formatDateLabel(rental.endDate)}
            </strong>
          </div>

          <div>
            <span>Тривалість</span>
            <strong>{days} дн.</strong>
          </div>

          <div>
            <span>Кількість</span>
            <strong>{rental.quantity} шт.</strong>
          </div>

          <div>
            <span>Оплата</span>
            <strong>{rental.paymentLabel}</strong>
          </div>
        </div>

        <div className="rental-card-footer">
          <span>{rental.phone}</span>
          <span>Оплачено: {formatDateLabel(rental.paidAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default RentalCard;
