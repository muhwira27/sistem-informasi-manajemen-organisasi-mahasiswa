import { IonCard, IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header';
import GalleryCard from '../../GalleryCard';
import Footer from '../../Footer';

const GalleryView: React.FC = () => {

  return (
    <IonPage>
      <Header title='Gallery' />
      <IonContent>
        <div className='container-content ion-padding'>
          <IonCard className='organization-details ion-padding'>
            <GalleryCard />
          </IonCard>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default GalleryView;
