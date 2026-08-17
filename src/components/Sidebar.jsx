import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ClipboardList, ShieldCheck } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/enrollments', label: 'Enrollments', icon: ClipboardList },
]

// Dato simulado por ahora — se reemplaza por el usuario real cuando se implemente autenticación
const usuarioActual = {
  nombre: 'Erica Avendaño',
  rol: 'Administrador', // o 'Docente'
}

function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-white p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-6 whitespace-nowrap">Gestión Académica</h2>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-500 text-slate-900 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Conectado
        </div>
        <p className="text-sm font-medium">{usuarioActual.nombre}</p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
          <ShieldCheck size={12} />
          {usuarioActual.rol}
        </p>
      </div>
    </aside>
  )
}

export default Sidebar