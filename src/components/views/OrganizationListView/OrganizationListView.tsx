import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonPage,
  IonSearchbar
} from '@ionic/react';
import Header from '../../Header';
import Footer from '../../Footer';
import OrganizationCard from '../../OrganizationCard';
import { getAllData } from '../../../firebase/firestoreService';
import '../../../assets/css/index.css';
import './OrganizationListView.css';

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

const OrganizationListView: React.FC = () => {
  const [organizationList, setOrganizationList] = useState<Organization[] | null>(null);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[] | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredData = organizationList?.filter(org =>
      org.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOrganizations(filteredData);
  };

  const fetchOrganizations = async () => {
    const data = await getAllData('organizations');
    setOrganizationList(data);
    setFilteredOrganizations(data);
    setShouldRefetch(false);
  };

  useEffect(() => {
    if (shouldRefetch) {
      fetchOrganizations();
    }
  }, [shouldRefetch]);

  return (
    <IonPage>
      <Header title='Organization List' />
      <IonContent>
        <div className='container-content ion-padding'>
          <IonCard className='organization-list'>
            <IonCardHeader className='organization-list-header'>
              <IonCardSubtitle className='organization-list-description'>
                Selamat datang di Organization List. Anda dapat  mengakses ke beragam organisasi yang aktif
                di kampus kami. Dengan alat pencarian dan direktori kami, Anda dapat dengan mudah menjelajahi
                dan menemukan organisasi yang sesuai dengan minat dan aspirasi Anda.
              </IonCardSubtitle>
            </IonCardHeader>
            <IonSearchbar
              className='organization-list-search'
              value={searchText}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              autocomplete='off'
            ></IonSearchbar>
            <div className='container-organization-card'>
              {filteredOrganizations?.map((organization, index) => (
                <OrganizationCard key={organization.id} organization={organization} />
              ))}
            </div>
          </IonCard>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationListView;
