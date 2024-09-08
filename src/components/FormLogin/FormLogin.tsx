import {
  IonButton,
  IonCard,
  IonContent,
  IonImg,
  IonInput,
  IonText,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../../firebase/authService';
import './FormLogin.css';

const FormLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showIonLoading, dismissIonLoading] = useIonLoading();
  const [present] = useIonToast();
  const router = useIonRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      showIonLoading('Loading');
      const userCredential = await login(email, password);
      if (userCredential) {
        setEmail('');
        setPassword('');
        router.push('/dashboard', 'none');
      }
    } catch (error) {
      console.error('Login failed:', error);
      present({
        message: 'Login gagal. Periksa kembali email dan password anda, lalu coba lagi.',
        duration: 3000,
        position: 'top',
        color: 'danger',
        cssClass: 'login-toast'
      });
    } finally {
      dismissIonLoading();
    }
  };

  return (
    <div className='form-login-container'>
      <IonCard className="login-card ion-padding ion-justify-content-center ion-align-items-centerss">
        <IonImg className='login-img' src='src/assets/images/logo-unhas.png' alt='logo'></IonImg>
        <IonText className='login-title ion-margin'>
          <h5>Sistem Informasi Management Organisasi Mahasiswa</h5>
        </IonText>
        <IonInput
          className='login-input'
          fill='outline'
          value={email}
          type='email'
          placeholder='Email'
          onIonChange={e => setEmail(e.detail.value!)}
        ></IonInput>
        <IonInput
          className='login-input ion-margin-vertical'
          fill='outline'
          value={password}
          placeholder='Password'
          type='password'
          clearOnEdit={false}
          onIonChange={e => setPassword(e.detail.value!)}
        ></IonInput>
        <IonButton className='login-button' onClick={handleLogin}>LOGIN</IonButton>
      </IonCard>
    </div>
  );
};

export default FormLogin;
