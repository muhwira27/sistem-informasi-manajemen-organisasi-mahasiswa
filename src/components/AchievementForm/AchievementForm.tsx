import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonModal,
  IonTextarea,
  IonText,
  IonImg,
  useIonToast
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
import './AchievementForm.css';
import { createData, createDataWithCustomId, updateData } from '../../firebase/firestoreService';

const initialAchievementState = {
  title: '',
  description: '',
  image_url: '',
};

const AchievementForm: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onAchievementAdded: () => Promise<void>,
  editAchievement?: any,
  organizationId: string,
}> = ({
  isOpen,
  onClose,
  onAchievementAdded,
  editAchievement,
  organizationId,
}) => {
    const [formData, setFormData] = useState(initialAchievementState);
    const [imagePreview, setImagePreview] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [date, setDate] = useState('');
    const [present] = useIonToast();

    useEffect(() => {
      if (editAchievement) {
        setDate(convertTimestampToDate(editAchievement.date));
        setFormData({
          title: editAchievement.title,
          description: editAchievement.description,
          image_url: editAchievement.image_url
        });
        setIsEdit(true);
        const imageUrl = editAchievement.image_url;
        const parts = imageUrl.split("/");
        const idImageUrl = parts[5];
        setImagePreview(`https://drive.google.com/thumbnail?id=${idImageUrl}`);
      } else {
        setFormData(initialAchievementState);
        setDate('');
        setImagePreview('');
        setIsEdit(false);
      }
    }, [isOpen]);

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
        case 'date':
          setDate(value);
          break;
        case 'image_url':
          const parts = value.split("/");
          const idImageUrl = parts[5];
          setImagePreview(`https://drive.google.com/uc?export=view&id=${idImageUrl}`);
        default:
          setFormData((prevData) => ({ ...prevData, [key]: value }));
      }
    };

    const handleSubmit = async () => {
      if (!formData.title || !formData.image_url || !formData.description || !date) {
        present({
          message: 'Please fill in all the required fields (Title, Image URL, Description, and Date)',
          duration: 5000,
          position: 'top',
          color: 'danger',
        });
        return;
      };

      try {
        const achievementData = {
          ...formData,
          date: convertDateToTimestamp(date)
        };

        if (isEdit) {
          await updateData(editAchievement.id, achievementData, `/organizations/${organizationId}/achievements`);
          await updateData(editAchievement.id, achievementData, 'achievement_list');
        } else {
          const newAchievement = await createData(achievementData, `/organizations/${organizationId}/achievements`);
          await createDataWithCustomId(achievementData, 'achievement_list', newAchievement);
        }
        onClose();
        setDate('');
        await onAchievementAdded();
      } catch (error) {
        console.error('Error adding/editing achievement:', error);
      }
    };

    return (
      <IonModal className='achievement-form' isOpen={isOpen} backdropDismiss={false}>
        <div className='achievement-form-header'>
          <IonText className='achievement-form-title'>{isEdit ? 'Edit Achievement' : 'Add New Achievement'}</IonText>
          <IonIcon className='achievement-form-close' icon={close} onClick={() => { onClose(); setImagePreview('') }}></IonIcon>
        </div>
        <IonContent className="achievement-form-content">
          <IonInput
            className='achievement-form-input'
            labelPlacement='stacked'
            label='Title'
            fill='outline'
            value={formData.title}
            onIonChange={e => handleInputChange('title', e.detail.value!)}
          ></IonInput>
          <div className='upload-image-container'>
            <IonInput
              className='achievement-image-input'
              labelPlacement='stacked'
              label='Image URL'
              fill='outline'
              value={formData.image_url}
              onIonChange={e => handleInputChange('image_url', e.detail.value!)}
            ></IonInput>
            {imagePreview &&
              <>
                <IonText className='organization-logo-preview-text'>Image Preview:</IonText>
                <IonImg
                  className="organization-logo-preview"
                  src={imagePreview}
                  alt="Image Preview"
                ></IonImg>
              </>
            }
          </div>
          <IonTextarea
            className='achievement-form-input'
            labelPlacement='stacked'
            label='Description'
            fill='outline'
            rows={4}
            value={formData.description}
            onIonChange={e => handleInputChange('description', e.detail.value!)}
          ></IonTextarea>
          <IonInput
            className='achievement-form-input'
            labelPlacement='stacked'
            label='Date'
            fill='outline'
            type='date'
            value={date}
            onIonChange={(e) => handleInputChange('date', e.detail.value!)}
          ></IonInput>
        </IonContent>
        <IonButton className='achievement-form-submit' color={'medium'} onClick={handleSubmit}>
          {isEdit ? 'Update Achievement' : 'Add Achievement'}
        </IonButton>
      </IonModal>
    );
  };

export default AchievementForm;
