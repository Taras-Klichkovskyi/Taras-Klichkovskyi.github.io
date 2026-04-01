import { AuthContext } from "../Provider";
import { useContext } from "react";
import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("uk-UA");

const PaymentForm = ({ paymentData, totalPrice, onPaymentChange, onSubmit }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div className="cart-auth-prompt">
        <h4>Потрібен вхід</h4>
        <p>Увійдіть або зареєструйтеся, щоб оплатити оренду та зберегти її в історії вашого акаунта.</p>
        <Link className="cart-auth-link" to="/login">
          Увійти або створити акаунт.
        </Link>
      </div>
    )
  }
  return (
    <form className="payment-form" onSubmit={onSubmit}>
      <div className="payment-form-group">
        <label htmlFor="fullName">Ім&apos;я та прізвище</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Тарас Тримбульський"
          autoComplete="name"
          value={paymentData.fullName}
          onChange={onPaymentChange}
          required
        />
      </div>

      <div className="payment-form-grid">
        <div className="payment-form-group">
          <label htmlFor="phone">Телефон</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+380 67 123 45 67"
            autoComplete="tel"
            value={paymentData.phone}
            onChange={onPaymentChange}
            required
          />
        </div>

        <div className="payment-form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            value={paymentData.email}
            onChange={onPaymentChange}
            required
          />
        </div>
      </div>

      <div className="payment-card">
        <p className="payment-card-title">Банківська картка</p>

        <div className="payment-form-group">
          <label htmlFor="cardNumber">Номер картки</label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="1111 2222 3333 4444"
            autoComplete="cc-number"
            maxLength="19"
            value={paymentData.cardNumber}
            onChange={onPaymentChange}
            required
          />
        </div>

        <div className="payment-form-group">
          <label htmlFor="cardHolder">Власник картки</label>
          <input
            id="cardHolder"
            name="cardHolder"
            type="text"
            placeholder="Taras Trymbulskyi"
            autoComplete="cc-name"
            value={paymentData.cardHolder}
            onChange={onPaymentChange}
            required
          />
        </div>

        <div className="payment-form-grid payment-form-grid-small">
          <div className="payment-form-group">
            <label htmlFor="expiry">Термін дії</label>
            <input
              id="expiry"
              name="expiry"
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              autoComplete="cc-exp"
              maxLength="5"
              value={paymentData.expiry}
              onChange={onPaymentChange}
              required
            />
          </div>

          <div className="payment-form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              name="cvv"
              type="password"
              inputMode="numeric"
              placeholder="123"
              autoComplete="cc-csc"
              maxLength="3"
              value={paymentData.cvv}
              onChange={onPaymentChange}
              required
            />
          </div>
        </div>
      </div>

      <label className="payment-checkbox">
        <input
          type="checkbox"
          name="agreement"
          checked={paymentData.agreement}
          onChange={onPaymentChange}
          required
        />
        Підтверджую правильність даних та погоджуюсь з умовами оренди.
      </label>

      <button className="payment-submit" type="submit">
        Оплатити {currencyFormatter.format(totalPrice)} грн
      </button>
    </form>
  );
};

export default PaymentForm;
