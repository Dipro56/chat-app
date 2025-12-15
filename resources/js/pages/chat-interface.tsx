import ChatSidebar from '@/components/ChatSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useSelectedUser } from '@/context/SelectedUserContext';
import { useSidebar } from '@/context/SidebarContext';
import { getMessageTime } from '@/helper/CommonFunction';
import api from '@/lib/axios';
import { CheckCheck, Menu, MoreVertical, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    body: string;
    is_read: boolean;
    sender_id: number;
    receiver_id: number;
    created_at: string;
}

interface SocketMessageEvent {
    message: Message;
}

export default function ChatInterface() {
    const { user, logout } = useAuth();
    const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
    const { selectedUser } = useSelectedUser();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Fetch messages
    const fetchConversation = async () => {
        if (!selectedUser) return;
        try {
            const res = await api.get(`/messages/conversation/${selectedUser.id}`);
            if (res.data.status === 'success') setMessages(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser || sending) return;

        try {
            setSending(true);
            const res = await api.post('/messages/send', {
                receiver_id: selectedUser.id,
                body: newMessage.trim(),
            });

            if (res.data.status === 'success') {
                setNewMessage('');
                setMessages((prev) => [...prev, res.data.data]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
            scrollToBottom();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const playSound = () => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play();
    };

    useEffect(() => {
        if (!user?.id) return;

        const channel = window.Echo.private(`chat.${user.id}`)
            .subscribed(() => {
                console.log('✅ Subscribed to chat.' + user.id);
            })
            .error((error: unknown) => {
                console.error('❌ Subscription error:', error);
            });

        channel.listenToAll((event: string, data: SocketMessageEvent) => {
            console.log('🔥 EVENT:', event, data);
            if (data?.message?.receiver_id == user?.id) {
                playSound();
                setMessages((prev) => [...prev, data.message]);
                console.log('✅ SOCKET MESSAGE:', data.message);
            }
        });

        return () => {
            window.Echo.leave(`chat.${user.id}`);
        };
    }, [user?.id]);

    useEffect(() => {
        fetchConversation();
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ProtectedRoute>
            <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
                {sidebarOpen ? <ChatSidebar onLogout={logout} /> : null}

                {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeSidebar} />}
                <div className="flex flex-1 flex-col md:ml-0">
                    {selectedUser && user ? (
                        <>
                            {/* Top Bar */}
                            <div className="flex h-20 items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 shadow-sm backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/80">
                                <div className="flex items-center gap-4">
                                    <button className="rounded-xl p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700/50" onClick={toggleSidebar}>
                                        <Menu size={24} />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-lg font-bold text-white shadow">
                                            {selectedUser.profile_photo ? (
                                                <img
                                                    src={selectedUser.profile_photo}
                                                    alt={selectedUser.name}
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                selectedUser?.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser?.name}</h1>
                                          {selectedUser.status === 'Online' ? 'Online' : 'Offline'}

                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-transparent p-6 dark:from-gray-900/50 dark:to-transparent"
                            >
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                                        <div className={`max-w-lg ${msg.sender_id === user?.id ? 'ml-auto' : 'mr-auto'}`}>
                                            <div
                                                className={`rounded-2xl px-5 py-3 ${msg.sender_id === user?.id ? 'rounded-br-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'rounded-bl-none border border-gray-200/50 bg-white dark:border-gray-700/50 dark:bg-gray-800'} shadow-lg`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap md:text-base">{msg.body}</p>
                                                <div className="mt-2 flex items-center justify-end gap-2">
                                                    <span
                                                        className={`text-xs ${msg.sender_id === user?.id ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}
                                                    >
                                                        {getMessageTime(msg.created_at)}
                                                    </span>
                                                    {msg.sender_id === user?.id && (
                                                        <CheckCheck size={14} className={msg.is_read ? 'text-blue-300' : 'text-gray-400'} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-200/50 bg-white/80 px-6 py-4 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/80">
                                <div className="flex items-end gap-3">
                                    <div className="relative flex-1">
                                        <textarea
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value);
                                                // handleTyping();
                                            }}
                                            onKeyPress={handleKeyPress}
                                            rows={1}
                                            className="max-h-32 w-full resize-none rounded-2xl border border-gray-300/50 bg-gray-100/80 px-5 py-3 pr-12 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none dark:border-gray-600/50 dark:bg-gray-700/80"
                                            disabled={sending}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim() || sending}
                                            className={`absolute right-3 bottom-3 rounded-xl p-2 ${newMessage.trim() && !sending ? 'bg-indigo-600 hover:bg-indigo-700' : 'cursor-not-allowed bg-gray-400'} text-white`}
                                        >
                                            {sending ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Select a conversation</h2>
                            <p className="mb-8 text-gray-500 dark:text-gray-400">Choose a contact from the sidebar to start chatting</p>
                            <button
                                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white md:hidden"
                                onClick={toggleSidebar}
                            >
                                Open Contacts
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
