import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonModal, IonText, useIonToast } from '@ionic/react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { createDataWithCustomId, getAllData, getDataById, updateData } from '../../../firebase/firestoreService';
import { firestore } from '../../../firebase/firebase';
import { close } from 'ionicons/icons';
import './EditOfficerForm.css';

type User = {
  id: string,
  name: string,
  nim: string,
  organizations: {
    id: string,
    role: string,
  }[]
}

const EditOfficerForm: React.FC<{
  isOpen: boolean;
  onClose: () => void,
  onMemberChange: () => Promise<void>,
  organizationId: string,
  roleToEdit: string,
}> = ({ isOpen, onClose, onMemberChange, organizationId, roleToEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState<Record<string, string> | null>(null);
  const [present] = useIonToast();

  useEffect(() => {
    const debounceId = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm).then(setSearchResults);
      }
    }, 300); // Waits for 300ms after user stops typing

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

  const searchUsers = async (term: string) => {
    // Ensure the term is a string and trim any whitespace
    const trimmedTerm = term.trim();

    // Create a query for users whose NIM starts with the search term
    const usersRef = collection(firestore, 'users');
    const nimQuery = query(
      usersRef,
      where('nim', '>=', trimmedTerm),
      where('nim', '<=', trimmedTerm + '\uf8ff'),
      orderBy('nim'),
      limit(10)
    );

    const nimSnapshot = await getDocs(nimQuery);
    const nimResults = nimSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return nimResults;
  };

  const handleSelectUser = (user: Record<string, string>) => {
    setSelectedMember(user);
  };

  const handleRemoveUser = () => {
    setSelectedMember(null);
  };

  const updateUserData = async (role: string, id: string) => {
    const userData: User = await getDataById(id, 'users');
    if (userData) {
      const organizationIndex = userData.organizations.findIndex(org => org.id === organizationId);

      if (organizationIndex !== -1) {
        // Organization found, update the role
        const updatedOrganizations = userData.organizations.map(org =>
          org.id === organizationId ? { ...org, role: role } : org
        );
        await updateData(id, { organizations: updatedOrganizations }, 'users');
      } else {
        // Organization not found, add a new one
        const updatedOrganizations = [...userData.organizations, { id: organizationId, role: role }];
        await updateData(id, { organizations: updatedOrganizations }, 'users');
      }
    }
  };



  const handleSubmit = async () => {
    if (!selectedMember) {
      present({
        message: `Please select a member`,
        duration: 5000,
        position: 'top',
        color: 'danger',
      });
      return;
    };

    try {
      if (selectedMember) {
        const memberRef = `/organizations/${organizationId}/members`;
        const existingMemberData = await getDataById(selectedMember.id, memberRef);

        if (existingMemberData && existingMemberData.role !== 'Anggota') {
          present({
            message: `${selectedMember.name} is already an officer in the organization.`,
            duration: 6000,
            position: 'top',
            color: 'danger',
          });
          return;
        }

        const membersData = await getAllData(`/organizations/${organizationId}/members`);
        for (const member of membersData) {
          if (member.role === roleToEdit) {
            await updateData(member.id, { role: 'Anggota' }, memberRef);
            await updateUserData('Anggota', member.id);
          }
        }

        if (existingMemberData) {
          await updateData(selectedMember.id, { role: roleToEdit }, memberRef);
        } else {
          await createDataWithCustomId({
            name: selectedMember.name,
            nim: selectedMember.nim,
            role: roleToEdit
          }, memberRef, selectedMember.id);
          await createDataWithCustomId({
            nim: selectedMember.nim,
          }, `member_list`, selectedMember.id);
        }

        await updateUserData(roleToEdit, selectedMember.id);
      }
      handleClose();
      await onMemberChange();
    } catch (error) {
      console.error('Error editing officer:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    setSelectedMember(null);
  };

  return (
    <IonModal isOpen={isOpen} className='member-form' backdropDismiss={false}>
      <div className='member-form-header'>
        <IonText className='member-form-title'>Edit {roleToEdit}</IonText>
        <IonIcon className='member-form-close' icon={close} onClick={handleClose}></IonIcon>
      </div>

      <IonContent className="member-form-content">
        <IonInput
          placeholder="Search by NIM"
          value={searchTerm}
          fill='outline'
          onIonChange={(e) => setSearchTerm(e.detail.value!)}
        />

        <div className='search-result-container'>
          <IonText>Search result:</IonText>
          {searchResults.map((user: Record<string, string>) => (
            <div className='search-result' key={user.id} onClick={() => handleSelectUser(user)}>
              {user.name} - {user.nim}
            </div>
          ))}
        </div>

        <div className='list-member'>
          {selectedMember && (
            <div className='selected-member'>
              <IonText>Selected Member: </IonText>
              <div className='member-item'>
                <IonText>{selectedMember.name} - {selectedMember.nim}</IonText>
                <IonIcon className='remove-member' icon={close} onClick={handleRemoveUser} />
              </div>
            </div>
          )}
        </div>

      </IonContent>
      <IonButton className='member-form-submit' color={'medium'} onClick={handleSubmit}>
        Update {roleToEdit}
      </IonButton>
    </IonModal>
  );
};

export default EditOfficerForm;
