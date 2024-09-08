import React, { useContext, useEffect, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonImg,
  IonInput,
  IonRow,
  IonText,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { AuthContext } from '../../context/authContext';
import { getDataById, updateData } from '../../firebase/firestoreService';
import { getCurrentUser, sendResetPasswordEmail, updateEmailUser } from "../../firebase/authService";
import './Biodata.css';

const Biodata: React.FC = () => {
  const [userData, setUserData] = useState<Record<string, string> | null>(null);
  const [originalUserData, setOriginalUserData] = useState<Record<string, string> | null>(null);
  const [isOpen, setIsOpen] = useState(false)
  const [readonly, setReadOnly] = useState(true);
  const { currentUser, signOut } = useContext(AuthContext);
  const [present] = useIonToast();
  const [password, setPassword] = useState('');
  const [showIonLoading, dismissIonLoading] = useIonLoading();
  const router = useIonRouter();

  const handleInputChange = (field: any, value: any) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSendPasswordResetEmail = async () => {
    if (userData && userData.email) {
      try {
        await sendResetPasswordEmail(userData.email);
        present({
          message: 'Password reset email sent. please check your email.',
          duration: 6000,
          position: 'top',
          color: 'medium',
          cssClass: 'login-toast'
        });
      } catch (error) {
        console.log('Error sending password reset email:', error);
      }
    } else {
      alert('User email not found');
    }
  };

  const saveProfile = async () => {
    if (currentUser && currentUser.uid && userData) {

      if (userData.email !== originalUserData?.email) {
        try {
          await updateEmailUser(userData.email, password);
          present({
            message: 'Email verification sent. Please check your new email.',
            duration: 6000,
            position: 'top',
            color: 'medium',
            cssClass: 'login-toast'
          });

          showIonLoading('Loading');
          setTimeout(() => {
            dismissIonLoading();
            signOut();
            router.push('/login', 'none');
          }, 1000)
        } catch (error) {
          console.log('Error when change email: ', error);
          if (error.code === 'auth/invalid-credential' || error.code === "auth/missing-password") {
            present({
              message: 'Failed to change email. Please enter the correct password',
              duration: 6000,
              position: 'top',
              color: 'danger',
              cssClass: 'login-toast'
            });
            return;
          }
          if (error.code === 'auth/invalid-new-email') {
            present({
              message: 'Failed to change email. Please enter the correct email',
              duration: 6000,
              position: 'top',
              color: 'danger',
              cssClass: 'login-toast'
            });
            return;
          }
          present({
            message: 'Failed to change email.',
            duration: 6000,
            position: 'top',
            color: 'danger',
            cssClass: 'login-toast'
          });
          return;
        }
      }

      try {
        if (readonly) {
          setReadOnly(false);
          return;
        }
        await updateData(currentUser.uid, userData, 'users');
        setReadOnly(true);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setReadOnly(true);
  };

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const email = getCurrentUser()?.email;
      getDataById(currentUser.uid, 'users').then(user => {
        setUserData({ ...user, email: email });
        setOriginalUserData({ ...user, email: email });
      });
    }
  }, [currentUser]);

  return (
    <IonCard className='ion-padding biodata'>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonText className='header-general-info'>General Information</IonText>
            <IonInput
              fill='outline'
              label='Name'
              labelPlacement='stacked'
              readonly
              value={userData?.name}
              type='text'
              onIonChange={(e) => handleInputChange('name', e.detail.value)}
              style={{ marginTop: '20px' }}
            ></IonInput>
            <IonInput
              className='ion-margin-vertical'
              fill='outline'
              label='NIM'
              labelPlacement='stacked'
              readonly
              value={userData?.nim}
              onIonChange={(e) => handleInputChange('nim', e.detail.value)}
            ></IonInput>
            <IonInput
              fill='outline'
              className='input-email'
              label='Email'
              helperText={!readonly ? '*Changing your email requires verification at the new email address' : ''}
              labelPlacement='stacked'
              readonly={readonly}
              value={userData?.email}
              onIonChange={(e) => handleInputChange('email', e.detail.value)}
            ></IonInput>
            {
              !readonly &&
              <IonInput
                className='input-password'
                fill='outline'
                helperText='*Password is required to change email'
                label='Password'
                labelPlacement='stacked'
                readonly={readonly}
                type='password'
                value={password}
                onIonChange={(e) => setPassword(e.detail.value)}
              ></IonInput>
            }
            <IonInput
              className='ion-margin-vertical'
              fill='outline'
              label='Phone'
              labelPlacement='stacked'
              readonly={readonly}
              value={userData?.phone}
              onIonChange={(e) => handleInputChange('phone', e.detail.value)}
            ></IonInput>
            <div className='container-profile-btn'>
              {!readonly &&
                <IonButton
                  className='profile-btn'
                  onClick={handleCancel}
                  expand='full'
                  color={'danger'}
                >
                  Cancel
                </IonButton>}
              <IonButton
                className='profile-btn'
                onClick={saveProfile}
                expand='full'
                color={'medium'}
              >
                {readonly ? 'Edit Profile' : 'Save Profile'}
              </IonButton>
            </div>
            <div className='container-change-password'>
              <IonText className='header-change-password'>Change Password</IonText>
              <IonButton
                className='button-change-password'
                color={'medium'}
                onClick={() => setIsOpen(true)}
              >
                Change Password
              </IonButton>
            </div>
          </IonCol>
          <IonCol size='0.6'></IonCol>
          <IonCol size='auto'>
            <IonImg
              className='user-img'
              src='src/assets/images/profile-picture.png'
            ></IonImg>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonAlert
        className='costum-alert'
        isOpen={isOpen}
        header='Change password'
        message={'Are you sure to change your password?'}
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: handleSendPasswordResetEmail,
            cssClass: 'alert-button-confirm'
          },
        ]}
        onDidDismiss={() => setIsOpen(false)}
      >
      </IonAlert>
    </IonCard>
  );
};

export default Biodata;
