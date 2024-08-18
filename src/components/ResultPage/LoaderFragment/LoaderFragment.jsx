import React from 'react';
import LoaderImg from '../../../assets/img/dataSearch/loaderImg.svg';
import styles from './LoaderFragment.module.scss';

const LoaderFragment = ({ isLoading, resultCount }) => {
    return (
        <div className={styles['loader-fragment']}>
            <div className={styles['loader-text']}>
                {isLoading ? (
                    <>
                        <h1>Ищем. Скоро будут результаты</h1>
                        <p>Поиск может занять некоторое время</p>
                    </>
                ) : (
                    <>
                        <h1>Результаты поиска</h1>
                        <p>Найдены {resultCount} вариантов</p>
                    </>
                    
                )}
            </div>
            <img src={LoaderImg} className={styles['loader-img']} alt="загрузка" />
        </div>
    );
};

export default LoaderFragment;