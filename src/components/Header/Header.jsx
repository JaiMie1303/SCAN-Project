import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import logoImg from "../../assets/img/main/SGN_09_24_2022_1663968217400 1.svg";
import ProfileIcon from "../../assets/img/main/profile-logo.svg";
import styles from "./Header.module.scss";
import store from "../../stores/AuthStore";
import Loader from "./Loader/Loader";
import BurgerMenu from "./BurgerMenu/BurgerMenu";

const Logo = () => (
  <Link to="/" className={styles["header__logo"]}>
    <img src={logoImg} alt="logotype" />
  </Link>
);

const Header = observer(() => {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await store.getUserData();
    };
    
    fetchData();
  }, []);

  const scrollToTariffs = (e) => {
    e.preventDefault();
    const section = document.getElementById("tariff-container");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigate = useNavigate();
  const login = localStorage.getItem("login");

  const handleLogout = () => {
    store.logout(); 
    navigate("/login"); 
  };

  return (
    <header className={styles["header"]}>
      <div className={styles["container"]}>
        <div className={styles["header__row"]}>
          <Logo />
          {!isBurgerMenuOpen && (
            <nav className={styles["header__nav"]}>
              <ul>
                <li>
                  <Link to="/">Главная</Link>
                </li>
                <li>
                  <Link to="#tariff-container" onClick={scrollToTariffs}>
                    Тарифы
                  </Link>
                </li>
                <li>
                  <Link to="/error">FAQ</Link>
                </li>
              </ul>
            </nav>
          )}
          <div className={`${styles["user-actions"]} ${isBurgerMenuOpen ? styles["hidden"] : ""}`}>
            {store.checkAuth() ? (
              <>
                <div className={styles["account-info"]}>
                  {store.loading ? (
                    <Loader />
                  ) : (
                    <>
                      <span>
                        <span className={styles.label}>Используемые компании </span>
                        <span className={styles["used-count"]}>
                          {store.userData?.eventFiltersInfo.usedCompanyCount || 0}
                        </span>
                      </span>
                      <span>
                        <span className={styles.label}>Лимит по компаниям </span>
                        <span className={styles["limit-count"]}>
                          {store.userData?.eventFiltersInfo.companyLimit || 0}
                        </span>
                      </span>
                    </>
                  )}
                </div>
                <div className={styles["user-info"]}>
                  <span className={styles["user-name"]}>{login}</span>
                  <button className={styles["logout-button"]} onClick={handleLogout}>
                    Выйти
                  </button>
                </div>
                <img className={styles["profile-img"]} src={ProfileIcon} alt="профиль" />
              </>
            ) : (
              <>
                <Link to="/error" className={styles["register-button"]}>
                  Зарегистрироваться
                </Link>
                <div className={styles["vertical-line"]}></div>
                <Link to="/login" className={styles["login-button"]}>
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <BurgerMenu onMenuToggle={setIsBurgerMenuOpen} />
    </header>
  );
});

export default Header;