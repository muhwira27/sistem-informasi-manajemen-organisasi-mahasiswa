import { IonCard, IonContent, IonPage, } from '@ionic/react';
import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MyOrganizationSegments from '../../MyOrganizationSegments';
import GallerySegment from '../../GallerySegment';
import '../../../assets/css/index.css';
import './OrganizationGalleryView.css';

const OrganizationGalleryView: React.FC = () => {
  return (
    <IonPage>
      <Header title='My Organization' />
      <IonContent>
        <div className='container-content ion-padding'>
          <div className='organization-segment-container'>
            <MyOrganizationSegments />
            <GallerySegment />
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationGalleryView;