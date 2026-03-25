import { useNavigate } from "react-router-dom";
import "../css/notFoundPage.css"

const NotFound = () => {
  
  const navigate = useNavigate();

  return (
    <div className="notFound">
      <h1>404</h1>
      <p>Сторінку не знайдено</p>
      <button className="btn" onClick={() => navigate("/")}>
        Перейти на головну сторінку
      </button>
    </div>
  );
};

export default NotFound;