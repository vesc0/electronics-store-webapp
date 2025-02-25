"use client";

import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/login', { email, password }, { withCredentials: true })
      .then(() => {
        window.location.href = '/admin';
      })
      .catch(() => setError('Invalid email or password'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 via-black-300 to-gray-200 p-4">
      <div className="w-full max-w-sm p-8 rounded-lg shadow-lg backdrop-blur-md bg-white/60">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg px-4 py-2"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gray-800 text-white px-5 py-2 rounded-lg text-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default LoginPage;