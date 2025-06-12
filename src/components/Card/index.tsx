import styles from "./index.module.css";
import { Button } from "../Button";
import type { News } from "../../models";

type Props = {
  onDeleteNews: (id: string) => void;
  onEditNews: (news: News) => void;
  news: News;
};

export const Card = ({ news, onEditNews, onDeleteNews }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>{news.title}</div>
      <div className={styles.cardName}>Автор: {news.name}</div>
      <p className={styles.cardInfo}>{news.news}</p>
      <div className={styles.buttons}>
        <Button color="blue" onClick={() => onEditNews(news)}>
          Изменить
        </Button>
        <Button color="red" onClick={() => onDeleteNews(news.id)}>
          Удалить
        </Button>
      </div>
    </div>
  );
};
