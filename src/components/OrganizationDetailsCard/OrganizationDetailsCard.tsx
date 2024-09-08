import {
  IonBreadcrumb,
  IonBreadcrumbs,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonSkeletonText
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { arrowForwardOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { getAllData, getDataById } from '../../firebase/firestoreService';
import SocmedItem from '../SocmedItem';
import './OrganizationDetailsCard.css'

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

type Params = {
  id: string;
};

type Gallery = {
  image_urls: []
}

const OrganizationDetailsCard: React.FC = () => {
  const { id } = useParams<Params>();
  const [organizationData, setOrganizaztionData] = useState<Organization | null>(null);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [logo, setLogo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const organization = await getDataById(id, 'organizations');
      const achievement = await getAllData(`/organizations/${id}/achievements`);
      const gallery = await getAllData(`/organizations/${id}/gallery`);

      setGallery(gallery[0]);
      setAchievements(achievement);
      setOrganizaztionData(organization);
      if (organization) {
        const logoUrl = organization.logo_url;
        const parts = logoUrl.split("/");
        const idLogoUrl = parts[5];
        setLogo(`https://drive.google.com/thumbnail?id=${idLogoUrl}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [id])

  const getLogoURL = (logoURL: string) => {
    if (logoURL) {
      const parts = logoURL.split("/");
      const idLogoUrl = parts[5];
      return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
    }
  };

  if (isLoading) {
    return (
      <IonCard className='organization-details-skeleton ion-padding'>
        <div className='breadcrumbs-skeleton'>
          <IonSkeletonText animated style={{ width: '80px', height: '16px' }} />
          <span> {`>`} </span>
          <IonSkeletonText animated style={{ width: '100px', height: '16px' }} />
        </div>

        <div className='line'></div>

        <IonCardContent>
          {/* Logo Placeholder */}
          <div className='skeleton-logo'>
            <IonSkeletonText animated style={{ width: '170px', height: '170px', borderRadius: '50%' }} />
          </div>

          {/* Text Placeholders */}
          <div className='skeleton-text'>
            <IonSkeletonText animated style={{ width: '30%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '90%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '97%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '96%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '100%', height: '16px', marginBottom: '10px' }} />
            <IonSkeletonText animated style={{ width: '85%', height: '16px', marginBottom: '10px' }} />
          </div>

          {/* Gallery Placeholder */}
          <div className='skeleton-gallery'>
            <IonSkeletonText animated style={{ width: '100%', height: '100px' }} />
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className='organization-details ion-padding'>
      <IonBreadcrumbs mode='ios'>
        <IonBreadcrumb routerLink="/organizations">Organization List</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/organizations/${organizationData?.id}`}>{organizationData?.name}</IonBreadcrumb>
      </IonBreadcrumbs>

      <div className='line'></div>

      <IonImg className='org-detail-img' src={logo} alt={organizationData?.name}></IonImg>

      <IonCardContent className='organization-details-content ion-padding'>
        <IonCardTitle className='title-section'>About this Organization</IonCardTitle>
        <IonCardSubtitle className='content-section'>{organizationData?.description}</IonCardSubtitle>

        {/* CONTACT ORGANIZATION */}
        <IonCardTitle className='title-section'>Social Media</IonCardTitle>
        {organizationData?.socmed.instagram && <SocmedItem iconName="instagram" text={organizationData.socmed.instagram} />}
        {organizationData?.socmed.facebook && <SocmedItem iconName="facebook" text={organizationData.socmed.facebook} />}
        {organizationData?.socmed.youtube && <SocmedItem iconName="youtube" text={organizationData.socmed.youtube} />}
        {organizationData?.socmed.tiktok && <SocmedItem iconName="tiktok" text={organizationData.socmed.tiktok} />}
        {organizationData?.socmed.x && <SocmedItem iconName="x" text={organizationData.socmed.x} />}

        <div className='orgaization-subdetail ion-padding'>
          {/* Achievements Section */}
          <div className='organization-subdetail-header'>
            <IonCardHeader>Achievements</IonCardHeader>
            <IonBreadcrumb routerLink={`/organizations/${id}/achievement`} routerDirection='none'>View All<IonIcon icon={arrowForwardOutline}></IonIcon></IonBreadcrumb>
          </div>

          <div className='line'></div>

          <div className="organization-subdetail-achievements">
            {achievements?.slice(0, 4).map((achiev: Record<string, string>, index) =>
              <IonCard className='subdetail-achievement-card' key={index}>
                <IonImg className='subdetail-achievement-img' src={getLogoURL(achiev.image_url)} alt={achiev.title}></IonImg>
                <IonCardTitle className='subdetail-achievement-title'>{achiev.title}</IonCardTitle>
              </IonCard>
            )}
          </div>

          {/* Gallery Section */}
          <div className='organization-subdetail-header'>
            <IonCardHeader>Gallery</IonCardHeader>
            <IonBreadcrumb routerLink={`/organizations/${id}/gallery`} routerDirection='none'>View All<IonIcon icon={arrowForwardOutline}></IonIcon></IonBreadcrumb>
          </div>

          <div className='line'></div>

          <div className='organization-subdetail-gallery'>
            {gallery?.image_urls?.slice(0, 4).map((photo: string, index: number) =>
              <IonCard className='gallery-card' key={index}>
                <IonImg className='org-sub-gallery' src={getLogoURL(photo)} alt={`photo ${index}`}></IonImg>
              </IonCard>
            )}
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default OrganizationDetailsCard;
