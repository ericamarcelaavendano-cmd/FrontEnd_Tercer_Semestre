import { useEffect, useState } from 'react'
import { getCourses, buscarCursosPorNombre } from '../services/courseService'
import Footer from '../components/Footer'

const columnas = [
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'max_capacity', label: 'Capacidad máxima' },
]

function Courses() {
  const [courses, setCourses] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    async function buscar() {
      setCargando(true)
      const data = busqueda.trim() === ''
        ? await getCourses()
        : await buscarCursosPorNombre(busqueda)
      setCourses(data)
      setCargando(false)
    }

    const timeoutId = setTimeout(buscar, 400)
    return () => clearTimeout(timeoutId)
  }, [busqueda])

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
          <p className="text-slate-500 text-sm">Cursos registrados en Supabase</p>
        </div>
        <button className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600">
          + Nuevo Curso
        </button>
      </header>

      <main>
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                {columnas.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                ))}
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((curso) => (
                <tr key={curso.id} className="border-t border-slate-100">
                  {columnas.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-600">{curso[col.key]}</td>
                  ))}
                  <td className="px-4 py-3">
                    <button className="text-sky-600 hover:underline mr-3">Editar</button>
                    <button className="text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!cargando && courses.length === 0 && (
            <p className="text-center text-slate-400 py-6 text-sm">No se encontraron cursos.</p>
          )}
          {cargando && (
            <p className="text-center text-slate-400 py-6 text-sm">Cargando...</p>
          )}
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Courses