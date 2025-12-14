import api from '@/lib/axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get('/me')
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const login = (userData: any) => {
        const userDetails = userData;
        setUser(userDetails);
        localStorage.setItem('user', JSON.stringify(userDetails));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // router.visit('/login');
        window.location.href = '/login';
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
