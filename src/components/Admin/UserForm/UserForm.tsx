import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonModal, IonText, useIonLoading, useIonToast, } from '@ionic/react';
import { close } from 'ionicons/icons';
import { createDataWithCustomId, updateData } from '../../../firebase/firestoreService';
import { createUser } from '../../../firebase/authService';
import './UserForm.css';

interface User {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone: string;
  organizations: [];
}

const initialState = {
  nim: '',
  name: '',
  email: '',
  phone: '',
  role: 2,
  organizations: [],
};

const UserForm: React.FC<{
  isOpen: boolean;
  onClose: () => void,
  onUserChange: () => Promise<void>,
  user?: User | null;
}> = ({ isOpen, onClose, onUserChange, user }) => {
  const [formData, setFormData] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);
  const [showIonLoading, dismissIonLoading] = useIonLoading();
  const [present] = useIonToast();

  useEffect(() => {
    if (user) {
      setFormData({
        nim: user.nim,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 2,
        organizations: user.organizations ? user.organizations : [],
      });
      setIsEdit(true);
    } else {
      setFormData(initialState);
      setIsEdit(false);
    }
  }, [isOpen]);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nim || !formData.name || !formData.email) {
      present({
        message: 'Please fill in all the required fields (NIM, Name, and Email)',
        duration: 5000,
        position: 'top',
        color: 'danger',
      });
      return;
    };
    try {
      showIonLoading('Loading');
      if (user) {
        // Update existing user
        await updateData(user.id, formData, 'users');
      } else {
        // Add new user
        const user = await createUser(formData.email, formData.nim)
        await createDataWithCustomId(formData, 'users', user.uid);
      }
      onClose();
      await onUserChange();
    } catch (error) {
      console.error('Error adding/editing user:', error);
    } finally {
      dismissIonLoading();
    }
  };

  return (
    <IonModal isOpen={isOpen} className='user-form' backdropDismiss={false}>
      <div className='user-form-header'>
        <IonText className='user-form-title'>{isEdit ? 'Edit User' : 'Add New User'}</IonText>
        <IonIcon className='user-form-close' icon={close} onClick={onClose}></IonIcon>
      </div>
      <IonContent className="user-form-content">
        <IonInput
          className='user-form-input'
          labelPlacement='stacked'
          label='NIM'
          fill='outline'
          value={formData.nim}
          onIonChange={(e) => handleInputChange('nim', e.detail.value!)}
        ></IonInput>
        <IonInput
          className='user-form-input'
          label="Name"
          labelPlacement="stacked"
          value={formData.name}
          fill='outline'
          onIonChange={(e) => handleInputChange('name', e.detail.value!)}
        ></IonInput>
        <IonInput
          className='user-form-input'
          label="Email"
          type='email'
          readonly={isEdit}
          labelPlacement="stacked"
          value={formData.email}
          fill='outline'
          onIonChange={(e) => handleInputChange('email', e.detail.value!)}
        ></IonInput>
        <IonInput
          className='user-form-input'
          label="Phone"
          readonly={isEdit}
          labelPlacement="stacked"
          value={formData.phone}
          fill='outline'
          onIonChange={(e) => handleInputChange('phone', e.detail.value!)}
        ></IonInput>
      </IonContent>
      <IonButton className='user-form-submit' color={'medium'} onClick={handleSubmit}>
        {isEdit ? 'Update User' : 'Add User'}
      </IonButton>
    </IonModal>
  );
};

export default UserForm;
