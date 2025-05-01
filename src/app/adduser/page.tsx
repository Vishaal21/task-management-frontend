"use client"

import { baseUrl } from '@/shared/base';
import axios from 'axios';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  email: string;
  password: string;
}

const initialUser: UserData = {
  name: '',
  email: '',
  password: ''
};

function AddUser() {
  const [user, setUser] = useState<UserData>(initialUser);

  const handleAddUser = async (user: UserData) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/add`, user);
      if (response.status === 200 || response.status === 201) {
        alert("User added successfully!");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.3 }}
    className="flex h-dvh items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser(user);
          }}
          className="space-y-4"
        >
          <Link replace href="/login">
            <button
              type="button"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </Link>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              required
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Vishal"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="vishal@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Add User
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default AddUser;
