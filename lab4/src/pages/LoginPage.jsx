import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

import "../css/login.css"

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
          setError("Невірний email або пароль");
          break;

        case "auth/missing-password":
          setError("Заповніть всі поля");
          break;

        default:
          setError("Помилка входу");
      }
    }
  }

  return (
    <div className="container">
      <form onSubmit={login}>
        <div className="login-form">

          <div className="auth-header">
            <button type="button" className="back-btn" onClick={() => navigate("/")}>
              ←
            </button>

            <Link to="/" className="logo">
              RentSport
            </Link>
          </div>

          <h2>З поверненням, Увійти.</h2>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">
            Login <span>→</span>
          </button>

          <p className="auth-footer">
            Don't have an account?
            <Link to="/signup" className="signup-link">Sign up</Link>
          </p>

        </div>
      </form>
    </div>
  )
}

export default AuthPage