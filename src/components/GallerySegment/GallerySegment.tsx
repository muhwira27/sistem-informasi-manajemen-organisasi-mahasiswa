import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonImg,
  IonLabel,
  IonRouterLink,
  IonRow,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { deleteData, getAllData, getDataById, updateData } from '../../firebase/firestoreService';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { readCookieItems } from '../../utils/cookieFunctions';
import { addCircle, createOutline, trashOutline } from 'ionicons/icons';
import AlbumForm from '../AlbumForm/AlbumForm';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import './GallerySegment.css'

type Params = {
  id: string;
};

interface Album {
  id: string;
  name: string;
  image_urls: string[];
}

const GallerySegment: React.FC = () => {
  const { id } = useParams<Params>();
  const { currentUser } = useContext(AuthContext);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [albumToEdit, setAlbumToEdit] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [indexAlbum, setIndexAlbum] = useState(-1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState('');
  const [isDeleteImageAlertOpen, setIsDeleteImageAlertOpen] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (shouldRefetch) {
      fetchAlbum();
      setShouldRefetch(false);
    }
  }, [id, currentUser, shouldRefetch])

  useEffect(() => {
    verifyAdminStatus();
  }, [id, currentUser])

  useEffect(() => {
    return () => {
      setAlbumList([]);
      setShouldRefetch(true);
      setIsAdmin(false);
    };
  }, [id]);

  const verifyAdminStatus = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users');
      const organization = userData?.organizations?.find((org: Record<string, string>) =>
        org.id === id
      );
      const role = organization ? organization.role : null;
      const adminRole = [
        'Ketua Umum',
        'Sekretaris',
      ]
      setIsAdmin(adminRole.includes(role));
    } else {
      setIsAdmin(false);
    }
  };

  const fetchAlbum = async () => {
    const data = await getAllData(`/organizations/${id}/gallery`);

    setAlbumList(data);
  };

  const toggleAlbumOpen = (idx: number) => {
    setIndexAlbum(idx);
    setIsAlbumOpen(!isAlbumOpen);
  };

  const getLogoURL = (logoURL: string) => {
    const parts = logoURL.split("/");
    const idLogoUrl = parts[5];
    return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
  };

  const openModal = (album: Album | null) => {
    if (album) {
      setAlbumToEdit(album);
    }
    setIsOpen(true);
  };

  const onDelete = (album: Album) => {
    setAlbumToDelete(album);
    setTitle(album.name);
    setIsDelete(true);
  }

  const onAlbumChange = async () => {
    setShouldRefetch(true);
  };

  const handleDelete = async () => {
    try {
      if (albumToDelete) {
        await deleteData(albumToDelete.id, `/organizations/${id}/gallery`);

        await onAlbumChange();
        setIsAlbumOpen(false);
      }
    } catch (error) {
      console.log('Error deleting achievement: ', error)
    }
  };

  const handleDeleteImage = (index: number) => {
    setImageToDeleteIndex(index);
    setIsDeleteImageAlertOpen(true);
  };

  const confirmDeleteImage = async () => {
    try {
      if (imageToDeleteIndex !== null) {
        const updatedAlbum = { ...albumList[indexAlbum] };
        updatedAlbum.image_urls.splice(imageToDeleteIndex, 1);
        await updateData(albumList[indexAlbum].id, updatedAlbum, `/organizations/${id}/gallery`);
        await fetchAlbum();
      }
    } catch (error) {
      console.log('Error deleting image: ', error);
    } finally {
      // Setelah selesai, atur kembali state untuk menutup alert
      setIsDeleteImageAlertOpen(false);
      setImageToDeleteIndex(null);
    }
  };

  return (
    <div className='album-segment ion-padding'>
      {!isAlbumOpen ?
        <>
          <div className='album-header'>
            <IonText>Album</IonText>
            {isAdmin &&
              <IonButton className='add-album' color={'medium'} onClick={() => openModal(null)}>
                <IonIcon icon={addCircle}></IonIcon>
                &nbsp; Add &nbsp;
                <IonText className='add-album-text'>Album</IonText>
              </IonButton>
            }
          </div>
          <div className='album-card-container'>
            {albumList.map((album, index) => (
              <IonCard key={index} className="album-card" onClick={() => toggleAlbumOpen(index)}>
                <IonCardContent className="album-content">
                  <div className='image-info-container'>
                    <div className="album-images-container">
                      {album.image_urls?.slice(0, 4).map((photo, photoIndex) => (
                        <IonImg key={photoIndex} src={getLogoURL(photo)} alt={`image${index + 1}`} className="album-images"></IonImg>
                      ))}
                    </div>
                    <div className='album-info'>
                      <IonRouterLink>
                        <div className="album-title">
                          <IonLabel title={album.name}>{album.name}</IonLabel>
                        </div>
                      </IonRouterLink>
                      <IonBadge className="album-badge" slot="end">{album.image_urls?.length} Foto</IonBadge>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </>
        :
        <>
          <div className='album-header'>
            <div className='album-title-container'>
              <IonText>Album {albumList[indexAlbum]?.name}</IonText>
            </div>
            {isAdmin &&
              <div className='actions-btn-gallery'>
                <IonButton
                  className='edit-album'
                  color={'medium'}
                  onClick={() => openModal(albumList[indexAlbum])}
                >
                  <IonIcon style={{ paddingBottom: '2px' }} icon={createOutline}></IonIcon>
                  &nbsp; Edit Album
                </IonButton>
                <IonButton
                  className='delete-album'
                  color={'danger'}
                  onClick={() => onDelete(albumList[indexAlbum])}
                >
                  <IonIcon icon={trashOutline}></IonIcon>
                  &nbsp; Delete Album
                </IonButton>
              </div>
            }
          </div>
          <IonGrid>
            <IonRow>
              {albumList[indexAlbum]?.image_urls?.map((photo, index) =>
                <IonCol sizeXs='12' sizeSm='6' sizeMd='4' sizeXl='3' key={index}>
                  <IonImg src={getLogoURL(photo)} alt={`image${index + 1}`} className="images"></IonImg>
                  {isAdmin &&
                    <div className='container-delete-image'>
                      <IonIcon
                        className='delete-image'
                        icon={trashOutline}
                        onClick={() => handleDeleteImage(index)}
                      ></IonIcon>
                    </div>
                  }
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
          <div className='container-button'>
            <IonButton onClick={() => toggleAlbumOpen(-1)} className='back-button'>
              back
            </IonButton>
          </div>
        </>
      }
      <AlbumForm
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setAlbumToEdit(null)
        }}
        onAlbumChange={onAlbumChange}
        organizationId={id}
        editAlbum={albumToEdit}
      />

      <DeleteConfirm
        segment='Album'
        title={title}
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        handleDelete={handleDelete}
      />

      <DeleteConfirm
        segment='Image'
        title={`image ${imageToDeleteIndex !== null ? imageToDeleteIndex + 1 : ''}`}
        isOpen={isDeleteImageAlertOpen}
        onClose={() => setIsDeleteImageAlertOpen(false)}
        handleDelete={confirmDeleteImage}
      />
    </div >
  );
};

export default GallerySegment;
