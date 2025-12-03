import { Head } from '@inertiajs/react';
import { MessageCircle, LogIn, UserPlus } from "lucide-react";

export default function Welcome() {
    return (
        <>
            <Head title="Chat Home" />

            <div className="min-h-screen w-full bg-[#F7F7F5] dark:bg-[#0b0b0b] text-[#1b1b18] dark:text-white px-6 py-10 flex flex-col items-center">
                {/* Header */}
                <header className="w-full max-w-5xl flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Chat<span className="text-blue-600">Sphere</span>
                    </h1>

                    <nav className="flex items-center gap-4">
                        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2">
                            <UserPlus size={18} /> Sign Up
                        </button>
                        <button className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center gap-2">
                            <LogIn size={18} /> Login
                        </button>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mt-10 gap-10">
                    <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Connect. Chat. <span className="text-blue-600">Belong.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md">
                            Your conversations, reimagined. Experience fast, secure, and effortless messaging with a clean modern interface.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
                            <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition flex items-center gap-2">
                                <MessageCircle size={20} /> Start Chatting
                            </button>
                            <button className="px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition font-medium">
                                Explore Features
                            </button>
                        </div>
                    </div>

                    {/* Illustration */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 backdrop-blur-sm shadow-xl flex items-center justify-center p-6">
                            <MessageCircle size={120} className="text-blue-600 drop-shadow-md" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full max-w-5xl mt-20 grid md:grid-cols-3 gap-6">
                    {[{
                        title: "Secure Messaging",
                        desc: "Your chats stay private with powerful end-to-end protection.",
                    },{
                        title: "Real-Time Sync",
                        desc: "Messages sync instantly across all your devices.",
                    },{
                        title: "Beautiful UI",
                        desc: "A clean and modern interface designed for effortless chatting.",
                    }].map((f, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#111] shadow-md border border-gray-200 dark:border-gray-800">
                            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
