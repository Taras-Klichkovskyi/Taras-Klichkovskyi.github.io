import Banner from "../components/Banner"
import Equipment from "../components/Equipment"
import Footer from "../components/Footer"

const HomePage = ({cart, addToCart}) => {
  return (
    <>
      <Banner />
      <Equipment cart={cart} addToCart={addToCart} />
      <Footer />
    </>
  )
}

export default HomePage