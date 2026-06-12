import React, { useState } from 'react'
import { useSignup } from '../hooks/useSignup';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <form className='bg-white p-8 rounded-lg shadow-lg w-full sm:w-96' onSubmit={handleSubmit}>
                <h3 className='font-bold text-2xl text-center text-blue-600 mb-6'>
                    Sign Up
                </h3>

                <label className='block text-xl font-semibold text-gray-700 mb-2'>
                    Email:
                </label>
                <input
                    className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className='block text-xl font-semibold text-gray-700 mt-4 mb-2'>
                    Password:
                </label>
                <input
                    className='w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className='w-full py-2 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300'
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>

                {error && (
                    <div className='text-red-500 mt-4 text-center'>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default Signup;
