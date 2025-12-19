import { useAuth } from '@/context/AuthContext';
import { Head, Link } from '@inertiajs/react';
import { LogIn, MessageCircle, UserPlus } from 'lucide-react';

export default function Welcome() {
    const { user } = useAuth();
    return (
        <>
            <Head title="Chat Home" />

            <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-6 py-10 text-gray-900 dark:bg-gray-900 dark:text-white">
                {/* Header */}
                <header className="flex w-full max-w-6xl items-center justify-between py-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Chat<span className="text-indigo-600">Sphere</span>
                    </h1>

                    <nav className="flex items-center gap-4">
                        {user ? (
                            <Link
                                href="/chat-interface"
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                <MessageCircle size={18} /> Home
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    <UserPlus size={18} /> Sign Up
                                </Link>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 shadow-sm transition hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <LogIn size={18} /> Login
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="mt-14 flex w-full max-w-6xl flex-col items-center justify-between gap-14 md:flex-row">
                    <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
                        <h2 className="text-5xl leading-tight font-extrabold md:text-6xl">
                            Connect. Chat. <span className="text-indigo-600">Belong.</span>
                        </h2>
                        <p className="max-w-md text-lg text-gray-600 dark:text-gray-300">
                            Your conversations, elevated. Fast, secure, and beautifully designed messaging for everyone.
                        </p>
                    </div>

                    {/* Illustration */}
                    <div className="flex flex-1 justify-center">
                        <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 shadow-2xl backdrop-blur-md dark:from-indigo-500/10 dark:to-purple-500/10">
                            <MessageCircle size={140} className="text-indigo-600 drop-shadow-xl" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mt-24 grid w-full max-w-6xl gap-8 md:grid-cols-3">
                    {[
                        {
                            title: 'Secure Messaging',
                            desc: 'End-to-end encryption ensures your conversations stay private.',
                        },
                        {
                            title: 'Real-Time Sync',
                            desc: 'Instant message delivery across all your devices.',
                        },
                        {
                            title: 'Elegant Interface',
                            desc: 'A polished and modern design focused on simplicity.',
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                        >
                            <h3 className="mb-3 text-2xl font-semibold text-indigo-600">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{f.desc}</p>
                        </div>
                    ))}
                </section>
            </div>
        </>
    );
}
