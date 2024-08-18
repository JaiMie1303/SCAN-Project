import React from 'react';
import Slider from 'react-slick';
import LoaderImg from '../../../assets/img/dataSearch/loaderImg.svg';
import styles from './SummarySlider.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { observer } from 'mobx-react-lite';
import LoaderSlider from '../LoaderFragment/LoaderSlider';
import store from '../../../stores/AuthStore';

const SummarySlider = observer(({ totalDocumentsData = [], riskDataMap, isLoading }) => {
    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 8,
        slidesToScroll: 3,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const sortedTotalDocumentsData = Array.isArray(totalDocumentsData)
        ? [...totalDocumentsData].sort((a, b) => new Date(a.date) - new Date(b.date))
        : [];

    const totalCount = sortedTotalDocumentsData.reduce((sum, item) => sum + item.value, 0);

    const renderSlides = () => sortedTotalDocumentsData.map((item, index) => (
        <div key={index} className={styles['slide-data']}>
            <div className={styles['cell']}>{formatDate(item.date)}</div>
            <div className={styles['cell']}>{item.value}</div>
            <div className={styles['cell']}>{riskDataMap[item.date] || 0}</div>
        </div>
    ));

    return (
        <div>
            {store.isSummaryLoading ? (
                <div className="slider-loader">
                    <LoaderSlider />
                    <p className="loading-data">Загружаем данные</p>
                </div>
            ) : (
                <div className={styles['summarySlider']}>
                    <h2>Общая сводка</h2>
                    <p>Найдено {totalCount} вариантов</p>
                    <div className={styles['slider-container']}>
                        <div className={styles['header-cell']}>
                            <div className={styles['name-cell']}>Период</div>
                            <div className={styles['name-cell']}>Всего</div>
                            <div className={styles['name-cell']}>Риски</div>
                        </div>
                        {isLoading ? (
                            <div className={styles['loader-container']}>
                                <img src={LoaderImg} className={styles['loader-img']} alt="загрузка" />
                            </div>
                        ) : (
                            <Slider {...settings} className={styles['slider-data']}>
                                {renderSlides()}
                            </Slider>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default SummarySlider;