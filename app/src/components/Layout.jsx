import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div className="flex h-screen w-screen bg-gradient-animate overflow-hidden rounded-2xl">
      {/* Custom top bar — draggable, exit button only */}
      <TopBar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pt-10 px-6 pb-6">
        <Outlet />
      </main>
    </div>
  );
}
