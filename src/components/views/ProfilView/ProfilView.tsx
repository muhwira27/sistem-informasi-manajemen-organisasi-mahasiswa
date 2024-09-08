import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import Biodata from '../../Biodata';
import '../../../assets/css/index.css';

const ProfilView: React.FC = () => {

  return (
    <IonPage>
      <Header title='Profile' />
      <IonContent>
        <div className='container-content ion-padding'>
          <Biodata />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default ProfilView;
