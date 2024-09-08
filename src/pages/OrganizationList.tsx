import React, { useState } from 'react';
import OrganizationListView from '../components/views/OrganizationListView';
import AdminOrganizationListView from '../components/views/Admin/AdminOrganizationListView';
import { readCookieItems } from '../utils/cookieFunctions';
import { getDataById } from '../firebase/firestoreService';
import { useIonViewWillEnter } from '@ionic/react';

const OrganizationList: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchData = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users')
      setIsAdmin(userData?.role === 1);
    }
  };

  useIonViewWillEnter(fetchData);

  return isAdmin ? <AdminOrganizationListView /> : <OrganizationListView />;
};

export default OrganizationList;
