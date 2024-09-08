import { IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import './DeleteModal.css';

type DeleteModalProps = {
  title: string,
  isOpen: boolean,
  handleDelete: () => void,
  onClose: () => void
};

const DeleteModal: React.FC<DeleteModalProps> = ({ title, isOpen, handleDelete, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const isDeleteConfirmed = inputValue.toLowerCase() === 'delete';

  const handleClose = () => {
    onClose();
    setInputValue('');
  }

  return (
    <IonModal className='delete-modal' isOpen={isOpen} backdropDismiss={false}>
      <IonHeader>
        <IonToolbar className='delete-modal-header'>
          <IonTitle className='delete-modal-title'>Delete {title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="delete-modal-content ion-padding">
        <p className='delete-modal-desc'>To confirm, type "delete" in the box below</p>
        <IonInput
          className='delete-input'
          value={inputValue}
          onIonInput={(e) => setInputValue(e.detail.value!)}
          fill='outline'
          color={'danger'}
        />
        <IonButton
          expand="block"
          color="danger"
          onClick={handleDelete}
          disabled={!isDeleteConfirmed}
        >
          Confirm Delete
        </IonButton>
        <IonButton
          expand="block"
          color="medium"
          onClick={handleClose}
        >
          Cancel
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default DeleteModal;
