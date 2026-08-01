import StatCard from '../components/StatCard'

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido al Sistema de Gestión de Cursos</p>

      <div className="flex gap-4 mt-4">
        <StatCard title="Students" total="50" />
        <StatCard title="Courses" total="12" />
        <StatCard title="Enrollments" total="145" />
      </div>
    </div>
  )
}

export default Dashboard