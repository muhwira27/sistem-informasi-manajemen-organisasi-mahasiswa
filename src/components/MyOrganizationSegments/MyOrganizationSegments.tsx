import { IonCardHeader, IonCardTitle, IonImg, IonLabel, IonSegment, IonSegmentButton, SegmentValue, useIonRouter } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDataById } from '../../firebase/firestoreService';
import { createCookieItem, readCookieItems } from '../../utils/cookieFunctions';
import "./MyOrganizationSegments.css";

type Params = {
  id: string;
};

type Organization = {
  id: string;
  name?: string;
  logo_url?: string;
}

const MyOrganizationSegments: React.FC = () => {
  const { id } = useParams<Params>();
  const [currentTab, setCurrentTab] = useState<SegmentValue>("events");
  const [nameOrganization, setNameOrganization] = useState('');
  const [logoOrganization, setLogoOrganization] = useState('https://drive.google.com/thumbnail?id=1ha7CTzzKG5X6_SjfQHC408mRtgF-KdYj');
  const [prevId, setPrevId] = useState<string | null>(null);
  const router = useIonRouter();

  useEffect(() => {
    // Get the current path segment from the URL
    const pathSegments = router.routeInfo.pathname.split('/');
    const currentSegment = pathSegments[pathSegments.length - 1];

    // Update the currentTab state if it's different from the URL segment
    if (currentSegment && currentTab !== currentSegment) {
      setCurrentTab(currentSegment as SegmentValue);
    }
  }, [router.routeInfo.pathname, currentTab]);

  const handleTabChange = (value: SegmentValue | undefined) => {
    if (value && value !== currentTab) {
      setCurrentTab(value);
      router.push(`/my-organization/${id}/${value}`, 'none');
    }
  };

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (id !== prevId) {
        // Try retrieving data from cookies
        const organizationData = readCookieItems(`organization-${id}`);

        if (organizationData) {
          // Fetch data from cookies
          setNameOrganization(organizationData.name);
          setLogoOrganization(organizationData.logoUrl);
        } else {
          // Fetch data from Firebase
          const organization: Organization | null = await getDataById(id, 'organizations');

          const parts = organization?.logo_url?.split("/");
          const idLogoUrl = parts ? parts[5] : '';

          // Save data to state
          setNameOrganization(organization?.name || '');
          setLogoOrganization(`https://drive.google.com/thumbnail?id=${idLogoUrl}`);

          // Store data to cookies
          createCookieItem(`organization-${id}`, { name: organization?.name, logoUrl: `https://drive.google.com/thumbnail?id=${idLogoUrl}` });
        }

        setPrevId(id);
      }
    };

    fetchOrganizationData();
  }, [id, prevId]);


  return (
    <>
      <IonCardHeader className='org-header'>
        <IonImg className='org-logo' src={logoOrganization}></IonImg>
        <IonCardTitle className='org-name'>{nameOrganization}</IonCardTitle>
      </IonCardHeader>
      <IonSegment scrollable className='my-organization-segment' value={currentTab} onIonChange={e => handleTabChange(e.detail.value)}>
        <IonSegmentButton value="events">
          <IonLabel>Events</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="members">
          <IonLabel>Members</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="gallery">
          <IonLabel>Gallery</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="achievements">
          <IonLabel>Achievements</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <div className='segment-line'></div>
    </>
  );
};

export default MyOrganizationSegments;
