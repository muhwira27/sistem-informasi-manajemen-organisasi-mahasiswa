import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { calendarOutline, createOutline, locationOutline, trashOutline } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
import { deleteData } from '../../firebase/firestoreService';
import EventForm from '../EventForm';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import "./EventCard.css";

interface Event {
  id: string;
  name: string;
  description: string;
  start_date: Timestamp;
  end_date: Timestamp;
  location: string;
}

interface EventCardProps {
  event: Event;
  organizationId: string;
  isAdmin: boolean;
  onEventChange: () => Promise<void>,
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isAdmin,
  onEventChange,
  organizationId
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isCharLimit, setIsCharLimit] = useState(true)
  const [truncatedDescription, setTruncatedDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    if (event.description.length > 220) {
      setIsCharLimit(true);
      setTruncatedDescription(event.description.substring(0, 220) + '...');
    } else {
      setIsCharLimit(false);
      setTruncatedDescription(event.description);
    }
  }, [event.description]);

  const handleEdit = () => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTime = (timestamp: { seconds: number; nanoseconds: number }): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const areDatesSame = (startTimestamp: Timestamp, endTimestamp: Timestamp): boolean => {
    const startDate = new Date(startTimestamp.seconds * 1000);
    const endDate = new Date(endTimestamp.seconds * 1000);

    return startDate.toDateString() === endDate.toDateString();
  };


  const renderDateEvent = (startTimestamp: Timestamp, endTimestamp: Timestamp) => {
    const startDate = formatDate(startTimestamp);
    const endDate = formatDate(endTimestamp);
    const endTime = formatTime(endTimestamp);

    if (areDatesSame(startTimestamp, endTimestamp)) {
      return (
        <IonItem lines='none' className='item-event'>
          <IonIcon icon={calendarOutline}></IonIcon>
          <IonLabel >
            <IonText className='item-event-label'>
              {`${startDate} - ${endTime}`}
            </IonText>
          </IonLabel>
        </IonItem>
      )
    } else {
      return (
        <div className='date-event'>
          <IonItem lines='none' className='item-event'>
            <IonIcon icon={calendarOutline}></IonIcon>
            <IonLabel>
              <IonText className='item-event-label'>{`Mulai: ${startDate}`}</IonText>
            </IonLabel>
          </IonItem>
          <IonItem lines='none' className='item-event'>
            <IonIcon icon={calendarOutline}></IonIcon>
            <IonLabel >
              <IonText className='item-event-label'>
                {`Selesai: ${endDate}`}
              </IonText>
            </IonLabel>
          </IonItem>
        </div>
      )
    }
  };

  const handleDelete = async () => {
    try {
      if (event) {
        await deleteData(event.id, `/organizations/${organizationId}/events`);
        await deleteData(event.id, 'event_list');

        await onEventChange();
      }
    } catch (error) {
      console.log('Error deleting event: ', error)
    }
  };

  return (
    <IonCard className='event'>
      <IonCardHeader className='header-event'>
        <IonCardTitle class='title-event'>{event.name}</IonCardTitle>
        {isAdmin && (
          <div className='actions-btn-event'>
            <IonIcon
              className='edit-event'
              icon={createOutline}
              onClick={handleEdit}
            ></IonIcon>
            <IonIcon
              className='delete-event'
              icon={trashOutline}
              onClick={() => setIsDelete(true)}
            ></IonIcon>
          </div>
        )}
      </IonCardHeader>
      <IonCardContent>
        {showFullDescription || !isCharLimit ? event.description : truncatedDescription}
        {isCharLimit && (
          <IonText
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? '     read less' : 'read more'}
          </IonText>
        )}
      </IonCardContent>
      <IonList>
        {renderDateEvent(event.start_date, event.end_date)}
        <IonItem lines='none'>
          <IonIcon icon={locationOutline}></IonIcon>
          <IonLabel>
            <IonText className='item-event-label'> {event.location}</IonText>
          </IonLabel>
        </IonItem>
      </IonList>

      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onEventAdded={onEventChange}
        organizationId={organizationId}
        editEvent={editingEvent}
      />

      <DeleteConfirm
        segment='Event'
        title={event.name}
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        handleDelete={handleDelete}
      />
    </IonCard>
  );
};

export default EventCard;
