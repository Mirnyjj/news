import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type FormEventHandler,
} from "react";
import { Button } from "../Button";
import styles from "./index.module.css";
import type { News } from "../../models";

type Props = {
  setExit: React.Dispatch<React.SetStateAction<boolean>>;
  news?: News;
};

export const Form = ({ setExit: setAddNews, news }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const newsRef = useRef<HTMLTextAreaElement>(null);
  const [formError, setFormError] = useState(true);

  const validateForm = () => {
    const isTitleEmpty = !titleRef.current?.value.trim();
    const isNameEmpty = !nameRef.current?.value.trim();
    const isNewsEmpty = !newsRef.current?.value.trim();
    const error = isTitleEmpty || isNameEmpty || isNewsEmpty;
    setFormError(error);
    return error;
  };

  const handleInputChange = () => {
    validateForm();
  };

  useEffect(() => {
    // Заполнение формы при редактировании
    if (news) {
      if (titleRef.current) titleRef.current.value = news.title;
      if (nameRef.current) nameRef.current.value = news.name;
      if (newsRef.current) newsRef.current.value = news.news;
      validateForm();
    }

    // Автоподстройка высоты textarea
    const resizeTextarea = () => {
      if (newsRef.current) {
        newsRef.current.style.height = "auto";
        newsRef.current.style.height = `${newsRef.current.scrollHeight}px`;
      }
    };

    resizeTextarea();
    const currentRef = newsRef.current;
    currentRef?.addEventListener("input", resizeTextarea);

    return () => {
      currentRef?.removeEventListener("input", resizeTextarea);
    };
  }, [news]);

  // Обработчик формы

  const onSubmit: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) return; // Проверяем и сразу выходим при ошибке

    const formData: News = {
      id: news?.id || `${nameRef.current?.value}-${Math.random()}`,
      title: titleRef.current?.value.trim() || "",
      name: nameRef.current?.value.trim() || "",
      news: newsRef.current?.value.trim() || "",
    };

    const existingNews = localStorage.getItem("news");
    let updatedNews: News[] = [];

    if (existingNews) {
      updatedNews = JSON.parse(existingNews);

      // Если редактируем существующую новость - удаляем старую версию
      if (news) {
        updatedNews = updatedNews.filter((item) => item.id !== news.id);
      }
    }

    updatedNews.unshift(formData); // Добавляем новую новость в начало массива
    localStorage.setItem("news", JSON.stringify(updatedNews));

    formRef.current?.reset();
    setAddNews(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitleMessage}>
        Заполните форму для публикации новости
      </div>
      <form ref={formRef} onSubmit={onSubmit}>
        <input
          ref={titleRef}
          className={styles.inputForm}
          type="text"
          placeholder="Название"
          onChange={handleInputChange}
          required
        />

        <input
          ref={nameRef}
          className={styles.inputForm}
          type="text"
          placeholder="Имя"
          onChange={handleInputChange}
          required
        />

        <textarea
          ref={newsRef}
          rows={1}
          placeholder="Статья"
          onChange={handleInputChange}
          required
        />

        {formError && (
          <div className={styles.formErrorMessage}>
            Заполните все поля формы
          </div>
        )}

        <div className={styles.buttons}>
          <Button color="grey" onClick={() => setAddNews(false)}>
            Закрыть
          </Button>
          <Button disabled={formError} color="green">
            Опубликовать
          </Button>
        </div>
      </form>
    </div>
  );
};
