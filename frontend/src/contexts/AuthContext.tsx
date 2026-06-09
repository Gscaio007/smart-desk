import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { http } from '../api/http';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'customer';
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('smartdesk.user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smartdesk.token');
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete http.defaults.headers.common.Authorization;
    }
  }, [token]);

  async function login(email: string, password: string) {
    const response = await http.post('/login', {
      email,
      password,
    });

    localStorage.setItem('smartdesk.token', response.data.token);
    localStorage.setItem('smartdesk.user', JSON.stringify(response.data.user));

    setToken(response.data.token);
    setUser(response.data.user);
  }

  async function logout() {
    try {
      await http.post('/logout');
    } finally {
      localStorage.removeItem('smartdesk.token');
      localStorage.removeItem('smartdesk.user');

      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}