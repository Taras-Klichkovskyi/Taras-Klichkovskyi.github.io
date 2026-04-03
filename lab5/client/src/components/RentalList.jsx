import RentalCard from "./RentalCard";

const RentalList = ({ title, description, count, rentals, status }) => {
  return (
    <section className="paymant-section">
      <div className="paymant-section-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="paymant-count">{count}</span>
      </div>

      {rentals.length > 0 ? (
        <div className="paymant-rentals">
          {rentals.map((rental) => (
            <RentalCard key={rental.rentalId} rental={rental} status={status} />
          ))}
        </div>
      ) : (
        <div className="paymant-empty">
          <h3>Поки що порожньо</h3>
          <p>Коли з&apos;являться оренди цього типу, вони будуть показані тут.</p>
        </div>
      )}
    </section>
  );
};

export default RentalList;
