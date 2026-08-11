import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as loginApi, logout as logoutApi, fetchMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => setStaff(data.staff))
      .catch(() => setStaff(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginApi(username, password);
    setStaff(data.staff);
    return data.staff;
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setStaff(null);
  }, []);

  return (
    <AuthContext.Provider value={{ staff, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
