import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Header from '../../../Header';
import Footer from '../../../Footer';
import NewsTable from '../../../Admin/NewsTable';
import '../../../../assets/css/index.css';

const AdminNewsView: React.FC = () => {
  return (
    <IonPage>
      <Header title='News' />
      <IonContent>
        <div className='container-content ion-padding'>
          <NewsTable />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AdminNewsView;
