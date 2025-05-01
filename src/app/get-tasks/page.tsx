'use client';

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/shared/base";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

interface User {
  id: number;
  Name: string;
  Email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "active" | "assigned" | "pending" | "completed";
  assigned_to_user: User;
  assigned_by_user: User;
}

export default function GetTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("token");
  // Fetch tasks from API
  const fetchTasks = async (token: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/v1/task/get-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
      setLoading(false);
      console.log(res.data.tasks)
    } catch (error) {
      setError("Failed to fetch tasks. Please try again later.");
      setLoading(false);
      toast.error("Failed to fetch tasks.");
    }
  };

  // Check for token and fetch tasks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks(token);
    }
  }, [router]);



  // WebSocket connection for real-time task updates
/*   useEffect(() => {
    const socket = new WebSocket("wss://localhost:8080/ws");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle the task_created event
        if (data.event === "task_created") {
          toast.success(`New Task Created:\n${data.task_title} assigned to ${data.assigned_to_user}`);
          fetchTasks(localStorage.getItem("token") || "");  // Fetch tasks again when new task is created
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (err) => console.log(err)
    socket.onclose = () => console.warn("WebSocket closed");

    return () => {
      socket.close();  // Cleanup WebSocket on component unmount
    };
  }, []); */

  
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/task/update-status`, {
        task_id: taskId,
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("updated task status");
      
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update task status");
    }
    finally{
      fetchTasks(token as string);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-12 bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
          <Link href="/create-task">
            <button
              className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
              Create Task
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Sl No</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Assigned By</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Task</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Update Status</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{task.assigned_by_user.Name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{task.assigned_to_user.Name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{task.title}</td>
                    <td className="py-4 px-6">
                      <select
                        defaultValue={task.status}
                        onChange={(e) =>  updateTaskStatus(task.id, e.target.value)}
                        className="p-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      >
                        <option value=""></option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          task.status === "assigned"
                            ? "bg-green-100 text-green-800"
                            : task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}