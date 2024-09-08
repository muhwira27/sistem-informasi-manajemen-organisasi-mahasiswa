import React from 'react';
import { IonContent, IonPage, IonIcon, IonCard, IonText } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import Header from '../../Header';
import Footer from '../../Footer';
import '../../../assets/css/index.css';
import './NotFoundView.css';

const NotFoundView: React.FC = () => {
  return (
    <IonPage>
      <Header title='Not Found' />
      <IonContent>
        <IonCard className='container-not-found ion-margin'>
          <IonText className='not-found-number'>404</IonText>
          <h2>Oops! Page not found</h2>
          <p>The page you are looking for might be in another galaxy.</p>
        </IonCard>
        <Footer />
      </IonContent>
    </IonPage >
  );
};

export default NotFoundView;
