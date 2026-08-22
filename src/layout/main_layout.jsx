import React from 'react';
import { Outlet } from 'react-router-dom';
// Aquí importas tus componentes de navegación (Sidebar, Navbar, etc.)

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Aquí iría tu barra lateral o menú */}
      <aside className="w-64 bg-white border-r border-slate-200">
        <h2 className="p-6 font-bold text-xl text-slate-800">Academia</h2>
        {/* Tus enlaces de navegación */}
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior opcional */}
        
        {/* El Outlet es el espacio donde React Router carga la vista actual (Dashboard, Students, etc.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}