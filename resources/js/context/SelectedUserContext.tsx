import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    profile_photo: string | null;
    status?: "Online" | "Offline" | "Away";
    lastSeen?: string;
    created_at: string;
}

interface SelectedUserContextType {
    selectedUser: User | null;
    setSelectedUser: Dispatch<SetStateAction<User | null>>;
    clearSelectedUser: () => void;
}

const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

interface SelectedUserProviderProps {
    children: ReactNode;
}

export const SelectedUserProvider: React.FC<SelectedUserProviderProps> = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const clearSelectedUser = () => {
        setSelectedUser(null);
    };

    return (
        <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser, clearSelectedUser }}>
            {children}
        </SelectedUserContext.Provider>
    );
};

export const useSelectedUser = (): SelectedUserContextType => {
    const context = useContext(SelectedUserContext);
    if (context === undefined) {
        throw new Error('useSelectedUser must be used within a SelectedUserProvider');
    }
    return context;
};
