import { Link } from "react-router-dom";

import "../css/header.css";

const Header = () => {
  return (
    <header>
      <h1>
        <Link className="headerTitle" to="/">
          RentSport
        </Link>
      </h1>

      <nav>
        <ul>
          <li>
            <Link className="navLink" to="/">
              Обладнання
            </Link>
          </li>
          <li>
            <Link className="navLink" to="/rentals">
              Кошик
            </Link>
          </li>
          <li>
            <Link className="navLink" to="/payment">
              Мої оренди
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
