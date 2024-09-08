import { IonAvatar, IonCard, IonCardTitle, IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Footer.css'

const Footer: React.FC = () => {

  return (
    <IonFooter>
      <IonToolbar>
        <IonTitle>Copyright 2023 SISTEM INFORMASI MANAGEMENT ORGANISASI MAHASISWA</IonTitle>
      </IonToolbar>
    </IonFooter>
  );
};

export default Footer;