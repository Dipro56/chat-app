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
    id: number;
    content: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    time: string;
    date: string;
    sender: {
        id: number;
        name: string;
        profile_photo: string | null;
    };
    receiver: {
        id: number;
        name: string;
        profile_photo: string | null;
    };
    is_own: boolean;
}

export default function ChatInterface() {
    const { user, logout } = useAuth();
    const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
    const { selectedUser } = useSelectedUser();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [conversationList, setConversationList] = useState();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Fetch messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            fetchConversation();
        } else {
            setMessages([]);
            setPage(1);
            setHasMore(true);
            setInitialLoadDone(false);
        }
    }, [selectedUser]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (initialLoadDone) scrollToBottom();
    }, [messages, initialLoadDone]);

    const fetchConversation = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const res = await api.get(`/messages/conversation/${selectedUser.id}`);

            console.log('res', res);
            if (res?.data?.status == 'success') {
                const conversations = res?.data?.data;
                setConversationList(conversations);
            }
            setInitialLoadDone(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser || sending) return;

        try {
            setSending(true);
            const res = await api.post('/messages/send', {
                receiver_id: selectedUser.id,
                body: newMessage.trim(),
            });

            if (res?.data?.status == 'success') {
                setNewMessage('')
                fetchConversation();
            }

            fetchConversation();
        } catch (err) {
            console.error(err);
            alert('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop === 0 && hasMore && !loading) fetchConversation(true);
    };

    // Group messages by date
    const groupedMessages: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
        const date = new Date(msg?.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        if (!groupedMessages[date]) groupedMessages[date] = [];
        groupedMessages[date].push(msg);
    });

    return (
        <ProtectedRoute>
            <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
                <ChatSidebar onLogout={logout} />
                {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeSidebar} />}

                <div className="flex flex-1 flex-col md:ml-0">
                    {selectedUser ? (
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
                                                selectedUser.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.name}</h1>
                                            <span
                                                className={`text-sm ${selectedUser.status === 'Online' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                                            >
                                                {selectedUser.status === 'Online' ? 'Online' : `Last seen`}
                                            </span>
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
                                onScroll={handleScroll}
                                className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-transparent p-6 dark:from-gray-900/50 dark:to-transparent"
                            >
                                {hasMore && messages.length > 0 && (
                                    <div className="mb-4 flex justify-center">
                                        <button
                                            onClick={() => fetchConversation(true)}
                                            disabled={loading}
                                            className="rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        >
                                            {loading ? 'Loading older messages...' : 'Load older messages'}
                                        </button>
                                    </div>
                                )}

                                {conversationList?.map((msg) => (
                                    <div
                                        key={msg.id}
                                        data-message-id={msg.id}
                                        className={`flex ${msg.sender_id == user.id ? 'justify-end' : 'justify-start'} mb-2`}
                                    >
                                        <div className={`max-w-lg ${msg.sender_id == user.id ? 'ml-auto' : 'mr-auto'}`}>
                                            <div
                                                className={`rounded-2xl px-5 py-3 ${msg.sender_id == user.id ? 'rounded-br-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'rounded-bl-none border border-gray-200/50 bg-white dark:border-gray-700/50 dark:bg-gray-800'} shadow-lg`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap md:text-base">{msg.body}</p>
                                                <div className="mt-2 flex items-center justify-end gap-2">
                                                    <span
                                                        className={`text-xs ${msg.sender_id == user.id ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}
                                                    >
                                                        {getMessageTime(msg.created_at)}
                                                    </span>
                                                    {msg.sender_id == user.id && (
                                                        <CheckCheck size={14} className={msg.is_read ? 'text-blue-300' : 'text-gray-400'} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* {Object.entries(groupedMessages).map(([date, groupMsgs]) => (
                                    <div key={date}>
                                        <div className="my-4 flex justify-center">
                                            <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                {date}
                                            </span>
                                        </div>
                                        {groupMsgs.map((msg) => (
                                            <div
                                                key={msg.id}
                                                data-message-id={msg.id}
                                                className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'} mb-2`}
                                            >
                                                <div className={`max-w-lg ${msg.is_own ? 'ml-auto' : 'mr-auto'}`}>
                                                    <div
                                                        className={`rounded-2xl px-5 py-3 ${msg.is_own ? 'rounded-br-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'rounded-bl-none border border-gray-200/50 bg-white dark:border-gray-700/50 dark:bg-gray-800'} shadow-lg`}
                                                    >
                                                        <p className="text-sm whitespace-pre-wrap md:text-base">{msg.body}</p>
                                                        <div className="mt-2 flex items-center justify-end gap-2">
                                                            <span
                                                                className={`text-xs ${msg.is_own ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}
                                                            >
                                                                {msg.time}
                                                            </span>
                                                            {msg.is_own && (
                                                                <CheckCheck size={14} className={msg.is_read ? 'text-blue-300' : 'text-gray-400'} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))} */}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-200/50 bg-white/80 px-6 py-4 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/80">
                                <div className="flex items-end gap-3">
                                    <div className="relative flex-1">
                                        <textarea
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
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
