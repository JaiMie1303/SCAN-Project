import React from "react";
import AboutImg from "../../../assets/img/main/Group 14.svg";
import styles from "../About/About.module.scss";
import CustomSlider from "./CustomSlider/CustomSlider";

const About = () => {
  return (
    <div className={styles['image-text-container']}>
      <h1>Почему именно мы</h1>
        <div><CustomSlider /></div>
      <div className={styles['image-container']}>
        <img src={AboutImg} className={styles.img} alt="About" />
      </div>
    </div>
  );
};

export default About;