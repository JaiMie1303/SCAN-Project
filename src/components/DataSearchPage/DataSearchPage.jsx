import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthStore from '../../stores/AuthStore';
import DataSearchForm from './DataSearchForm/DataSearchForm';
import styles from './DataSearchPage.module.scss';
import DataSearchImg from '../../assets/img/dataSearch/Data-searchImg.svg';
import documentImg from '../../assets/img/dataSearch/Document.svg';
import foldersImg from '../../assets/img/dataSearch/Folders.svg';

const DataSearchPage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthStore.token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles['data-container']}>
      <h1 className={styles['info-header']}>Найдите необходимые<br /> данные в пару кликов.</h1>
      <p className={styles['info-content']}>Задайте параметры поиска.<br /> Чем больше заполните, тем точнее поиск</p>
        
      <div className={styles['search-form']}>
        <DataSearchForm />
        <div className={styles['images-container']}>
        <img src={documentImg} alt="Документ" className={styles['doc-image']} />
          <img src={foldersImg} alt="Папки" className={styles['folders-image']} />
          <img src={DataSearchImg} alt="Поиск" className={styles['data-image']} />
        </div>
      </div>
    </div>
  );
});

export default DataSearchPage;