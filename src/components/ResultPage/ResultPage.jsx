import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoaderFragment from "./LoaderFragment/LoaderFragment";
import SummarySlider from "./SummarySlider/SummarySlider";
import LoaderSlider from '../ResultPage/LoaderFragment/LoaderFragment'; 
import styles from "./ResultPage.module.scss";
import store from "../../stores/AuthStore";
import defaultImg from "../../assets/img/dataSearch/defaultImg.svg";

const parseXMLContent = (xmlString) => {
  if (!xmlString || typeof xmlString !== "string") {
    console.error("Неверный формат XML-данных");
    return "";
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const parserError = xmlDoc.getElementsByTagName("parsererror");
  if (parserError.length > 0) {
    console.error("Ошибка парсинга XML:", parserError[0].textContent);
    return "";
  }

  const sentences = xmlDoc.getElementsByTagName("sentence");
  const content = Array.from(sentences).map((sentence) => sentence.textContent);
  return content.join(" ");
};

const extractImage = (xmlString) => {
  if (!xmlString || typeof xmlString !== "string") {
    return null;
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const imgTag = xmlDoc.querySelector("img");
  if (imgTag) {
    return imgTag.getAttribute("src");
  }

  return null;
};

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const countWords = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

const ResultPage = () => {
  const location = useLocation();
  const itemsPerPage = 2;
  const [loading, setLoading] = useState(true);
  const [histogramData, setHistogramData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [visibleDocuments, setVisibleDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (location.state && location.state.data) {
      
      setTimeout(() => {
        fetchData(location.state.data);
      }, 2000); 
    } else {
      setError("Нет данных для отображения");
      setLoading(false);
    }
  }, [location.state]);

  const fetchData = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const documentData = await store.searchDocuments(formData);
      const histogramResult = await store.searchHistogram(formData);

      setLoading(false);

      if (documentData && documentData.length > 0 && histogramResult) {
        const parsedDocuments = documentData.map((doc) => ({
          ...doc,
          content: parseXMLContent(doc.ok?.content?.markup),
          image: extractImage(doc.ok?.content?.markup) || defaultImg,
        }));
        setDocuments(parsedDocuments);
        setVisibleDocuments(parsedDocuments.slice(0, itemsPerPage));
        setHistogramData(histogramResult.data);
      } else {
        setError("Не удалось загрузить данные или документы");
      }
    } catch (err) {
      setError("Произошла ошибка при загрузке данных: " + err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  const renderTags = (attributes) => {
    if (!attributes) return null;

    const tags = [];
    if (attributes.isTechNews) {
      tags.push(
        <span key="tech-news" className={styles.tag}>
          Технические новости
        </span>
      );
    }
    if (attributes.isAnnouncement) {
      tags.push(
        <span key="announcement" className={styles.tag}>
          Анонсы и события
        </span>
      );
    }
    if (attributes.isDigest) {
      tags.push(
        <span key="digest" className={styles.tag}>
          Сводки новостей
        </span>
      );
    }
    return tags.length ? tags : <span>No Tags</span>;
  };

  const loadMoreDocuments = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    setVisibleDocuments(documents.slice(0, startIndex + itemsPerPage));
    setCurrentPage(nextPage);
  };

  if (loading) {
    return <LoaderFragment isLoading={true} />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles["result-page"]}>
      <LoaderFragment isLoading={false} resultCount={documents.length} />
      <div className={styles['slider-container']}>
        <SummarySlider
          totalDocumentsData={
            histogramData.filter(
              (item) => item.histogramType === "totalDocuments"
            )[0]?.data || []
          }
          riskDataMap={
            histogramData
              .filter((item) => item.histogramType === "riskFactors")[0]
              ?.data.reduce((acc, item) => {
                acc[item.date] = item.value;
                return acc;
              }, {}) || {}
          }
          isLoading={loading} 
        />
        {loading && <LoaderSlider />}
      </div>
      <div className={styles["document-wrapper"]}>
        <h2>Список документов</h2>
        <div className={styles["documents-list"]}>
          {visibleDocuments && visibleDocuments.length > 0 ? (
            visibleDocuments.map((document, index) => (
              <div key={index} className={styles.document}>
                <div className={styles["date-source"]}>
                  <p>{formatDate(document.ok?.issueDate)}</p>
                  <p className={styles["source-info"]}>
                    {document.ok?.source?.name || "Неизвестен"}
                  </p>
                </div>

                <h3 className={styles["header-title"]}>
                  {truncateText(document.ok?.title?.text, 70) ||
                    "Нет заголовка"}
                </h3>
                <div className={styles["header-tags"]}>
                  {renderTags(document.ok?.attributes)}
                </div>
                <img
                  src={document.image}
                  alt="Document"
                  className={styles["document-image"]}
                />
                <div
                  className={styles["content"]}
                  dangerouslySetInnerHTML={{
                    __html: truncateText(document.content, 600),
                  }}
                ></div>
                <div className={styles["card-footer"]}>
                  <a
                    href={document.ok?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["source-link"]}
                  >
                    Читать в источнике
                  </a>
                  <span className={styles.wordCount}>
                    {countWords(document.content)} слов
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>Документы не найдены.</p>
          )}
        </div>
        {currentPage * itemsPerPage < documents.length && (
          <button onClick={loadMoreDocuments} className={styles.loadMoreButton}>
            Показать больше
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;