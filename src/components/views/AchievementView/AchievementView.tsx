import { IonCard, IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import AchievementCard from '../../AchievementCard';

const AchievementView: React.FC = () => {

  return (
    <IonPage>
      <Header title='Achievement' />
      <IonContent>
        <div className='container-content ion-padding'>
          <IonCard className='organization-details ion-padding'>
            <AchievementCard />
          </IonCard>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AchievementView;
