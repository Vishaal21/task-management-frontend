"use client"

import { baseUrl } from '@/shared/base';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Credentials{
  email:string,
  password:string
}

const initialState:Credentials={
  email:"",
  password:""
}

function Login() {
  const [credentials, setCredentials]=useState<Credentials>(initialState);
  const router = useRouter();
  
  const LoginFunction = async (credentials:Credentials) => {
    try{
      const response = await axios.post(`${baseUrl}/api/v1/user/login`,credentials);
      if(response.status===200 || response.status===201){
        const token = response.data.accessToken;
        console.log("token",token);
        localStorage.setItem('token', token);
        router.push("/get-tasks");
      }
    }
    catch(error:any){
      alert(error.response.data.message || "Wrong Credentials")
    }
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    className="flex h-dvh items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <form onSubmit={(e)=>{e.preventDefault();
          console.log(credentials);
          LoginFunction(credentials)
        }} className="space-y-4">
          <Link href='/adduser'>
          <button
            
            type='button'
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Add User
          </button>
          </Link>
          <div className='mt-2'>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              onChange={(e)=>{
                setCredentials(prev=>(
                  {
                    ...prev,
                    email:e.target.value
                  }
                ))
              }}
              value={credentials.email}
              required
              type="email"
              id="email"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={(e)=>{
                setCredentials(prev=>(
                  {
                    ...prev,
                    password:e.target.value
                  }
                ))
              }}
              value={credentials.password}
              required
              type="password"
              id="password"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            Sign in
          </button>
          
        </form>
      </div>
    </motion.div>
  );
}

export default Login;
