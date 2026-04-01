import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Provider";
import { auth } from "../firebase.js"; 
import { signOut } from "firebase/auth";
import "../css/header.css";

const Header = () => {
  const handleLogout = async () => {
  await signOut(auth);
};

  const { user } = useContext(AuthContext);
  console.log(user);
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
            {user ? (
              <Link className="navLink" to="/payment">
                Мої оренди
              </Link>)
              : (
                <Link className="navLink" to="/login">
                  Мої оренди
                </Link>
              )}
            
          </li>
          <li>
            {user ? (
              <button className="logOutBtn" onClick={handleLogout}>
                Вийти
              </button>)
            : (
              <Link className="authBtn" to="/login">
                Увійти
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
