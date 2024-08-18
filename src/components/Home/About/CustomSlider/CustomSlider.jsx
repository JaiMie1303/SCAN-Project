import React from "react";
import Slider from "react-slick";
import styles from "./CustomSlider.module.scss"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import IconSlider from "../../../../assets/img/main/Mask group.svg";
import IconSlider2 from "../../../../assets/img/main/Mask group2.svg";
import IconSlider3 from "../../../../assets/img/main/Mask group3.svg";
import IconSlider4 from "../../../../assets/img/main/Mask group4.svg";
import ChevronRight from '../../../../assets/img/main/icons8.svg';
import ChevronLeft from '../../../../assets/img/main/icons8-2.svg'


const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} ${styles.arrow}`} 
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <img src={ChevronLeft} className={styles['img-chevron']} alt="Next" />
      </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} ${styles.arrow}`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <img src={ChevronRight} className={styles['img-chevron']} alt="Previous" />
      </div>
    );
};

export default function CustomSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />, 
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 870,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderContent = [
    {
      text: "Высокая и оперативная скорость обработки заявки",
      image: IconSlider,
    },
    {
      text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
      image: IconSlider2,
    },
    {
      text: "Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству",
      image: IconSlider3,
    },
    {
      text: "Моментальный результат, точные ответы и максимальная безопасность",
      image: IconSlider4,
    },
  ];

  return (
    <div className={styles['slider-container']}>
      <div className={styles['slider-content']}>
      <Slider {...settings}>
        {sliderContent.map((item, index) => (
          <div className={styles['slider-item']} key={index}>
            <img src={item.image} alt={`Слайд ${index + 1}`} />
            <p className={styles['slider-info']}>{item.text}</p>
          </div>
        ))}
      </Slider>
      </div>
      
    </div>
  );
}