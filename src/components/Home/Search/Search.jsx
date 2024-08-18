import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from 'react-router-dom';
import SearchImg from '../../../assets/img/main/Group 13.svg';
import styles from '../Search/Search.module.scss';
import store from '../../../stores/AuthStore'; 

const Search = observer(() => { 
    return (
      <div className={styles['search-container']}>
        <div className={styles['search-content']}>
          <div className={styles['text-container']}>
            <h2>СЕРВИС ПО ПОИСКУ ПУБЛИКАЦИЙ <br /> О КОМПАНИИ <br /> ПО ЕГО ИНН</h2>
            <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
            <Link to={store.checkAuth() ? "/data-search" : "/login"} className={styles['button-search']}>
              {store.checkAuth() ? "Запросить данные" : "Войти"} 
            </Link>
          </div>
          <div className={styles['image-container']}>
            <img src={SearchImg} alt="Изображение" />
          </div>
        </div>
      </div>
    );
});

export default Search;