import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonModal,
  IonText,
  useIonToast
} from '@ionic/react';
import { add, close, remove } from 'ionicons/icons';
import './AlbumForm.css';
import { createData, updateData } from '../../firebase/firestoreService';

const initialState = {
  name: '',
  image_urls: [''],
};

const AlbumForm: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  onAlbumChange: () => Promise<void>,
  organizationId: string,
  editAlbum?: any
}> = ({
  isOpen,
  onClose,
  onAlbumChange,
  organizationId,
  editAlbum
}) => {
    const [formData, setFormData] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [present] = useIonToast();

    useEffect(() => {
      if (editAlbum) {
        setFormData({
          name: editAlbum.name || '',
          image_urls: editAlbum.image_urls || [''],
        });
        setIsEdit(true);
      } else {
        setFormData(initialState);
        setIsEdit(false);
      }
    }, [isOpen]);

    const handleInputChange = (key: string, value: string, index?: number) => {
      if (key === 'image_urls' && typeof index === 'number') {
        const newImageUrls = [...formData.image_urls];
        newImageUrls[index] = value;
        setFormData({ ...formData, image_urls: newImageUrls });
      } else {
        setFormData({ ...formData, [key]: value });
      }
    };

    const handleSubmit = async () => {
      if (!formData.name) {
        present({
          message: 'Please fill in the name field',
          duration: 5000,
          position: 'top',
          color: 'danger',
        });
        return;
      }
      try {
        if (isEdit) {
          await updateData(editAlbum.id, formData, `/organizations/${organizationId}/gallery`);
        } else {
          await createData(formData, `/organizations/${organizationId}/gallery`);
        }
        onClose();
        await onAlbumChange();
      } catch (error) {
        console.error('Error adding/editing album:', error);
      }
    };

    const addImageUrlField = () => {
      setFormData({ ...formData, image_urls: [...formData.image_urls, ''] });
    };

    const removeImageUrlField = (index: number) => {
      const newImageUrls = formData.image_urls.filter((_, i) => i !== index);
      setFormData({ ...formData, image_urls: newImageUrls });
    };

    const getImageURL = (imageURL: string) => {
      if (imageURL) {
        const parts = imageURL.split("/");
        const idImageUrl = parts[5];
        return `https://drive.google.com/thumbnail?id=${idImageUrl}`;
      }
      return '';
    };

    return (
      <IonModal className='album-form' isOpen={isOpen} backdropDismiss={false}>
        <div className='album-form-header'>
          <IonText className='album-form-title'>{isEdit ? 'Edit Album' : 'Create New Album'}</IonText>
          <IonIcon className='album-form-close' icon={close} onClick={onClose}></IonIcon>
        </div>
        <IonContent className="album-form-content">
          <IonInput
            className='album-form-input'
            labelPlacement='stacked'
            label='Name'
            fill='outline'
            value={formData.name}
            required
            onIonChange={(e) => handleInputChange('name', e.detail.value!)}
          ></IonInput>
          <div className='album-upload-image-container'>
            <IonText className='album-upload-image-text'>
              {isEdit ? 'Add more photos' : 'Upload one or more photos'}
            </IonText>
            {formData.image_urls.map((url, index) => (
              <div key={index} className='album-image-url-input-container'>
                <IonInput
                  className='album-image-url-input'
                  placeholder="Image URL"
                  fill='outline'
                  value={url}
                  onIonChange={e => handleInputChange('image_urls', e.detail.value!, index)}
                ></IonInput>
                {index > 0 && (
                  <div
                    className='remove-url-input-container'
                    onClick={() => removeImageUrlField(index)}
                  >
                    <IonIcon className='remove-url-input' icon={remove} />
                  </div>
                )}
                <div
                  className='add-url-input-container'
                  onClick={addImageUrlField}
                >
                  <IonIcon icon={add} />
                </div>
              </div>
            ))}
          </div>
          <IonText>Image Previews:</IonText>
          <div className="image-preview-container" style={{ marginBottom: '30px' }}>
            {formData.image_urls.map((url, index) => (
              url &&
              <IonImg key={index} src={getImageURL(url)} alt={`Preview ${index}`} className="image-preview" />
            ))}
          </div>
        </IonContent>
        <IonButton className='album-form-submit' color={'medium'} onClick={handleSubmit}>
          {isEdit ? 'Update Album' : 'Create Album'}
        </IonButton>
      </IonModal >
    );
  };

export default AlbumForm;
