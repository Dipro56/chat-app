import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { LogOut, Menu } from "lucide-react";

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface Message {
    id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

export default function ChatInterface() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [users, setUsers] = useState<User[]>([
        { id: 2, name: "Alice", avatar: '' },
        { id: 3, name: "Bob", avatar: '' },
        { id: 4, name: "Charlie", avatar: '' },
    ]);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender_id: 2, content: "Hello!", created_at: "10:00 AM" },
        { id: 2, sender_id: user?.id || 1, content: "Hi Alice!", created_at: "10:01 AM" },
    ]);

    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        setMessages([
            ...messages,
            { id: messages.length + 1, sender_id: user?.id || 1, content: newMessage, created_at: new Date().toLocaleTimeString() },
        ]);
        setNewMessage("");
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:flex-col`}>

                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{user?.name}</h2>
                        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    {/* Users list */}
                    <div className="flex-1 overflow-y-auto p-2">
                        <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Users</h3>
                        <ul className="space-y-2">
                            {users.map((u) => (
                                <li key={u.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                        {u.avatar ? (
                                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                        ) : (
                                            <span>{u.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={logout}
                            className="flex items-center justify-center w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow"
                        >
                            <LogOut size={18} className="mr-2" /> Logout
                        </button>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col md:ml-0">

                    {/* Top Bar */}
                    <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold">Chat Interface</h1>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs p-3 rounded-xl ${msg.sender_id === user?.id ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                                    <p>{msg.content}</p>
                                    <span className="text-xs text-gray-400 mt-1 block">{msg.created_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="h-16 flex items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
