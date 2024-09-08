import { IonCard, IonContent, IonPage, } from '@ionic/react';
import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MyOrganizationSegments from '../../MyOrganizationSegments';
import AchievementsSegment from '../../AchievementsSegment';
import '../../../assets/css/index.css';

const OrganizationAchievementsView: React.FC = () => {
  return (
    <IonPage>
      <Header title='My Organization' />
      <IonContent>
        <div className='container-content ion-padding'>
          <div className='organization-segment-container'>
            <MyOrganizationSegments />
            <AchievementsSegment />
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationAchievementsView;