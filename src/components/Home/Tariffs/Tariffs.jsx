import React from "react";
import styles from "./Tariffs.module.scss";
import BeginnerImg from "../../../assets/img/main/Beginner.svg";
import ProImg from "../../../assets/img/main/pro.svg";
import BusinessImg from "../../../assets/img/main/business.svg";
import CheckIcon from "../../../assets/img/main/icons8-галочка-96 4.svg";
import store from "../../../stores/AuthStore";

const Tariffs = () => {
  const currentTariff = store.currentTariff;
  const isAuthenticated = store.checkAuth();  

  const tariffs = [
    {
      cardStyles: {
        headerColor: "#FFB64F",
        color: "#000000",
        border: isAuthenticated ? '2px solid' : '',
      },
      title: "Beginner",
      img: BeginnerImg,
      description: "Для небольшого исследования",
      price: "799 ₽",
      oldPrice: "1 200 ₽",
      installment: "или 150 ₽/мес. при рассрочке на 24 мес.",
      features: [
        "Безлимитная история запросов",
        "Безопасная сделка",
        "Поддержка 24/7",
      ],
      buttonText: isAuthenticated ? "Перейти в личный кабинет" : "Подробнее",
      isCurrent: currentTariff === "Beginner",
    },
    {
      cardStyles: {
        headerColor: "#7CE3E1",
        color: "#000000",
      },
      title: "Pro",
      img: ProImg,
      description: "Для HR и фрилансеров",
      price: "1 299 ₽",
      oldPrice: "2 600 ₽",
      installment: "или 279 ₽/мес. при рассрочке на 24 мес.",
      features: [
        "Все пункты тарифа Beginner",
        "Экспорт истории",
        "Рекомендации по приоритетам",
      ],
      buttonText: "Подробнее",
      isCurrent: currentTariff === "Pro",
    },
    {
      cardStyles: {
        headerColor: "#000000",
        color: "#FFFFFF",
      },
      title: "Business",
      img: BusinessImg,
      description: "Для корпоративных клиентов",
      price: "2 379 ₽",
      oldPrice: "3 700 ₽",
      installment: "",
      features: [
        "Все пункты тарифа Pro",
        "Безлимитное количество запросов",
        "Приоритетная поддержка",
      ],
      buttonText: "Подробнее",
      isCurrent: currentTariff === "Business",
    },
  ];

  return (
    <div id="tariff-container" className={styles["tariffs-container"]}>
      <div className={styles["header-of-tariffs"]}>
        <h1>Наши тарифы</h1>
      </div>
      <div className={styles["tariffs-list"]}>
        {tariffs.map((tariff, index) => (
          <div
            className={`${styles["tariff-card"]} ${
              tariff.isCurrent ? styles.current : ""
            }`}
            key={index}
            style={
              tariff.title === "Beginner" && isAuthenticated
                ? { border: `2px solid #FFB64F`, borderStyle: 'solid' }
                : {}
            }
          >
            <div
              className={styles["tariff-header"]}
              style={{
                backgroundColor: tariff.cardStyles.headerColor,
                color: tariff.cardStyles.color,
              }}
            >
              <div className={styles["header-content"]}>
                <div className={styles["text-container"]}>
                  <h3 className={styles["tariff-title"]}>{tariff.title}</h3>
                  <p className={styles["tariff-description"]}>
                    {tariff.description}
                  </p>
                </div>
                <img
                  src={tariff.img}
                  alt={tariff.title}
                  className={styles["header-image"]}
                />
              </div>
            </div>
            <div className={styles["content"]}>
              {tariff.isCurrent && (
                <p className={styles["current-tariff"]}>Текущий тариф</p>
              )}
              <p className={styles["price"]}>
                {tariff.price}{" "}
                <span className={styles["old-price"]}>{tariff.oldPrice}</span>
                <br />
                <span className={styles["installment"]}>
                  {tariff.installment ? tariff.installment : "\u00A0"}{" "}
                </span>
              </p>
              <p className={styles["content__title"]}>В тариф входит:</p>
              <ul>
                {tariff.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles["feature-item"]}>
                    <img
                      src={CheckIcon}
                      alt="галочка"
                      className={styles["check-icon"]}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`${styles["details-button"]} ${
                  isAuthenticated && tariff.title === "Beginner"
                    ? styles["current"]
                    : ""
                }`}
              >
                {isAuthenticated && tariff.title === "Beginner"
                  ? "Перейти в личный кабинет"
                  : tariff.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tariffs;