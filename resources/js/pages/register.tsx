import api from '@/lib/axios';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { router } from "@inertiajs/react";




export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await api.post("/register", {
            name: form.name,
            email: form.email,
            password: form.password,
        });

        if (response.data.data.token) {
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.data));
        }

        router.visit("/chat-interface");
    } catch (error: any) {
        console.log(error.response?.data);
        alert("Registration failed!");
    }
};


    return (
        <>
            <Head title="Sign Up" />
            <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 border border-gray-200 dark:border-gray-700">

                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-3xl font-bold">Create Account</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Join us and start chatting instantly</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl font-semibold shadow-md">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                        Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
