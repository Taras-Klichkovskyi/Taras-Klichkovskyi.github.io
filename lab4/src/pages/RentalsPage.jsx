import Footer from "../components/Footer";
import Rentals from "../components/Rentals";

const RentalsPage = ({
  cart,
  updateQuantity,
  startDate,
  endDate,
  removeFromCart,
  completePayment,
}) => {
  return (
    <>
      <Rentals
        cart={cart}
        updateQuantity={updateQuantity}
        startDate={startDate}
        endDate={endDate}
        removeFromCart={removeFromCart}
        completePayment={completePayment}
      />
      <Footer />
    </>
  );
};

export default RentalsPage;
