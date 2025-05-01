


"use client"

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { baseUrl } from "@/shared/base";

interface Task {
  id: number;
  assigned_by: string;
  assigned_to: string;
  task: string;
  status: "assigned" | "pending" | "completed";
}

export default function Home() {
  
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (typeof window !== "undefined") {
      router.push("/get-tasks");
    }
  }, [router]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/task/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };



  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/task/update-status`, {
        task_id: taskId,
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Status updated successfully", response.data);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update task status");
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <Link replace href="/create-task">
            <button
              type="button"
              className="w-3xs py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </Link>
          <h1 className="text-2xl font-semibold">Task List</h1>
        </div>

        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full border border-gray-300 text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b">Sl No</th>
                <th className="py-2 px-4 border-b">Assigned By</th>
                <th className="py-2 px-4 border-b">Assigned To</th>
                <th className="py-2 px-4 border-b">Task</th>
                <th className="py-2 px-4 border-b">Update Status</th>
                <th className="py-2 px-4 border-b">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{task.assigned_by}</td>
                  <td className="py-2 px-4 border-b">{task.assigned_to}</td>
                  <td className="py-2 px-4 border-b">{task.task}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      defaultValue={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      task.status === "assigned" ? "bg-green-100 text-green-700" :
                      task.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
