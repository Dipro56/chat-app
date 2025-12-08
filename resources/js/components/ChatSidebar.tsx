import React, { useEffect, useState } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useSelectedUser } from "@/context/SelectedUserContext";
import { LogOut, Search, Loader2 } from "lucide-react";
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    profile_photo: string | null;
    status?: "Online" | "Offline" | "Away";
    lastSeen?: string;
    created_at: string;
}

interface ChatSidebarProps {
    onLogout: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onLogout }) => {
    const { closeSidebar } = useSidebar();
    const { user: currentUser } = useAuth();
    const { selectedUser, setSelectedUser } = useSelectedUser();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getUserList();
    }, []);

    const getUserList = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/get-userlist');

            if (response.data) {
                // Transform API data to match our User interface
                const userData = response.data.data.map((user: any) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile_photo: user.profile_photo,
                    status: getRandomStatus(),
                    lastSeen: getRandomLastSeen(),
                    created_at: user.created_at
                }));

                setUsers(userData);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setError(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for demo
    const getRandomStatus = (): "Online" | "Offline" | "Away" => {
        const statuses: ("Online" | "Offline" | "Away")[] = ["Online", "Offline", "Away"];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };

    const getRandomLastSeen = (): string => {
        const times = ["Just now", "2 minutes ago", "5 minutes ago", "10 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago"];
        return times[Math.floor(Math.random() * times.length)];
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    };

    const getUserInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Online': return 'bg-green-500';
            case 'Away': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 ease-in-out shadow-xl
            md:translate-x-0 md:static md:flex md:flex-col">

            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getUserInitial(currentUser?.name || 'User')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold truncate">{currentUser?.name}</h2>
                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </span>
                    </div>
                </div>
                <button
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={closeSidebar}
                >
                    ✕
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Users list Header */}
            <div className="px-4 pt-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contacts ({filteredUsers.length})
                </h3>
                <button
                    onClick={getUserList}
                    disabled={loading}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                        <p className="text-sm text-gray-500">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-sm text-red-500 mb-2">{error}</p>
                        <button
                            onClick={getUserList}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500">
                            {searchTerm ? 'No users found' : 'No users available'}
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedUser?.id === user.id
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30"
                                        : "hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold text-lg shadow">
                                        {user.profile_photo ? (
                                            <img
                                                src={user.profile_photo}
                                                alt={user.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.parentElement!.innerHTML = `<span>${getUserInitial(user.name)}</span>`;
                                                }}
                                            />
                                        ) : (
                                            <span>{getUserInitial(user.name)}</span>
                                        )}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status || 'Offline')}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-gray-900 dark:text-white truncate">{user.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.lastSeen}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 truncate ">
                                            {user.email}
                                        </span>

                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Logout */}
            <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <LogOut size={18} className="mr-2" /> Logout
                </button>
            </div>
        </div>
    );
};

export default ChatSidebar;
