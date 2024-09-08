import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  NextOrObserver,
  User,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { auth } from './firebase';

export const createUser = async (email: string, password: string) => {
  const currentUser = auth.currentUser;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await auth.updateCurrentUser(currentUser); 
    return userCredential.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const updateEmailUser = async (newEmail: string, password: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in.');
    }

    // Create credentials
    const credential = EmailAuthProvider.credential(user.email, password);

    // Re-authenticate the user
    await reauthenticateWithCredential(user, credential);

    // Proceed with updating the email
    await verifyBeforeUpdateEmail(user, newEmail);

  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};
