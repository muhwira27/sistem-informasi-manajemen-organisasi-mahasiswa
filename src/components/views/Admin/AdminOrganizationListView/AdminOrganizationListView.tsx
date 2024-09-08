import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../../../Header';
import Footer from '../../../Footer';
import OrganizationsTable from '../../../Admin/OrganizationsTable';
import '../../../../assets/css/index.css';

const AdminOrganizationListView: React.FC = () => {
  return (
    <IonPage>
      <Header title='Organization List' />
      <IonContent>
        <div className='container-content ion-padding'>
          <OrganizationsTable />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AdminOrganizationListView;
