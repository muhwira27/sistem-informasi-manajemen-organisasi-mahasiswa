import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import NewsCard from '../../NewsCard';
import '../../../assets/css/index.css';

const NewsView: React.FC = () => {

  return (
    <IonPage>
      <Header title='News' />
      <IonContent>
        <div className='container-content ion-padding'>
          <NewsCard />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default NewsView;
