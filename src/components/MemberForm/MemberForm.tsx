import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonInput, IonModal, IonText, useIonToast } from '@ionic/react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { createDataWithCustomId, getAllData, getDataById, updateData } from '../../firebase/firestoreService';
import { firestore } from '../../firebase/firebase';
import { close } from 'ionicons/icons';
import './MemberForm.css';

const MemberForm: React.FC<{
  isOpen: boolean;
  onClose: () => void,
  onMemberChange: () => Promise<void>,
  organizationId: string
}> = ({ isOpen, onClose, onMemberChange, organizationId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState<Record<string, string>[]>([]);
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
    if (!selectedMembers.some((member: Record<string, string>) => member.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== userId));
  };


  const handleSubmit = async () => {
    if (!selectedMembers.length) {
      console.log(selectedMembers)
      present({
        message: `Please select at least one member`,
        duration: 5000,
        position: 'top',
        color: 'danger',
      });
      return;
    };

    try {
      if (selectedMembers) {
        const members = await getAllData(`/organizations/${organizationId}/members`);
        const existingMemberIds = members.map(member => member.id);

        for (const member of selectedMembers) {
          if (!existingMemberIds.includes(member.id)) {
            // Add the user to the organization's member list
            await createDataWithCustomId({
              nim: member.nim,
              name: member.name,
              role: 'Anggota',
            }, `/organizations/${organizationId}/members`, member.id);
            await createDataWithCustomId({
              nim: member.nim,
            }, `member_list`, member.id);

            // Update user's organizations field
            const userData = await getDataById(member.id, 'users');
            if (userData) {
              const updatedOrganizations = [...userData.organizations, { id: organizationId, role: 'Anggota' }];
              await updateData(member.id, { organizations: updatedOrganizations }, 'users');
            }
          }
        }
      }
      // Retrieve current members in the organization

      handleClose();
      await onMemberChange();
    } catch (error) {
      console.error('Error adding members:', error);
    }
  }

  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResults([]);
    setSelectedMembers([]);
  };

  return (
    <IonModal isOpen={isOpen} className='member-form' backdropDismiss={false}>
      <div className='member-form-header'>
        <IonText className='member-form-title'>Add New Members</IonText>
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
          <IonText>List Members to be Added: </IonText>
          {selectedMembers.map(member => (
            <div key={member.id} className='member-item'>
              <IonText>{member.name} - {member.nim}</IonText>
              <IonIcon className='remove-member' icon={close} onClick={() => handleRemoveUser(member.id)} />
            </div>
          ))}
        </div>

      </IonContent>
      <IonButton className='member-form-submit' color={'medium'} onClick={handleSubmit}>
        Add Members
      </IonButton>
    </IonModal>
  );
};

export default MemberForm;
