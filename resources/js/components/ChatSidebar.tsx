import { useAuth } from '@/context/AuthContext';
import { useSelectedUser } from '@/context/SelectedUserContext';
import { useSidebar } from '@/context/SidebarContext';
import api from '@/lib/axios';
import { Loader2, LogOut, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    profile_photo: string | null;
    status?: 'Online' | 'Offline';
    lastMessage?: string;
    lastMessageTime?: string;
    created_at: string;
}

interface Message {
    sender_id: number;
    receiver_id: number;
    body: string;
    created_at: string;
}

interface PresenceUser {
    id: number;
    name: string;
}

interface ChatSidebarProps {
    onLogout: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onLogout }) => {
    const { closeSidebar } = useSidebar();
    const { user } = useAuth();
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

            const response = await api.get<{ data: User[] }>('/get-userlist');
            if (response.data) {
                const userData: User[] = response.data.data.map((u) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    profile_photo: u.profile_photo,
                    status: 'Offline',
                    lastMessage: '',
                    lastMessageTime: '',
                    created_at: u.created_at,
                }));
                setUsers(userData);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err: unknown) {
            console.error(err);
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch users';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Presence channel updates
    useEffect(() => {
        if (!user?.id) return;

        const presenceChannel = window.Echo.join('presence-online');

        presenceChannel
            .here((onlineUsers: PresenceUser[]) => {
                setUsers((prev) =>
                    prev.map((u) => ({
                        ...u,
                        status: onlineUsers.some((o) => o.id === u.id) ? 'Online' : 'Offline',
                    })),
                );
                console.log('✅ Currently online users:', onlineUsers);
            })
            .joining((newUser: PresenceUser) => {
                setUsers((prev) => prev.map((u) => (u.id === newUser.id ? { ...u, status: 'Online' } : u)));
                console.log('➡️ User joined:', newUser);
            })
            .leaving((leftUser: PresenceUser) => {
                setUsers((prev) => prev.map((u) => (u.id === leftUser.id ? { ...u, status: 'Offline' } : u)));
                console.log('⬅️ User left:', leftUser);
            })
            .error((err: unknown) => {
                console.error('❌ Presence channel error:', err);
            });

        return () => {
            window.Echo.leave('presence-online');
        };
    }, [user?.id]);

    // Message channel updates
    useEffect(() => {
        if (!user?.id) return;

        const messageChannel = window.Echo.private(`chat.${user.id}`);

        messageChannel.listen('.message.sent', (event: { message: Message }) => {
            const msg = event.message;
            setUsers((prev) =>
                prev
                    .map((u) => {
                        if (u.id === msg.sender_id || u.id === msg.receiver_id) {
                            return {
                                ...u,
                                lastMessage: msg.body,
                                lastMessageTime: msg.created_at,
                            };
                        }
                        return u;
                    })
                    .sort((a, b) => {
                        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                        return timeB - timeA;
                    }),
            );
        });

        return () => {
            window.Echo.leave(`chat.${user.id}`);
        };
    }, [user?.id]);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleUserSelect = (u: User) => {
        setSelectedUser(u);
        if (window.innerWidth < 768) closeSidebar();
    };

    const getUserInitial = (name: string) => name.charAt(0).toUpperCase();

    const getStatusColor = (status?: string) => (status === 'Online' ? 'bg-green-500' : 'bg-gray-400');

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-80 transform border-r border-gray-200/50 bg-white/95 shadow-xl backdrop-blur-lg transition-all duration-300 ease-in-out md:static md:flex md:translate-x-0 md:flex-col dark:border-gray-700/50 dark:bg-gray-800/95">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                        {getUserInitial(user?.name || 'User')}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-lg font-semibold">{user?.name}</h2>
                        <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                        </span>
                    </div>
                </div>
                <button className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700" onClick={closeSidebar}>
                    ✕
                </button>
            </div>

            {/* Search Bar */}
            <div className="border-b border-gray-200/50 p-4 dark:border-gray-700/50">
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-gray-600 dark:bg-gray-700/50"
                    />
                </div>
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-sm text-gray-500">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <p className="mb-2 text-sm text-red-500">{error}</p>
                        <button onClick={getUserList} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            Retry
                        </button>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">{searchTerm ? 'No users found' : 'No users available'}</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {filteredUsers.map((u) => (
                            <li
                                key={u.id}
                                onClick={() => handleUserSelect(u)}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                                    selectedUser?.id === u.id
                                        ? 'border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-purple-900/20'
                                        : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <div className="relative">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-lg font-bold text-white shadow">
                                        {u.profile_photo ? (
                                            <img
                                                src={u.profile_photo}
                                                alt={u.name}
                                                className="h-full w-full rounded-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.parentElement!.innerHTML = `<span>${getUserInitial(u.name)}</span>`;
                                                }}
                                            />
                                        ) : (
                                            <span>{getUserInitial(u.name)}</span>
                                        )}
                                    </div>
                                    <div
                                        className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(u.status)}`}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between">
                                        <span className="truncate font-medium text-gray-900 dark:text-white">{u.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{/* Optional last message time */}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="truncate text-xs text-gray-400">{u.email}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200/50 p-6 dark:border-gray-700/50">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
                >
                    <LogOut size={18} className="mr-2" /> Logout
                </button>
            </div>
        </div>
    );
};

export default ChatSidebar;


// import { useAuth } from '@/context/AuthContext';
// import { useSelectedUser } from '@/context/SelectedUserContext';
// import { useSidebar } from '@/context/SidebarContext';
// import api from '@/lib/axios';
// import { Loader2, LogOut, Search } from 'lucide-react';
// import React, { useEffect, useState } from 'react';

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     profile_photo: string | null;
//     status?: 'Online' | 'Offline';
//     lastMessage?: string;
//     lastMessageTime?: string;
//     created_at: string;
// }

// interface ChatSidebarProps {
//     onLogout: () => void;
// }

// const ChatSidebar: React.FC<ChatSidebarProps> = ({ onLogout }) => {
//     const { closeSidebar } = useSidebar();
//     const { user } = useAuth();
//     const { selectedUser, setSelectedUser } = useSelectedUser();
//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         getUserList();
//     }, []);

//     // Fetch all users initially
//     const getUserList = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const response = await api.get('/get-userlist');
//             if (response.data) {
//                 const userData = response.data.data.map((u: any) => ({
//                     id: u.id,
//                     name: u.name,
//                     email: u.email,
//                     profile_photo: u.profile_photo,
//                     status: 'Offline', // default, will be updated in real-time
//                     lastMessage: '',
//                     lastMessageTime: '',
//                     created_at: u.created_at,
//                 }));
//                 setUsers(userData);
//             } else {
//                 setError('Failed to fetch users');
//             }
//         } catch (err: any) {
//             console.error(err);
//             setError(err.response?.data?.message || 'Failed to fetch users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Real-time updates: presence + latest messages
//     useEffect(() => {
//         if (!user?.id) return;

//         // Join the presence channel
//         const presenceChannel = window.Echo.join('presence-online');

//         // Set initial online users
//         presenceChannel.here((onlineUsers: any[]) => {
//             setUsers((prev) =>
//                 prev.map((u) => ({
//                     ...u,
//                     status: onlineUsers.some((o) => o.id === u.id) ? 'Online' : 'Offline',
//                 })),
//             );
//             console.log('✅ Currently online users:', onlineUsers);
//         });

//         // When a new user joins
//         presenceChannel.joining((newUser: any) => {
//             setUsers((prev) => prev.map((u) => (u.id === newUser.id ? { ...u, status: 'Online' } : u)));
//             console.log('➡️ User joined:', newUser);
//         });

//         // When a user leaves
//         presenceChannel.leaving((leftUser: any) => {
//             setUsers((prev) => prev.map((u) => (u.id === leftUser.id ? { ...u, status: 'Offline' } : u)));
//             console.log('⬅️ User left:', leftUser);
//         });

//         // Error handling
//         presenceChannel.error((err: any) => {
//             console.error('❌ Presence channel error:', err);
//         });

//         return () => {
//             window.Echo.leave('presence-online');
//         };
//     }, [user?.id]);

//     useEffect(() => {
//         if (!user?.id) return;

//         // Presence channel for online/offline

//         //    presenceChannel.here((onlineUsers: any[]) => {
//         //         setUsers(prev =>
//         //             prev.map(u => ({
//         //                 ...u,
//         //                 status: onlineUsers.some(o => o.id === u.id) ? 'Online' : 'Offline',
//         //             }))
//         //         );
//         //     })
//         //     .joining((newUser: any) => {
//         //         setUsers(prev =>
//         //             prev.map(u => u.id === newUser.id ? { ...u, status: 'Online' } : u)
//         //         );
//         //     })
//         //     .leaving((leftUser: any) => {
//         //         setUsers(prev =>
//         //             prev.map(u => u.id === leftUser.id ? { ...u, status: 'Offline' } : u)
//         //         );
//         //     });

//         // Listen for incoming messages
//         const messageChannel = window.Echo.private(`chat.${user.id}`);
//         messageChannel.listen('.message.sent', (e: any) => {
//             const msg = e.message;
//             setUsers((prev) =>
//                 prev
//                     .map((u) => {
//                         if (u.id === msg.sender_id || u.id === msg.receiver_id) {
//                             return {
//                                 ...u,
//                                 lastMessage: msg.body,
//                                 lastMessageTime: msg.created_at,
//                             };
//                         }
//                         return u;
//                     })
//                     .sort((a, b) => {
//                         const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
//                         const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
//                         return timeB - timeA;
//                     }),
//             );
//         });

//         return () => {
//             window.Echo.leave('presence');
//             window.Echo.leave(`chat.${user.id}`);
//         };
//     }, [user?.id]);

//     const filteredUsers = users.filter(
//         (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()),
//     );

//     const handleUserSelect = (u: User) => {
//         setSelectedUser(u);
//         if (window.innerWidth < 768) closeSidebar();
//     };

//     const getUserInitial = (name: string) => name.charAt(0).toUpperCase();

//     const getStatusColor = (status: string) => (status === 'Online' ? 'bg-green-500' : 'bg-gray-400');

//     return (
//         <div className="fixed inset-y-0 left-0 z-50 w-80 transform border-r border-gray-200/50 bg-white/95 shadow-xl backdrop-blur-lg transition-all duration-300 ease-in-out md:static md:flex md:translate-x-0 md:flex-col dark:border-gray-700/50 dark:bg-gray-800/95">
//             {/* Sidebar Header */}
//             <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-700/50">
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg">
//                         {getUserInitial(user?.name || 'User')}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                         <h2 className="truncate text-lg font-semibold">{user?.name}</h2>
//                         <span className="flex items-center gap-1 text-xs font-medium text-green-500">
//                             <span className="h-2 w-2 rounded-full bg-green-500"></span>
//                             Online
//                         </span>
//                     </div>
//                 </div>
//                 <button className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700" onClick={closeSidebar}>
//                     ✕
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="border-b border-gray-200/50 p-4 dark:border-gray-700/50">
//                 <div className="relative">
//                     <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search users..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-gray-600 dark:bg-gray-700/50"
//                     />
//                 </div>
//             </div>

//             {/* Users list Header */}
//             <div className="flex items-center justify-between px-4 pt-4">
//                 <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Contacts ({filteredUsers.length})</h3>
//                 <button
//                     onClick={getUserList}
//                     disabled={loading}
//                     className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
//                 >
//                     {loading ? 'Refreshing...' : 'Refresh'}
//                 </button>
//             </div>

//             {/* Users list */}
//             <div className="flex-1 overflow-y-auto p-4">
//                 {loading ? (
//                     <div className="flex flex-col items-center justify-center py-8">
//                         <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-500" />
//                         <p className="text-sm text-gray-500">Loading users...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="flex flex-col items-center justify-center py-8">
//                         <p className="mb-2 text-sm text-red-500">{error}</p>
//                         <button onClick={getUserList} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
//                             Retry
//                         </button>
//                     </div>
//                 ) : filteredUsers.length === 0 ? (
//                     <div className="py-8 text-center">
//                         <p className="text-sm text-gray-500">{searchTerm ? 'No users found' : 'No users available'}</p>
//                     </div>
//                 ) : (
//                     <ul className="space-y-2">
//                         {filteredUsers.map((u) => (
//                             <li
//                                 key={u.id}
//                                 onClick={() => handleUserSelect(u)}
//                                 className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
//                                     selectedUser?.id === u.id
//                                         ? 'border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-purple-900/20'
//                                         : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
//                                 }`}
//                             >
//                                 <div className="relative">
//                                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-lg font-bold text-white shadow">
//                                         {u.profile_photo ? (
//                                             <img
//                                                 src={u.profile_photo}
//                                                 alt={u.name}
//                                                 className="h-full w-full rounded-full object-cover"
//                                                 onError={(e) => {
//                                                     const target = e.target as HTMLImageElement;
//                                                     target.style.display = 'none';
//                                                     target.parentElement!.innerHTML = `<span>${getUserInitial(u.name)}</span>`;
//                                                 }}
//                                             />
//                                         ) : (
//                                             <span>{getUserInitial(u.name)}</span>
//                                         )}
//                                     </div>
//                                     <div
//                                         className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(u.status || 'Offline')}`}
//                                     />
//                                 </div>
//                                 <div className="min-w-0 flex-1">
//                                     <div className="flex items-start justify-between">
//                                         <span className="truncate font-medium text-gray-900 dark:text-white">{u.name}</span>
//                                         <span className="text-xs text-gray-500 dark:text-gray-400">{/* Optional last message time */}</span>
//                                     </div>
//                                     <div className="flex items-center justify-between">
//                                         <span className="truncate text-xs text-gray-400">{u.email}</span>
//                                     </div>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {/* Logout */}
//             <div className="border-t border-gray-200/50 p-6 dark:border-gray-700/50">
//                 <button
//                     onClick={onLogout}
//                     className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
//                 >
//                     <LogOut size={18} className="mr-2" /> Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatSidebar;
