import "../css/footer.css"

const Footer = () => {
  return (
    <footer id="contact">
    <div class="footer-top">
      <section class="footer-column">
        <h2>RentSport</h2>
        <ul>
          <li><a href="#">Про нас</a></li>
          <li><a href="#">Контакти</a></li>
          <li><a href="#">Політика конфіденційності</a></li>
        </ul>
      </section>
      <section class="footer-column">
        <h2>Популярне</h2>
        <ul>
          <li><a href="#">Гірські велосипеди</a></li>
          <li><a href="#">Рюкзаки</a></li>
        </ul>
      </section>
      <section class="footer-column">
        <h2>Контакти</h2>
        <ul>
          <li><a href="tel:+380637742650">+380 63 774 2650</a></li>
          <li><a href="mailto:info@rentsport.ua">info@rentsport.ua</a></li>
          <li>
            <a href="https://www.google.com/maps/place/%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%A1%D1%82%D1%80%D0%B8%D0%B9%D1%81%D1%8C%D0%BA%D0%B0,+115%D0%B2,+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2,+%D0%9B%D1%8C%D0%B2%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C,+79000/@49.7856072,24.025108,19z/data=!3m1!4b1!4m6!3m5!1s0x473ae7d5c60624ff:0xc836543a1a46249d!8m2!3d49.7856072!4d24.0257517!16s%2Fg%2F11m6s24_77?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D">Львів, вул. Стрийська, 115В</a>
          </li>
        </ul>
      </section>
    </div>
    <div class="footer-bottom">
      <p>© 2026 RentSport. Усі права захищені.</p>
    </div>
  </footer>
  )
}

export default Footer;