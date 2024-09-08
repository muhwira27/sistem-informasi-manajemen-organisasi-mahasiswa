import React, { useContext, useEffect, useState } from 'react';
import { IonButton, IonIcon, IonText } from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { getAllData, getDataById } from '../../firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { readCookieItems } from '../../utils/cookieFunctions';
import { AuthContext } from '../../context/authContext';
import EventCard from '../EventCard';
import EventForm from '../EventForm';
import "./EventsSegment.css";

type Params = {
  id: string;
};

interface Event {
  id: string
  name: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  location: string;
}

const EventsSegment: React.FC = () => {
  const { id } = useParams<Params>();
  const { currentUser } = useContext(AuthContext);
  const [eventList, setEventList] = useState<Event[]>([])
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    if (shouldRefetch) {
      fetchEvents();
      setShouldRefetch(false);
    }
  }, [id, currentUser, shouldRefetch]);

  useEffect(() => {
    verifyAdminStatus();
  }, [id, currentUser]);

  useEffect(() => {
    return () => {
      setEventList([]);
      setShouldRefetch(true);
      setIsAdmin(false);
    };
  }, [id]);

  const verifyAdminStatus = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users');
      const organization = userData?.organizations?.find((org: Record<string, string>) =>
        org.id === id
      );
      const role = organization ? organization.role : null;
      const adminRole = [
        'Ketua Umum',
        'Sekretaris',
      ]
      setIsAdmin(adminRole.includes(role));
    } else {
      setIsAdmin(false);
    }
    setShouldRefetch(false);
  };

  const fetchEvents = async () => {
    const data = await getAllData(`/organizations/${id}/events`);
    const sortedData = data.sort((a, b) => {
      const dateA = a.start_date.toDate();
      const dateB = b.start_date.toDate();
      return dateB - dateA;
    });

    setEventList(sortedData);
  };

  const handleAddEvent = () => {
    setIsFormOpen(true);
  };

  const onEventChange = async () => {
    setShouldRefetch(true);
  };

  return (
    <div className='events-segment ion-padding'>
      <div className='upcoming'>
        <IonText>Upcoming Event</IonText>
        {isAdmin &&
          <IonButton
            className='add-event'
            color={'medium'}
            onClick={handleAddEvent}
          >
            <IonIcon icon={addCircle}></IonIcon>
            &nbsp; Add &nbsp;
            <IonText className='add-event-text'>Event</IonText>
          </IonButton>
        }
      </div>
      {eventList?.map((event, index) =>
        <EventCard
          key={index}
          event={event}
          isAdmin={isAdmin}
          onEventChange={onEventChange}
          organizationId={id}
        />
      )}

      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onEventAdded={onEventChange}
        organizationId={id}
      />
    </div>
  );
};

export default EventsSegment;
