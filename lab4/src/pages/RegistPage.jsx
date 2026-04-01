import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase.js";
import { doc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import "../css/signUp.css"

const RegistPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signUp(e) {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        createdAt: serverTimestamp()
      });

      navigate("/");
    } catch (err) {
      alert(err.message);
      switch (err.code) {
        case "auth/weak-password":
          setError("Пароль має бути більше 6 символів");
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
      <form onSubmit={signUp}>
        <div className="sigtUP-form">

          <div className="auth-header">
            <button className="back-btn" onClick={() => navigate("/")}>
              ←
            </button>

            <Link to="/" className="logo">
              RentSport
            </Link>
          </div>

          <h2 >Створіть аккаунт, щоб почати.</h2>
          <p className="auth-subtitle">Введіть свої дані, щоб створити акаунт і почати оренду обладнання.</p>
          <label>
            Name
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Taras Trymbulskyi" 
            />
          </label>
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

          <button className="sigtUP-btn" type="submit">
            Sign up <span>→</span>
          </button>

          <p className="auth-footer">
            Already have an account?
            <Link to="/login" className="login-link">Sign in</Link>
          </p>

        </div>
      </form>
    </div>
  )
}

export default RegistPage