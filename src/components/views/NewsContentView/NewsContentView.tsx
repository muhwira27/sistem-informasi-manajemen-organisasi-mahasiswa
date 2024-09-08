import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import NewsContentCard from '../../NewsContentCard';
import '../../../assets/css/index.css';

const NewsContentView: React.FC = () => {

  return (
    <IonPage>
      <Header title='News' />
      <IonContent>
        <div className='container-conten ion-padding'>
          <NewsContentCard />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default NewsContentView;
