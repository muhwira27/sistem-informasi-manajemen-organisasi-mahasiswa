import React, { useEffect, useState } from 'react';
import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonSkeletonText,
  IonText
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { getDataById } from '../../firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';
import './NewsContentCard.css'

type Params = {
  id: string;
};

interface News {
  id: string,
  title: string,
  content: string,
  image_url: string,
  date: Timestamp,
}

const NewsContentCard: React.FC = () => {
  const { id } = useParams<Params>();
  const [newsContent, setNewsContent] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getDataById(id, 'news');
      setNewsContent(data);

    } catch (error) {
      console.log('Error when retriving content news: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDate = (timestamp: Timestamp | undefined) => {
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

  const getImageURL = (imageURL: string | undefined) => {
    if (imageURL) {
      const parts = imageURL.split("/");
      const idImageUrl = parts[5];
      return `https://drive.google.com/uc?export=view&id=${idImageUrl}`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <IonCard className='organization-details-skeleton ion-padding'>
        <div className='breadcrumbs-skeleton'>
          <IonSkeletonText animated style={{ width: '80px', height: '16px' }} />
          <span> {`>`} </span>
          <IonSkeletonText animated style={{ width: '100px', height: '16px' }} />
        </div>

        <div className='line'></div>

        <IonCardContent>
          {/* Logo Placeholder */}
          <div className='skeleton-logo'>
            <IonSkeletonText animated style={{ width: '70%', height: '16px', marginBottom: '20px' }} />
            <IonSkeletonText animated style={{ width: '170px', height: '170px' }} />
          </div>

          {/* Text Placeholders */}
          <div className='skeleton-text'>
            <IonSkeletonText animated style={{ width: '30%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '90%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '97%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '96%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '100%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '85%', height: '16px', marginBottom: '10px' }} />
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className='news-content ion-padding'>
      <IonBreadcrumbs mode='ios'>
        <IonBreadcrumb routerLink="/news">News</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/news/${newsContent?.id}`}>{newsContent?.title}</IonBreadcrumb>
      </IonBreadcrumbs>
      <div className='news-line'></div>
      <IonCardHeader>
        <IonCardTitle className='news-title'>{newsContent?.title}</IonCardTitle>
        <IonCardSubtitle>
          <IonIcon icon={timeOutline}></IonIcon>
          {getDate(newsContent?.date)}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonImg
        className='news-image'
        src={getImageURL(newsContent?.image_url)}
        alt={newsContent?.title}
      ></IonImg>
      <IonCardContent>
        <IonText className='news-content'>
          {newsContent?.content}
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default NewsContentCard;
