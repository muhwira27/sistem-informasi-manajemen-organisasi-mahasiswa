import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonText
} from '@ionic/react';
import './OrganizationCard.css';

interface Organization {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  socmed: Socmed;
}

interface Socmed {
  instagram: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
}

type OrganizationCardProps = {
  organization: Organization
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    const logoUrl = organization.logo_url;
    const parts = logoUrl.split("/");
    const idLogoUrl = parts[5];
    setLogo(`https://drive.google.com/thumbnail?id=${idLogoUrl}`);
  }, [organization])

  return (
    <>
      <IonCard className='organization ion-padding'>
        <IonImg className='organization-logo' src={logo} alt={organization.name}></IonImg>
        <IonCardHeader>
          <IonCardTitle title={organization.name}>{organization.name}</IonCardTitle>
          <IonCardSubtitle>{organization.description}</IonCardSubtitle>
        </IonCardHeader>
        <IonButton color='light' size='small' routerLink={`/organizations/${organization.id}`} >
          <IonText>
            See More ...
          </IonText>
        </IonButton>
      </IonCard>
    </>
  );
};

export default OrganizationCard;
