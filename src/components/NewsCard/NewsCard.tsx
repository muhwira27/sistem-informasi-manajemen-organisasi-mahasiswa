import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonText
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { getAllData } from '../../firebase/firestoreService';
import './NewsCard.css'

interface News {
  id: string,
  title: string,
  content: string,
  image_url: string,
  date: Timestamp,
}

const NewsCard: React.FC = () => {
  const [newsList, setNewsList] = useState<News[] | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    if (shouldRefetch) {
      fetcNews();
    }
  }, [shouldRefetch]);

  const fetcNews = async () => {
    const data = await getAllData('news');
    setNewsList(data);
    setShouldRefetch(false);
  };

  const getImageURL = (imageURL: string) => {
    if (imageURL) {
      const parts = imageURL.split("/");
      const idImageUrl = parts[5];
      return `https://drive.google.com/thumbnail?id=${idImageUrl}`;
    }
    return '';
  };

  const getDate = (timestamp: Timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();

      // List of month names
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      // Gets day, month, and year from a date
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Create a date with the format "dd Month yyyy"
      const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

      return formattedDate;
    }
    return '';
  }

  return (
    <div className='container-news-card'>
      {newsList?.map((news, index) =>
        <IonCard
          key={index}
          className='news'
          routerLink={`/news/${news.id}`}
        >
          <div className='news-container'>
            <IonCardHeader className='news-header'>
              <IonCardTitle className='news-title'>{news.title}</IonCardTitle>
              <IonCardSubtitle className='news-desc'>{news.content}</IonCardSubtitle>
              <IonText class='news-date'>{getDate(news.date)}</IonText>
            </IonCardHeader>
            <IonImg className='news-img' src={getImageURL(news.image_url)} alt={news.title}></IonImg>
          </div>
        </IonCard>
      )}
    </div>
  );
};

export default NewsCard;
