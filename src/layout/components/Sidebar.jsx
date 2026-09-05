import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ClipboardList } from 'lucide-react';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive
        ? 'bg-sky-500 text-white shadow-sm'
        : 'text-slate-200 hover:bg-slate-700/50 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col border-r border-slate-700 p-6">
      {/* Título de la aplicación */}
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide text-white">Gestión Académica</h2>
      </div>

      {/* Menú de navegación */}
      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/" end className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/students" className={linkClass}>
          <Users size={20} />
          Students
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          <BookOpen size={20} />
          Courses
        </NavLink>
        <NavLink to="/enrollments" className={linkClass}>
          <ClipboardList size={20} />
          Enrollments
        </NavLink>
      </nav>
    </aside>
  );
}