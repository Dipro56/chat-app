import { Head, Link } from '@inertiajs/react';
import { MessageCircle, LogIn, UserPlus } from "lucide-react";


export default function Welcome() {
    return (
        <>
            <Head title="Chat Home" />

            <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10 flex flex-col items-center">
                {/* Header */}
                <header className="w-full max-w-6xl flex items-center justify-between py-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Chat<span className="text-indigo-600">Sphere</span>
                    </h1>

                    <nav className="flex items-center gap-4">
                        <Link  href="/register" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm">
                            <UserPlus size={18} /> Sign Up
                        </Link>
                        <Link href="/login" className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
                            <LogIn size={18} /> Login
                        </Link>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-14 gap-14">
                    <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
                        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Connect. Chat. <span className="text-indigo-600">Belong.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md">
                            Your conversations, elevated. Fast, secure, and beautifully designed messaging for everyone.
                        </p>


                    </div>

                    {/* Illustration */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 backdrop-blur-md shadow-2xl flex items-center justify-center p-8">
                            <MessageCircle size={140} className="text-indigo-600 drop-shadow-xl" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full max-w-6xl mt-24 grid md:grid-cols-3 gap-8">
                    {[{
                        title: "Secure Messaging",
                        desc: "End-to-end encryption ensures your conversations stay private.",
                    },{
                        title: "Real-Time Sync",
                        desc: "Instant message delivery across all your devices.",
                    },{
                        title: "Elegant Interface",
                        desc: "A polished and modern design focused on simplicity.",
                    }].map((f, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
                            <h3 className="text-2xl font-semibold mb-3 text-indigo-600">{f.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
