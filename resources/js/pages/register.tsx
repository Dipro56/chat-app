import api from '@/lib/axios';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/register', {
                name: form.name,
                email: form.email,
                password: form.password,
            });

            if (response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }

            router.visit('/chat-interface');
        } catch (error: unknown) {
            console.log(error);
            alert('Registration failed!');
        }
    };

    return (
        <>
            <Head title="Sign Up" />
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 text-gray-900 dark:bg-gray-900 dark:text-white">
                <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-8 flex flex-col items-center">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Join us and start chatting instantly</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
