import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Users, BookOpen, ClipboardList, Activity, CheckCircle2, XCircle } from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import Footer from '../components/Footer'

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    cancelledEnrollments: 0,
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true })
        const { count: totalCourses } = await supabase.from('courses').select('*', { count: 'exact', head: true })
        const { count: totalEnrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true })
        const { count: activeEnrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')
        const { count: completedEnrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED')
        const { count: cancelledEnrollments } = await supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'CANCELLED')

        setStats({
          totalStudents: totalStudents ?? 0,
          totalCourses: totalCourses ?? 0,
          totalEnrollments: totalEnrollments ?? 0,
          activeEnrollments: activeEnrollments ?? 0,
          completedEnrollments: completedEnrollments ?? 0,
          cancelledEnrollments: cancelledEnrollments ?? 0,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setCargando(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div>
      <Header title="Dashboard" description="Bienvenido al Sistema de Gestión Académica" txtButton="" />

      <main className="px-6">
        {cargando ? (
          <p className="text-slate-400 text-sm">Cargando estadísticas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard title="Students" total={stats.totalStudents} icon={Users} color="sky" />
            <StatCard title="Courses" total={stats.totalCourses} icon={BookOpen} color="violet" />
            <StatCard title="Enrollments" total={stats.totalEnrollments} icon={ClipboardList} color="slate" />
            <StatCard title="Active" total={stats.activeEnrollments} icon={Activity} color="emerald" />
            <StatCard title="Completed" total={stats.completedEnrollments} icon={CheckCircle2} color="amber" />
            <StatCard title="Cancelled" total={stats.cancelledEnrollments} icon={XCircle} color="rose" />
          </div>
        )}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Dashboard