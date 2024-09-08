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
import { createDataWithCustomId, getAllData, updateData } from '../../../firebase/firestoreService';
import './OrganizationForm.css';

interface Organization {
  id: string
  name: string;
  logo_url: string;
  description: string;
  socmed: Socmed;
}

interface Socmed {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  x: string;
}

const initialOrganizationState = {
  name: '',
  description: '',
  logo_url: '',
  socmed: {
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    x: '',
  },
};

const OrganizationForm: React.FC<{
  isOpen: boolean;
  onClose: () => void,
  onOrganizationAdded: () => Promise<void>,
  organization?: Organization | null;
}> = ({ isOpen, onClose, onOrganizationAdded, organization }) => {
  const [formData, setFormData] = useState(initialOrganizationState);
  const [isEdit, setIsEdit] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [present] = useIonToast();

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        description: organization.description,
        logo_url: organization.logo_url,
        socmed: {
          instagram: organization.socmed.instagram,
          facebook: organization.socmed.facebook,
          youtube: organization.socmed.youtube,
          tiktok: organization.socmed.tiktok,
          x: organization.socmed.x,
        },
      });
      setIsEdit(true);
      const logoUrl = organization.logo_url;
      const parts = logoUrl.split("/");
      const idLogoUrl = parts[5];
      setLogoPreview(`https://drive.google.com/thumbnail?id=${idLogoUrl}`);
    } else {
      setFormData(initialOrganizationState);
      setIsEdit(false);
    }
  }, [isOpen]);

  const handleInputChange = (key: string, value: string) => {
    if (key in formData.socmed) {
      setFormData(prevData => ({
        ...prevData,
        socmed: { ...prevData.socmed, [key]: value },
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [key]: value }));
      if (key === 'logo_url') {
        const parts = value.split("/");
        const idLogoUrl = parts[5];
        setLogoPreview(`https://drive.google.com/thumbnail?id=${idLogoUrl}`);
      }
    }
  };

  const getMaxOrganizationId = async () => {
    const organizations = await getAllData('organizations');
    const maxId = organizations.reduce((max, org) => Math.max(max, parseInt(org.id)), 0);
    return maxId;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.logo_url || !formData.description) {
      present({
        message: 'Please fill in the required fields (Name, Logo URL, Description)',
        duration: 5000,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    try {
      if (organization) {
        // Update existing organization
        await updateData(organization.id, formData, 'organizations');
      } else {
        // Add new organization
        const maxId = await getMaxOrganizationId();
        const newId = maxId + 1;
        await createDataWithCustomId(formData, 'organizations', newId.toString());
      }
      onClose();
      setLogoPreview('');
      await onOrganizationAdded();
    } catch (error) {
      console.error('Error adding/editing organization:', error);
    }
  };

  return (
    <IonModal className='organization-form' isOpen={isOpen} backdropDismiss={false}>
      <div className='organization-form-header'>
        <IonText className='organization-form-title'>
          {isEdit ? `Edit ${organization?.name}` : 'Add New Organization'}
        </IonText>
        <IonIcon
          className='organization-form-close'
          icon={close}
          onClick={() => {
            onClose();
            setFormData(initialOrganizationState);
            setLogoPreview('');
          }}
        ></IonIcon>
      </div>
      <IonContent className="organization-form-content">
        <IonText className='general-info-organization-form'>
          General Information
        </IonText>
        <IonInput
          className='organization-form-input ion-margin-top'
          labelPlacement='stacked'
          label='Name'
          fill='outline'
          value={formData.name}
          onIonInput={e => handleInputChange('name', e.detail.value!)}
        ></IonInput>
        <div className='upload-logo-container'>
          <IonInput
            className='organization-logo-input'
            labelPlacement='stacked'
            label='Logo URL'
            fill='outline'
            value={formData.logo_url}
            onIonInput={e => handleInputChange('logo_url', e.detail.value!)}
          ></IonInput>
          {logoPreview &&
            <>
              <IonText className='organization-logo-preview-text'>Logo Preview:</IonText>
              <IonImg
                className="organization-logo-preview"
                src={logoPreview}
                alt="Logo Preview"
              ></IonImg>
            </>
          }
        </div>
        <IonTextarea
          className='organization-form-input text-area-organization'
          labelPlacement='stacked'
          label='Description'
          fill='outline'
          rows={4}
          autoGrow
          value={formData.description}
          onIonInput={e => handleInputChange('description', e.detail.value!)}
        ></IonTextarea>

        <IonText className='general-info-organization-form'>
          Social Media (Optional)
        </IonText>
        <div className='ion-margin-top'>
          {Object.keys(formData.socmed).map((key) => (
            <IonInput
              key={key}
              className='organization-form-input'
              labelPlacement='stacked'
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              fill='outline'
              value={formData.socmed[key]}
              onIonInput={e => handleInputChange(key, e.detail.value!)}
            ></IonInput>
          ))}
        </div>
      </IonContent>
      <IonButton className='organization-form-submit' color={'medium'} onClick={handleSubmit}>
        {isEdit ? 'Update Organization' : 'Add Organization'}
      </IonButton>
    </IonModal>
  );
};

export default OrganizationForm;
