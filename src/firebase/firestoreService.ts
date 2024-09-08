import { 
  collection, 
  doc,
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  DocumentData,
  query, 
  where,
  setDoc,
} from 'firebase/firestore';
import { firestore } from './firebase';

export const getAllData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const getDataById = async (id: string, collectionName: string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const createData =  async (data: DocumentData, collectionName: string) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), data);
    console.log('Data added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const createDataWithCustomId = async (data: DocumentData, collectionName: string, customId: string) => {
  try {
    const docRef = doc(firestore, collectionName, customId);
    await setDoc(docRef, data);
    console.log('Data added successfully with ID:', customId);
    return 'success';
  } catch (error) {
    console.error('Error adding data:', error);
    throw error;
  }
};

export const updateData = async (id: string, newData: DocumentData, collectionName: string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, newData);
    console.log('Document successfully updated');
    return 'success';
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const deleteData = async (id: string, collectionName: string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const getDataByMultipleField = async (fields: Record<string, string>, collectionName: string) => {
  try {
    const q = query(collection(firestore, collectionName), ...Object.entries(fields).map(([field, value]) => where(field, '==', value)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const getCollectionSize = async (collectionName: string): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error retrieving collection size:', error);
    throw error;
  }
};
