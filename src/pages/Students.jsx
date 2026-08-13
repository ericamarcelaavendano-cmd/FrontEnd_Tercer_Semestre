import { useEffect, useState } from 'react'
import { getStudents, buscarEstudiantesPorNombre } from '../services/studentService'
import Footer from '../components/Footer'

function Students() {
  const [students, setStudents] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Carga inicial: trae todos los estudiantes al abrir la página
  useEffect(() => {
    async function cargarEstudiantes() {
      setCargando(true)
      const data = await getStudents()
      setStudents(data)
      setCargando(false)
    }
    cargarEstudiantes()
  }, [])

  // Se ejecuta cada vez que el usuario escribe en el buscador
  useEffect(() => {
    async function buscar() {
      setCargando(true)
      const data = busqueda.trim() === ''
        ? await getStudents()
        : await buscarEstudiantesPorNombre(busqueda)
      setStudents(data)
      setCargando(false)
    }

    // Pequeño retraso para no consultar Supabase en cada tecla presionada
    const timeoutId = setTimeout(buscar, 400)
    return () => clearTimeout(timeoutId)
  }, [busqueda])

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm">Estudiantes registrados</p>
        </div>
        <button className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600">
          + Nuevo Estudiante
        </button>
      </header>

      <main>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Apellido</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Fecha de nacimiento</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((est) => (
                <tr key={est.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{est.first_name}</td>
                  <td className="px-4 py-3">{est.last_name}</td>
                  <td className="px-4 py-3 text-slate-500">{est.email}</td>
                  <td className="px-4 py-3 text-slate-500">{est.birth_date}</td>
                  <td className="px-4 py-3">
                    <button className="text-sky-600 hover:underline mr-3">Editar</button>
                    <button className="text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!cargando && students.length === 0 && (
            <p className="text-center text-slate-400 py-6 text-sm">No se encontraron estudiantes.</p>
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

export default Students