
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

// Firebase configuration
// Note: In a production environment, these values should be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAk9ChvDRPXxADhM2PvvwFWW-G0kMJnDZY",
  authDomain: "football-tactics-board-a9ab3.firebaseapp.com",
  projectId: "football-tactics-board-a9ab3",
  storageBucket: "football-tactics-board-a9ab3.appspot.com",
  messagingSenderId: "1059380306752",
  appId: "1:1059380306752:web:48dbef19ca9cd5c7e39c20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase initialized successfully");

type User = {
  id: string;
  email: string;
  name: string;
  role: 'coach' | 'player';
} | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'coach' | 'player') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log("User is authenticated:", firebaseUser.uid);
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || userData.name || '',
              role: userData.role || 'coach'
            });
          } else {
            // Fallback if no user document exists
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: 'coach'
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error loading user data");
          setUser(null);
        }
      } else {
        console.log("No user authenticated");
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log("Login successful for user:", firebaseUser.uid);
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || userData.name || '',
          role: userData.role || 'coach'
        });
      } else {
        // Create a user document if it doesn't exist
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: 'coach',
          createdAt: new Date().toISOString()
        });
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          role: 'coach'
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'coach' | 'player'): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting signup with email:", email);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log("User created successfully:", firebaseUser.uid);
      
      // Update profile with display name
      await updateProfile(firebaseUser, { displayName: name });
      
      console.log("Profile updated with name:", name);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      });
      
      console.log("User data stored in Firestore");
      
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name,
        role
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
