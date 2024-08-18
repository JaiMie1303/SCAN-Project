import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.scss'; 
import errorPic from '../../assets/img/error/error.svg'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles['not-found']}>
      <img className={styles['error-pic']} src={errorPic} alt="страница не найдена" />
      <button className={styles['return-home-button']} onClick={() => navigate('/')}>Вернуться на главную</button>
    </div>
  );
};

export default NotFound;