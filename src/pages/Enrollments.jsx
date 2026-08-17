import { useEffect, useState } from 'react'
import { getEnrollments } from '../services/enrollmentService'
import Header from '../components/Header'
import EnrollmentTable from '../components/EnrollmentTable'
import Footer from '../components/Footer'

function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const data = await getEnrollments()
      setEnrollments(data)
      setCargando(false)
    }
    cargar()
  }, [])

  const enrollmentsFiltradas = enrollments.filter((e) => {
    const coincideEstado = filtroEstado === 'TODOS' || e.status === filtroEstado
    const nombreCompleto = `${e.students?.first_name ?? ''} ${e.students?.last_name ?? ''}`.toLowerCase()
    const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  return (
    <div>
      <Header title="Enrollments" description="Matrículas registradas" txtButton="+ Nueva Matrícula" />

      <main className="px-6">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por estudiante..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <EnrollmentTable enrollments={enrollmentsFiltradas} cargando={cargando} />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Enrollments