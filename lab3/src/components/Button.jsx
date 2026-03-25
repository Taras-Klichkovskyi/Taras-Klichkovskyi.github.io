import { useState } from "react"

const Button = ({ isInCart, onAdd}) => {
  const [inHover, setInHover] = useState(false)

  const getText = () => {
    if(isInCart) {
      return inHover ? "Додати ще" : "У кошику"
    }
    return inHover ? "Додати в кошик" : "Орендувати"
  }

  return (
    <button className="btn small" 
      onClick={onAdd}
      onMouseEnter={() => setInHover(true)}
      onMouseLeave={() => setInHover(false)}
      style={{
        backgroundColor: isInCart ? "green" : "#244A8F"
      }}
      > 
      {getText()}
    </button>
  )
}

export default Button