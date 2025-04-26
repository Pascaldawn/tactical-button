
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { UserRole } from '../types/auth';

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
  
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", firebaseUser.uid), {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: 'Analyst',
      createdAt: new Date().toISOString()
    });
  }

  return {
    firebaseUser,
    userData: userDoc.exists() ? userDoc.data() : null
  };
};

export const signupUser = async (name: string, email: string, password: string, role: UserRole = 'Analyst') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  await updateProfile(firebaseUser, { displayName: name });
  
  await setDoc(doc(db, "users", firebaseUser.uid), {
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  });

  return firebaseUser;
};

export const logoutUser = () => signOut(auth);
