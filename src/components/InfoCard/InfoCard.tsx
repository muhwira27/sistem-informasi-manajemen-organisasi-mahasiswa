import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getCollectionSize } from '../../firebase/firestoreService';
import './InfoCard.css'

const InfoCard: React.FC = () => {
  const [numberOfOrganizations, setNumberOfOrganizations] = useState<number | null>(null);
  const [numberOfMembersActive, setNumberOfMembersActive] = useState<number | null>(null);
  const [numberOfAchievements, setNumberOfAchievements] = useState<number | null>(null);

  const fethData = async () => {
    const organizations = await getCollectionSize('organizations');
    const members = await getCollectionSize('member_list');
    const achievements = await getCollectionSize('achievement_list');

    
    setNumberOfOrganizations(organizations);
    setNumberOfMembersActive(members);
    setNumberOfAchievements(achievements);
  };

  useEffect(() => {
    fethData();
  }, [])

  return (
    <div className='container-info-card'>
      <IonCard className='info' color='primary'>
        <IonCardHeader>
          <IonCardTitle className='info-title'>Organisasi Aktif</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className='info-content'>{numberOfOrganizations}</IonCardContent>
      </IonCard>

      <IonCard className='info' color='success'>
        <IonCardHeader>
          <IonCardTitle className='info-title'>Anggota Aktif</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className='info-content'>{numberOfMembersActive}</IonCardContent>
      </IonCard>

      <IonCard className='info' color='danger'>
        <IonCardHeader>
          <IonCardTitle className='info-title'>Prestasi</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className='info-content'>{numberOfAchievements}</IonCardContent>
      </IonCard>
    </div>
  );
};

export default InfoCard;
