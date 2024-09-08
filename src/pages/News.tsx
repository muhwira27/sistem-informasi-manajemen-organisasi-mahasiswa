import React, { useState } from 'react';
import { readCookieItems } from '../utils/cookieFunctions';
import { getDataById } from '../firebase/firestoreService';
import { useIonViewWillEnter } from '@ionic/react';
import NewsView from '../components/views/NewsView';
import AdminNewsView from '../components/views/Admin/AdminNewsView';

const News: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchData = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users')
      setIsAdmin(userData?.role === 1);
    }
  }

  useIonViewWillEnter(fetchData);

  return isAdmin ? <AdminNewsView /> : <NewsView />;
};

export default News;
