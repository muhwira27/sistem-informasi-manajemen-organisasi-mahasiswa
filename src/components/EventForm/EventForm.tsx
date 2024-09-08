import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonModal, IonTextarea, IonText, useIonToast } from '@ionic/react';
import { close } from 'ionicons/icons';
import { createData, createDataWithCustomId, updateData } from '../../firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';
import './EventForm.css';

const initialState = {
  name: '',
  description: '',
  location: '',
};

const EventForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => Promise<void>,
  organizationId: string,
  editEvent?: any
}> = ({
  isOpen,
  onClose,
  onEventAdded,
  organizationId,
  editEvent
}) => {
    const [formData, setFormData] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    const [present] = useIonToast();

    useEffect(() => {
      if (editEvent) {
        setStartDate(convertTimestampToDate(editEvent.start_date));
        setStartTime(convertTimestampToTime(editEvent.start_date));
        setEndDate(convertTimestampToDate(editEvent.end_date));
        setEndTime(convertTimestampToTime(editEvent.end_date));

        setFormData({
          name: editEvent.name,
          location: editEvent.location,
          description: editEvent.description,
        });
        setIsEdit(true);
      } else {
        setFormData(initialState);
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setIsEdit(false);
      }
    }, [isOpen]);

    const convertTimestampToTime = (timestamp: Timestamp) => {
      const date = timestamp.toDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const convertTimestampToDate = (timestamp: Timestamp) => {
      if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate();
        return date.toISOString().split('T')[0];
      }
      return '';
    };

    const convertDateToTimestamp = (dateString: string) => {
      return Timestamp.fromDate(new Date(dateString));
    };

    const handleInputChange = (key: string, value: string) => {
      switch (key) {
        case 'startDate':
          setStartDate(value);
          break;
        case 'startTime':
          setStartTime(value);
          break;
        case 'endDate':
          setEndDate(value);
          break;
        case 'endTime':
          setEndTime(value);
          break;
        default:
          setFormData((prevData) => ({ ...prevData, [key]: value }));
      }
    };

    const combineDateTime = (date: string, time: string) => {
      return `${date}T${time}`;
    };

    const handleSubmit = async () => {
      if (!formData.name || !formData.location || !formData.description || !startDate || !startTime || !endDate || !endTime) {
        present({
          message: 'Please fill in all the fields',
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        return;
      };
      try {
        const startDateTimeISO = combineDateTime(startDate, startTime);
        const endDateTimeISO = combineDateTime(endDate, endTime);

        const eventData = {
          ...formData,
          start_date: convertDateToTimestamp(startDateTimeISO),
          end_date: convertDateToTimestamp(endDateTimeISO),
        };

        if (isEdit) {
          await updateData(editEvent.id, eventData, `/organizations/${organizationId}/events`);
          await updateData(editEvent.id, eventData, 'event_list');
        } else {
          const newEvent = await createData(eventData, `/organizations/${organizationId}/events`);
          await createDataWithCustomId(eventData, 'event_list', newEvent);
        }
        onClose();
        await onEventAdded();
      } catch (error) {
        console.error('Error adding/editing event:', error);
      }
    };

    return (
      <IonModal className='event-form' isOpen={isOpen} backdropDismiss={false}>
        <div className='event-form-header'>
          <IonText className='event-form-title'>{isEdit ? 'Edit Event' : 'Create New Event'}</IonText>
          <IonIcon className='event-form-close' icon={close} onClick={onClose}></IonIcon>
        </div>
        <IonContent className="event-form-content">
          <IonInput
            className='event-form-input'
            labelPlacement='stacked'
            label='Name'
            fill='outline'
            value={formData.name}
            required
            onIonChange={(e) => handleInputChange('name', e.detail.value!)}
          ></IonInput>
          <IonTextarea
            className='event-form-input'
            labelPlacement='stacked'
            label='Description'
            fill='outline'
            rows={5}
            value={formData.description}
            onIonChange={(e) => handleInputChange('description', e.detail.value!)}
          ></IonTextarea>
          <div className='event-form-input-datetime'>
            <IonInput
              className='event-form-input-date'
              labelPlacement='stacked'
              label='Start Date'
              fill='outline'
              type='date'
              value={startDate}
              onIonChange={(e) => handleInputChange('startDate', e.detail.value!)}
            ></IonInput>
            <IonInput
              className='event-form-input-time'
              labelPlacement='stacked'
              label='Start Time'
              fill='outline'
              type='time'
              value={startTime}
              onIonChange={(e) => handleInputChange('startTime', e.detail.value!)}
            ></IonInput>
          </div>
          <div className='event-form-input-datetime'>
            <IonInput
              className='event-form-input-date'
              labelPlacement='stacked'
              label='End Date'
              fill='outline'
              type='date'
              value={endDate}
              onIonChange={(e) => handleInputChange('endDate', e.detail.value!)}
            ></IonInput>
            <IonInput
              className='event-form-input-time'
              labelPlacement='stacked'
              label='End Time'
              fill='outline'
              type='time'
              value={endTime}
              onIonChange={(e) => handleInputChange('endTime', e.detail.value!)}
            ></IonInput>
          </div>
          <IonInput
            className='event-form-input'
            labelPlacement='stacked'
            label='Location'
            fill='outline'
            value={formData.location}
            required
            onIonChange={(e) => handleInputChange('location', e.detail.value!)}
          ></IonInput>
        </IonContent>
        <IonButton className='event-form-submit' color={'medium'} onClick={handleSubmit}>
          {isEdit ? 'Update Event' : 'Create Event'}
        </IonButton>
      </IonModal >
    );
  };

export default EventForm;
