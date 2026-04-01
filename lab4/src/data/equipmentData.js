import bike from "../images/bike.png";
import kayak from "../images/kayak.png";
import tent from "../images/tent.png";
import snowboard from "../images/snowboard.png";

import boots from "../images/boots.png";
import box from "../images/box.png";
import skiSuit from "../images/ski-suit.png";
import soccerBall from "../images/soccer-ball.png";
import tennisBalls from "../images/tennis-balls.png";
import tennisRacket from "../images/tennis-racket-and-ball.png";



export const equipment = [
  { id: 1, category: "cycling", img: bike, name: "Гірський велосипед", price: 250 },
  { id: 2, category: "water", img: kayak, name: "Каяк", price: 400 },
  { id: 3, category: "camping", img: tent, name: "Намет", price: 200 },
  { id: 4, category: "winter", img: snowboard, name: "Сноуборд", price: 300 },
  { id: 5, category: "winter", img: skiSuit, name: "Лижний костюм", price: 250 },
  { id: 6, category: "fitness", img: box, name: "Боксерські рукавиці", price: 120 },
  { id: 7, category: "football", img: soccerBall, name: "Футбольний м'яч", price: 80 },
  { id: 8, category: "tennis", img: tennisBalls, name: "Тенісні м'ячі", price: 60 },
  { id: 9, category: "tennis", img: tennisRacket, name: "Тенісна ракетка", price: 120 },
  { id: 10, category: "football", img: boots, name: "Бутси", price: 150 },
];