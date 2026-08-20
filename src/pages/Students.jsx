import { useEffect, useState } from 'react'
import { getStudents, buscarEstudiantesPorNombre } from '../services/studentService'
import Header from '../components/Header'
import StudentTable from '../components/StudentTable'
import Footer from '../components/Footer'

function Students() {
  const [students, setStudents] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    async function buscar() {
      setCargando(true)
      const data = busqueda.trim() === ''
        ? await getStudents()
        : await buscarEstudiantesPorNombre(busqueda)
      setStudents(data)
      setCargando(false)
    }

    const timeoutId = setTimeout(buscar, 400)
    return () => clearTimeout(timeoutId)
  }, [busqueda])

  return (
    <div>
      <Header
        title="Students"
        description="Estudiantes registrados"
        txtButton="+ Nuevo Estudiante"
      />

      <main className="px-6">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <StudentTable students={students} cargando={cargando} />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Students