import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-slate-900 text-white p-4 flex flex-col">
     <h2 className="text-lg font-bold mb-6 whitespace-nowrap">Gestión de cursos</h2>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-sky-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-sky-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`
          }
        >
          Students
        </NavLink>

        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-sky-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`
          }
        >
          Courses
        </NavLink>

        <NavLink
          to="/enrollments"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? 'bg-sky-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`
          }
        >
          Enrollments
        </NavLink>
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <p className="text-sm font-medium">Erica Avendaño</p>
        <p className="text-xs text-slate-400">Estudiante · Cesde</p>
      </div>
    </aside>
  )
}

export default Sidebar