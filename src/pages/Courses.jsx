import { useEffect, useState } from 'react'
import { getCourses, buscarCursosPorNombre } from '../services/courseService'
import Header from '../components/Header'
import CourseTable from '../components/CourseTable'
import Footer from '../components/Footer'

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
      <Header
        title="Courses"
        description="Cursos registrados"
        txtButton="+ Nuevo Curso"
      />

      <main className="px-6">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <CourseTable courses={courses} cargando={cargando} />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Courses