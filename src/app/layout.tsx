'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { websocketUrl } from "@/shared/base";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();



  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (!token) {
      if(pathname==="/login"){
        return;
      }
      alert("Kindly Login to access this page");
      return;
    }
  }, [pathname]);
  useEffect(() => {

    
    const ws = new WebSocket(`${websocketUrl}/ws`);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        
        // Handle task_created event
        if (data.event === "task_created") {
          toast.success(`New task created: ${data.title} assigned to ${data.assigned_to}`);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      // Optionally implement reconnection logic here
    };
    
    return () => {
      ws.close();
    };
  }, [pathname]);

  return (
    <html lang="en">
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-indigo-600 text-white p-4 shadow">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <Toaster />
            <h1 className="text-lg font-bold">TaskManager</h1>
            <ul className="flex space-x-6 text-sm">
              <li><Link href="/create-task" className="hover:underline">Create Task</Link></li>
              <li><Link href="/get-tasks" className="hover:underline">Task List</Link></li>
              {isLoggedIn && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:underline text-red-200"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </body>
    </html>
  );
}
