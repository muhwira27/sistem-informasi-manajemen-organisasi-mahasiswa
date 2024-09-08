import React, { useState } from 'react';
import { IonAlert } from '@ionic/react';
import './DeleteConfirm.css';

type DeleteConfirmProps = {
  segment: string,
  title: string,
  isOpen: boolean,
  handleDelete: () => void,
  onClose: () => void
};

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  segment,
  title,
  isOpen,
  onClose,
  handleDelete
}) => {
  return (
    <>
      <IonAlert
        className='costum-alert'
        isOpen={isOpen}
        header={`Delete ${segment}`}
        message={`Are you sure to delete ${title}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Delete',
            role: 'confirm',
            handler: handleDelete,
            cssClass: 'alert-button-confirm'
          },
        ]}
        onDidDismiss={onClose}
      ></IonAlert>
    </>
  );
}

export default DeleteConfirm;
