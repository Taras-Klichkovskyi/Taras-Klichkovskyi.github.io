import { useState } from "react";

import { equipment } from "../data/equipmentData.js";
import "../css/equipment.css";
import EquipmentCard from "./EquipmentCard";

const categoryLabels = {
  all: "Усе",
  football: "Футбол",
  tennis: "Теніс",
  winter: "Лижі та сноуборд",
  cycling: "Велоспорт",
  water: "Водний спорт",
  camping: "Кемпінг",
  fitness: "Фітнес",
};

const Equipment = ({ cart, addToCart }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...new Set(equipment.map((item) => item.category))];
  const filteredEquipment =
    activeCategory === "all"
      ? equipment
      : equipment.filter((item) => item.category === activeCategory);

  return (
    <section id="equipment" className="sections">
      <div className="sections-title">
        <h2 className="section-heading">Наявне обладнання</h2>
        <div className="line"></div>
      </div>

      <div className="equipment-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`equipment-filter-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {categoryLabels[category] ?? category}
          </button>
        ))}
      </div>

      <div className="equipment-grid">
        {filteredEquipment.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            isInCart={cart.some((cartItem) => cartItem.id === item.id)}
            onAdd={() => addToCart(item)}
          />
        ))}
      </div>
    </section>
  );
};

export default Equipment;
