import { router } from '@inertiajs/react';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const login = (userData: any) => {
        const userDetails = userData?.user;
        setUser(userDetails);
        localStorage.setItem('user', JSON.stringify(userDetails));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.visit('/login');
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
