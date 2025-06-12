import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Form } from "./components/Form";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import type { News } from "./models";

export default function App() {
  const storageKey = "news";
  const [newsArr, setNewsArr] = useState<News[]>([]);
  const [addNews, setAddNews] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [editNews, setEditNews] = useState<News | null>(null);

  const onEditNews = (news: News) => {
    setIsModal(true);
    setEditNews(news);
  };

  const onDeleteNews = (id: string) => {
    const filteredNews = newsArr.filter((news) => news.id !== id);
    setNewsArr(filteredNews);
    localStorage.setItem(storageKey, JSON.stringify(filteredNews));
  };

  useEffect(() => {
    const updateNews = () => {
      const newsFromStorage = localStorage.getItem(storageKey);
      setNewsArr(newsFromStorage ? JSON.parse(newsFromStorage) : []);
    };

    updateNews();
    window.addEventListener("storage", updateNews);

    return () => {
      window.removeEventListener("storage", updateNews);
    };
  }, [addNews, isModal]);

  return (
    <div className={styles.container}>
      <div className={styles.homePage}>
        {isModal && editNews && (
          <div className={styles.modal}>
            <div className={styles.container}>
              <div className={styles.homePage}>
                <Form setExit={setIsModal} news={editNews} />
              </div>
            </div>
          </div>
        )}
        {addNews && <Form setExit={setAddNews} />}
        {!addNews && !isModal && (
          <Button color="green" onClick={() => setAddNews(true)}>
            Добавить новость
          </Button>
        )}
        {newsArr.length === 0 ? (
          <div className={styles.title}>
            <p>Для вас пока нет новостей</p>
          </div>
        ) : (
          newsArr.map((item, key) => (
            <Card
              news={item}
              key={key}
              onEditNews={onEditNews}
              onDeleteNews={onDeleteNews}
            />
          ))
        )}
      </div>
    </div>
  );
}
