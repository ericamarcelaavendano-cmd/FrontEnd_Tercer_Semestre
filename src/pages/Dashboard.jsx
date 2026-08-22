import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase.js';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Activity, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

// Componente StatCard
function StatCard({ title, total, icon: Icon, color = 'sky' }) {
  const estilos = {
    sky: { bar: 'bg-sky-500', text: 'text-sky-600' },
    violet: { bar: 'bg-violet-500', text: 'text-violet-600' },
    slate: { bar: 'bg-slate-500', text: 'text-slate-600' },
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-600' },
    rose: { bar: 'bg-rose-500', text: 'text-rose-600' },
  };

  const s = estilos[color] || estilos.sky;

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 p-5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className={`absolute top-0 left-0 h-1.5 w-full ${s.bar}`} />
      <div className="flex items-center gap-2 mt-1">
        {Icon && <Icon size={18} strokeWidth={2} className={s.text} />}
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
      <p className="text-3xl font-bold text-slate-800 mt-2">{total}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });

  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Totales de estudiantes y cursos
        const { count: studentsCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // 2. Obtener todas las matrículas
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('*')
          .order('enrollment_date', { ascending: false });

        const { data: studentsData } = await supabase.from('students').select('*');
        const { data: coursesData } = await supabase.from('courses').select('*');

        let activeCount = 0;
        let completedCount = 0;
        let cancelledCount = 0;

        if (enrollmentsData) {
          enrollmentsData.forEach(item => {
            const statusUpper = item.status?.toUpperCase();
            if (statusUpper === 'ACTIVE') activeCount++;
            if (statusUpper === 'COMPLETED') completedCount++;
            if (statusUpper === 'CANCELLED') cancelledCount++;
          });
        }

        setStats({
          students: studentsCount || 0,
          courses: coursesCount || 0,
          enrollments: enrollmentsData ? enrollmentsData.length : 0,
          active: activeCount,
          completed: completedCount,
          cancelled: cancelledCount
        });

        // 3. Mapeo seguro con los campos reales de tu esquema
        if (enrollmentsData && enrollmentsData.length > 0) {
          const formattedData = enrollmentsData.slice(0, 5).map(item => {
            const student = studentsData?.find(s => s.id === item.student_id);
            const firstName = student?.first_name || '';
            const lastName = student?.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim() || 'Estudiante';

            const course = coursesData?.find(c => c.id === item.course_id);
            const courseTitle = course?.name || 'Curso';

            return {
              id: item.id,
              student: fullName,
              course: courseTitle,
              date: item.enrollment_date || 'Sin fecha',
              status: item.status?.toUpperCase() || 'ACTIVE'
            };
          });

          setRecentEnrollments(formattedData);
        } else {
          setRecentEnrollments([]);
        }

      } catch (error) {
        console.error("Error general cargando el dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Bienvenido al Sistema de Gestión Académica</p>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard title="Students" total={stats.students} icon={Users} color="sky" />
        <StatCard title="Courses" total={stats.courses} icon={BookOpen} color="emerald" />
        <StatCard title="Enrollments" total={stats.enrollments} icon={ClipboardList} color="violet" />
        <StatCard title="Active" total={stats.active} icon={Activity} color="emerald" />
        <StatCard title="Completed" total={stats.completed} icon={CheckCircle} color="amber" />
        <StatCard title="Cancelled" total={stats.cancelled} icon={XCircle} color="rose" />
      </div>

      {/* Sección de la Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Enrollments</h3>
        
        {loading ? (
          <p className="text-sm text-slate-400 py-4 text-center">Cargando datos desde Supabase...</p>
        ) : recentEnrollments.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No hay inscripciones registradas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentEnrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {item.student.charAt(0)}
                      </div>
                      {item.student}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.course}</td>
                    <td className="py-3 px-4 text-slate-500">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold inline-block ${
                        item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        item.status === 'COMPLETED' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                        'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}