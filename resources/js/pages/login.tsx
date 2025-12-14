import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Head, Link, router } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth(); // from AuthContext

    const getCsrf = async () => {
        await fetch('http://localhost:8000/sanctum/csrf-cookie', {
            credentials: 'include', // important!
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await getCsrf();

        try {
            await api.post('/login', {
                email: form.email,
                password: form.password,
            });

            const me = await api.get('/me');
            console.log('meme', me, me.data);
            login(me.data);

            router.visit('/chat-interface');
        } catch (error: any) {
            console.log(error.response?.data);
            alert('Login failed! Check your email or password.');
        }
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 text-gray-900 dark:bg-gray-900 dark:text-white">
                <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-8 flex flex-col items-center">
                        <LogIn size={42} className="mb-3 text-indigo-600" />
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Login to continue your conversations</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700">
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-indigo-600 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
