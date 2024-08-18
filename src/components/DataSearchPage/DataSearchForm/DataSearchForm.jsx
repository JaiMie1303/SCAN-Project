import React, { useState, useEffect } from "react";
import styles from "./DataSearchForm.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import AuthStore from "../../../stores/AuthStore";
import { validateInn } from "../../../Utils/validators";

const DataSearchForm = () => {
  const [form, setForm] = useState({
    innCompany: "7714037217",
    limit: 1000,
    tonality: "any",
    documentsCount: "",
    startDate: null,
    endDate: null,
    maxRelevance: false,
    businessContext: false,
    mainRole: false,
    riskFactors: false,
    technicalNews: false,
    announcements: false,
    newsSummaries: false,
  });

  

  const [validationError, setValidationError] = useState("");
  const [dateRangeError, setDateRangeError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  

  const navigate = useNavigate();

  useEffect(() => {
    const { innCompany, documentsCount, startDate, endDate } = form;

    const areFieldsFilled =
      innCompany && documentsCount && startDate && endDate;

    // Проверка на валидность ИНН
    const error = {};
    const isInnValid = validateInn(innCompany, error);

    const now = new Date();
    let dateError = "";
    if (startDate > now || endDate > now) {
      dateError = "Даты не должны быть в будущем времени.";
    } else if (startDate && endDate && startDate > endDate) {
      dateError = "Дата начала поиска не может быть позже даты конца.";
    }
    setDateRangeError(dateError);

    setValidationError(isInnValid ? "" : error.message);
    setIsSubmitDisabled(!areFieldsFilled || !isInnValid || dateError !== "");
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "innCompany") {
      setValidationError("");
    }
  };

  const handleDateChange = (date, name) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedForm = {
      ...form,
      startDate: form.startDate ? form.startDate.toISOString() : null,
      endDate: form.endDate ? form.endDate.toISOString() : null,
    };

    // console.log("Данные формы перед отправкой:", cleanedForm);

    if (validationError || dateRangeError) {
      return;
    }

    if (!AuthStore.checkAuth()) {
      console.error(
        "Пользователь не авторизован. Запрос не может быть выполнен."
      );
      alert("Вы должны войти в систему, чтобы выполнить поиск.");
      return;
    }

    try {
      const response = await AuthStore.searchHistogram(cleanedForm);
      if (response) {
        // console.log("Результаты поиска:", response);
        navigate("/result-page", { state: { data: cleanedForm } });
      } else {
        console.error("Нет данных для отображения.");
      }
    } catch (error) {
      console.error("Ошибка при выполнении поиска:", error);
    }
  };

  return (
    <form className={styles["data-form"]} onSubmit={handleSubmit}>
      <div className={styles["form-fields"]}>
        <div className={styles.inputGroup}>
          <label htmlFor="innCompany" className={styles["name-label"]}>
            ИНН компании <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="innCompany"
            name="innCompany"
            placeholder="10 цифр"
            value={form.innCompany}
            onChange={handleChange}
            required
            className={`${styles["data-input"]} ${
              validationError ? styles["input-error"] : ""
            }`}
          />
          {validationError && (
            <p className={styles["error-message"]}>{validationError}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tonality" className={styles["name-label"]}>
            Тональность
          </label>
          <select
            id="tonality"
            name="tonality"
            value={form.tonality}
            onChange={handleChange}
            className={styles["data-select"]}
          >
            <option value="any">Любая</option>
            <option value="positive">Позитивная</option>
            <option value="negative">Негативная</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="documentsCount" className={styles["name-label"]}>
            Количество документов в выдаче{" "}
            <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="documentsCount"
            name="documentsCount"
            min="1"
            max="1000"
            placeholder="От 1 до 1000"
            value={form.documentsCount}
            onChange={handleChange}
            required
            className={styles["data-input"]}
          />
        </div>

        <div className={styles["input-dateGroup"]}>
      <p className={styles["name-label"]}>
        Диапазон поиска <span className={styles.required}>*</span>
      </p>
      <div className={styles["date-picker"]}>
        <DatePicker
          id="startDate"
          placeholderText="Дата начала"
          selectsStart
          required
          className={`${styles["data-input"]} ${styles["date-input"]} ${dateRangeError ? styles["input-error"] : ""}`}
          startDate={form.startDate}
          dateFormat="dd.MM.yyyy"
          selected={form.startDate}
          maxDate={form.endDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          fixedHeight
          showYearDropdown
        />
        <DatePicker
          id="endDate"
          placeholderText="Дата конца"
          selectsEnd
          required
          className={`${styles["data-input"]} ${styles["date-input"]} ${dateRangeError ? styles["input-error"] : ""}`}
          startDate={form.startDate}
          dateFormat="dd.MM.yyyy"
          selected={form.endDate}
          minDate={form.startDate}
          maxDate={new Date()}
          onChange={(date) => handleDateChange(date, "endDate")}
          fixedHeight
          showYearDropdown
        />
      </div>
      {dateRangeError && <p className={styles["error-message"]}>{dateRangeError}</p>}
    </div>
      </div>

      <div className={styles["options-group"]}>
        <div className="option-container"></div>
        <label
          className={`${styles["checkbox-label"]} ${
            form.maxRelevance ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="maxRelevance"
            checked={form.maxRelevance}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Признак максимальной полноты
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.businessContext ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="businessContext"
            checked={form.businessContext}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Упоминания в бизнес-контексте
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.mainRole ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="mainRole"
            checked={form.mainRole}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Главная роль в публикации
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.riskFactors ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="riskFactors"
            checked={form.riskFactors}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Публикации только с риск-факторами
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.technicalNews ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="technicalNews"
            checked={form.technicalNews}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Включать технические новости рынков
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.announcements ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="announcements"
            checked={form.announcements}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Включать анонсы и календари
        </label>
        <label
          className={`${styles["checkbox-label"]} ${
            form.newsSummaries ? styles["active"] : ""
          }`}
        >
          <input
            type="checkbox"
            name="newsSummaries"
            checked={form.newsSummaries}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Включать сводки новостей
        </label>
        <div className={styles["button-container"]}>
          <button
            type="submit"
            className={`${styles["search-button"]} ${
              !isSubmitDisabled ? styles["activeButton"] : ""
            }`}
            disabled={isSubmitDisabled}
          >
            Поиск
          </button>
          <p className={styles["required-message"]}>
            * Обязательные к заполнению поля
          </p>
        </div>
      </div>
    </form>
  );
};

export default DataSearchForm;
