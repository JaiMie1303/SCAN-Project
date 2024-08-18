import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import store from '../../../stores/AuthStore';
import styles from './BurgerMenu.module.scss';
import openBtn from '../../../assets/img/burger/openBtn.svg';
import closeBtn from '../../../assets/img/burger/closeBtn.svg';
import ProfileIcon from "../../../assets/img/main/profile-logo.svg";
import scanLogo from '../../../assets/img/main/footer-icon.svg';

const BurgerMenu = observer(({ scrollToTariffs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const login = localStorage.getItem('login');

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {!isMenuOpen ? (
        <button className={styles.burgerOpenButton} onClick={handleMenuToggle}>
          <img src={openBtn} alt="Open Menu" />
        </button>
      ) : (
        <div className={styles.burgerMenu} onClick={handleMenuToggle}>
          <div className={styles.burgerTop}>
            <img className={styles.burgerLogo} src={scanLogo} alt="Logo" />
            <button className={styles.burgerCloseButton} onClick={handleMenuToggle}>
              <img src={closeBtn} alt="Close Menu" />
            </button>
          </div>
          <nav className={styles.burgerNav} onClick={(e) => e.stopPropagation()}>
            <Link className={styles.burgerNavLink} to="/">Главная</Link>
            <a 
              className={styles.burgerNavLink} 
              href="#tariffs" 
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToTariffs && scrollToTariffs(); 
                handleMenuToggle(e); 
              }}
            >
              Тарифы
            </a>
            <Link className={styles.burgerNavLink} to="/error">FAQ</Link>
          </nav>
          {store.token ? (
            <div className={styles.userDetails}>
              <span className={styles.userName}>{login}</span>
              <img className={styles.userAvatar} src={ProfileIcon} alt="user avatar" />
              <button 
                className={styles.logoutButton} 
                onClick={(e) => {
                  store.logout(); 
                  handleMenuToggle(e); 
                }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className={styles.notSignedIn}>
              <Link className={styles.signupButton} to="/error">Зарегистрироваться</Link>
              <Link className={styles.signinButton} to="/login">Войти</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default BurgerMenu;