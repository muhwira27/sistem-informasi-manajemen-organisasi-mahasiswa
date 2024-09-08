import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import MyOrganizationSegments from '../../MyOrganizationSegments';
import MembersSegment from '../../MembersSegment';
import '../../../assets/css/index.css';
import './OrganizationMembersView.css';

const OrganizationMembersView: React.FC = () => {
  return (
    <IonPage>
      <Header title='My Organization' />
      <IonContent>
        <div className='container-content ion-padding'>
          <div className='organization-segment-container'>
            <MyOrganizationSegments />
            <div className='ion-padding'>
              <MembersSegment />
            </div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationMembersView;