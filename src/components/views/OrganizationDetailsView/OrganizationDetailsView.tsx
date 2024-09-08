import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import OrganizationDetailsCard from '../../OrganizationDetailsCard';

const OrganizationDetailsView: React.FC = () => {

  return (
    <IonPage>
      <Header title='Organization Details' />
      <IonContent>
        <div className='container-content-organization-details ion-padding'>
          <OrganizationDetailsCard />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationDetailsView;
