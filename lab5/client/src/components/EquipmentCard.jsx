import Button from "./Button";

const EquipmentCard = ({ item, isInCart, onAdd }) => {
  return (
    <article className="product-card">
      <img src={item.img} alt={item.name} />
      <h3>{item.name}</h3>
      <p className="price">Ціна: {item.price} грн/день</p>
      <Button isInCart={isInCart} onAdd={onAdd} />
    </article>
  );
};

export default EquipmentCard;
