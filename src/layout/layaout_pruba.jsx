import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Barra de navegación lateral fija */}
      <Sidebar />

      {}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}