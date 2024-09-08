import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import FormLogin from '../../FormLogin';

const LoginViews: React.FC = () => {

  return (
    <IonPage>
      <IonContent>
        <FormLogin />
      </IonContent>
    </IonPage>
  );
};

export default LoginViews;
