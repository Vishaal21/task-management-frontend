"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { baseUrl } from '@/shared/base';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


interface TaskData {
  title: string;
  description: string;
  assigned_to: number;
}

const initialTask: TaskData = {
  title: '',
  description: '',
  assigned_to: 0,
};

interface User {
  id: number;
  name: string;
  email: string;
}

function CreateTask() {
  const [task, setTask] = useState<TaskData>(initialTask);
  const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks(token);
    }
  }, [router]);



  const fetchTasks = async (token: string) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/task/get-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Tasks fetched:', response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (task: TaskData) => {
    const token = localStorage.getItem("token");
    console.log("task data:", task);
    try {
      const response = await axios.post(`${baseUrl}/api/v1/task/create`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Task created successfully!");
        setTask(initialTask);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const response = await axios.get(`${baseUrl}/api/v1/user/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUsers = response.data.users;
      setUsers(fetchedUsers);

      // Set assigned_to default to first user's ID
      if (fetchedUsers.length > 0) {
        setTask((prevTask) => ({
          ...prevTask,
          assigned_to: fetchedUsers[0].id,
        }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
    }
  };
  useEffect(() => {


    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 sm:p-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create New Task
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask(task);
          }}
          className="space-y-6"
        >
          <div>
            <Link replace href="/">
              <button
                type="button"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                Back to Home
              </button>
            </Link>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              required
              type="text"
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              required
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 placeholder-gray-400"
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div>
            <label
              htmlFor="assigned_to"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned To
            </label>
            <select
              required
              id="assigned_to"
              value={task.assigned_to}
              onChange={(e) =>
                setTask({ ...task, assigned_to: Number(e.target.value) })
              }
              className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 bg-white"
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Create Task
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          background: "#fff",
          color: "#333",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}

export default CreateTask;
