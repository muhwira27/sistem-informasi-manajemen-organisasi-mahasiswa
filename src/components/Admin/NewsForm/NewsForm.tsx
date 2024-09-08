import React, { useEffect, useState } from 'react';
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
import { createData, updateData } from '../../../firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';
import './NewsForm.css';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: Timestamp;
}

const initialNewsState = {
  title: '',
  content: '',
  image_url: '',
};

const NewsForm: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onNewsChange: () => Promise<void>,
  news?: News | null,
}> = ({ isOpen, onClose, onNewsChange, news }) => {
  const [formData, setFormData] = useState(initialNewsState);
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [date, setDate] = useState('');
  const [present] = useIonToast();

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        image_url: news.image_url,
      });
      setDate(convertTimestampToDate(news.date));
      setIsEdit(true);
      const imageUrl = news.image_url;
      const parts = imageUrl.split("/");
      const idImageUrl = parts[5];
      setImagePreview(`https://drive.google.com/thumbnail?id=${idImageUrl}`);
    } else {
      setFormData(initialNewsState);
      setIsEdit(false);
      setImagePreview('');
      setDate('');
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
    };
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.image_url || !formData.content || !date) {
      present({
        message: 'Please fill in all the fields',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      return;
    };
    try {
      const newsData = {
        ...formData,
        date: convertDateToTimestamp(date)
      }

      if (news) {
        // Update existing news
        await updateData(news.id, newsData, 'news');
      } else {
        // Add new news
        await createData(newsData, 'news');
      }

      onClose();
      await onNewsChange();
    } catch (error) {
      console.error('Error adding/editing news:', error);
    }
  };

  return (
    <IonModal className='news-form' isOpen={isOpen} backdropDismiss={false}>
      <div className='news-form-header'>
        <IonText className='news-form-title'>
          {isEdit ? `Edit News` : 'Add New News'}
        </IonText>
        <IonIcon
          className='news-form-close'
          icon={close}
          onClick={() => {
            onClose();
            setFormData(initialNewsState);
            setImagePreview('');
          }}
        ></IonIcon>
      </div>
      <IonContent className="news-form-content">
        <IonInput
          className='news-form-input'
          labelPlacement='stacked'
          label='Title'
          fill='outline'
          value={formData.title}
          onIonInput={e => handleInputChange('title', e.detail.value!)}
        ></IonInput>
        <div className='upload-logo-container'>
          <IonInput
            className='news-logo-input'
            labelPlacement='stacked'
            label='Image URL'
            fill='outline'
            value={formData.image_url}
            onIonChange={e => handleInputChange('image_url', e.detail.value!)}
          ></IonInput>
          {imagePreview &&
            <>
              <IonText className='news-logo-preview-text'>Image Preview:</IonText>
              <IonImg
                className="news-logo-preview"
                src={imagePreview}
                alt="Image Preview"
              ></IonImg>
            </>
          }
        </div>
        <IonInput
          className='achievement-form-input'
          labelPlacement='stacked'
          label='Date'
          fill='outline'
          type='date'
          value={date}
          onIonInput={(e) => handleInputChange('date', e.detail.value!)}
        ></IonInput>
        <IonTextarea
          className='news-form-input'
          labelPlacement='stacked'
          label='Content'
          fill='outline'
          autoGrow={true}
          rows={4}
          value={formData.content}
          onIonInput={e => handleInputChange('content', e.detail.value!)}
        // onIonChange={e => handleInputChange('content', e.detail.value!)}
        ></IonTextarea>
      </IonContent>
      <IonButton className='news-form-submit' color={'medium'} onClick={handleSubmit}>
        {isEdit ? 'Update News' : 'Add News'}
      </IonButton>
    </IonModal>
  );
};

export default NewsForm;
