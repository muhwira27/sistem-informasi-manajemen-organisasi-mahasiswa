import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import Header from '../../../Header';
import Footer from '../../../Footer';
import UsersTable from '../../../Admin/UsersTable/UsersTable';

const UserListView: React.FC = () => {

  return (
    <IonPage>
      <Header title='User List' />
      <IonContent>
        <div className='container-content ion-padding'>
          <UsersTable />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default UserListView;