import React from "react";
import styles from "./Footer.module.scss"; 
import footerIcon from '../../assets/img/main/footer-icon.svg';

const Footer = () => {
    return (
        <footer className={styles['footer']}>
            <div className={styles['footer-content']}>
                <div className={styles['footer-icon']}>
                    <img src={footerIcon} alt="footer-icon" />
                </div>
                <div className={styles['footer-text']}>
                    <p className={styles['footer-text-info']}>г. Москва, Цветной б-р, 40</p>
                    <p>+7 495 771 21 11</p>
                    <p>info@skan.ru</p>
                    <div className={styles['footer-rights']}>
                    <p>Copyright. 2022</p>
                </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;