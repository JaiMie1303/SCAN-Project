import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import store from "../../../stores/AuthStore";
import styles from "./LoginPage.module.scss";
import googleIcon from "../../../assets/img/auth/google-icon.svg";
import fbIcon from "../../../assets/img/auth/fb-icon.svg";
import yaIcon from "../../../assets/img/auth/yandex-icon.svg";
import authImg from "../../../assets/img/auth/Characters.svg";
import lockIcon from "../../../assets/img/auth/lock.svg";

const LoginPage = observer(() => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonActive(login.trim() !== "" && password.trim() !== "");
  }, [login, password]);

  useEffect(() => {
    const handleResize = () => {
      const leftSideElement = document.querySelector(`.${styles["left-side"]}`);
      const lockIconElement = document.querySelector(`.${styles["lock-icon"]}`);
      const loginFormElement = document.querySelector(`.${styles["login-form"]}`);

      if (window.innerWidth <= 1057) {
        leftSideElement.appendChild(lockIconElement);
        leftSideElement.appendChild(loginFormElement);
      } else {
        leftSideElement.insertAdjacentElement('afterend', lockIconElement);
        lockIconElement.insertAdjacentElement('afterend', loginFormElement);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateForm = () => {
    let isValid = true;
    setLoginError("");
    setPasswordError("");

    if (!login.trim()) {
      setLoginError("Логин не может быть пустым");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Пароль не может быть пустым");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoginError(""); 
    setPasswordError("");

    await store.getToken(login, password); 

    if (store.token) {
      localStorage.setItem("login", login); 
      navigate("/"); 
    } else {
      setLoginError("Введите корректные данные.");
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["left-side"]}>
        <h2>Для оформления подписки на тариф необходимо авторизоваться.</h2>
        <img src={authImg} alt="Люди" className={styles["auth-image"]} />
      </div>
      <img src={lockIcon} alt="Замок" className={styles["lock-icon"]} />
      <div className={styles["login-form"]}>
        <form onSubmit={handleSubmit}>
          <div className={styles["buttons-wrapper"]}>
            <div>
              <button className={styles["submit-button"]}>Войти</button>
              <div className={styles["submit-line"]}></div>
            </div>
            <div>
              <Link to="/error" className={styles["register-button"]}>
                Зарегистрироваться
              </Link>
              <div className={styles["register-line"]}></div>
            </div>
          </div>
          <div>
            <label htmlFor="login" className={styles["user-login"]}>
              Логин или номер телефона:
            </label>
            <input
              type="text"
              id="login"
              className={`${styles["login-input"]} ${loginError ? styles.errorInput : ''}`}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            {loginError && (
              <div className={styles["error-message"]}>{loginError}</div>
            )}
          </div>
          <div>
            <label htmlFor="password" className={styles["user-password"]}>
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              className={`${styles["password-input"]} ${passwordError ? styles.errorInput : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <div className={styles["error-message"]}>{passwordError}</div>
            )}
          </div>
          <div
            className={`${styles["button-accept"]} ${
              isButtonActive ? styles.active : ""
            }`}
            onClick={isButtonActive ? handleSubmit : null}
            style={{ opacity: isButtonActive ? 1 : 0.4 }}
          >
            Войти
          </div>
        </form>
        <div className={styles["restore-password"]}>
          <button type="button" className={styles["restore-link-button"]}>
            Восстановить пароль
          </button>
        </div>
        <p className={styles["enter-social"]}>Войти через:</p>
        <div className={styles["social-login"]}>
          <button className={styles["social-icon"]}>
            <img src={googleIcon} alt="Войти через Google" />
          </button>
          <button className={styles["social-icon"]}>
            <img src={fbIcon} alt="Войти через Facebook" />
          </button>
          <button className={styles["social-icon"]}>
            <img src={yaIcon} alt="Войти через Yandex" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginPage;