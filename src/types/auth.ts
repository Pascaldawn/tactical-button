
export type UserRole = 'Analyst' | 'coach' | 'player';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
} | null;

export interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}
