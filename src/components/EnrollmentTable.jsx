const estiloEstado = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  COMPLETED: 'bg-sky-50 text-sky-700 border border-sky-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border border-rose-200',
}

function EstadoBadge({ status }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${estiloEstado[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

const columnas = [
  { label: 'Estudiante', render: (e) => `${e.students?.first_name ?? ''} ${e.students?.last_name ?? ''}` },
  { label: 'Curso', render: (e) => e.courses?.name ?? '' },
  { label: 'Fecha', render: (e) => e.enrollment_date },
  { label: 'Estado', render: (e) => <EstadoBadge status={e.status} /> },
]

function EnrollmentTable({ enrollments, cargando }) {
  if (cargando) {
    return <p className="text-center text-slate-400 py-6 text-sm">Cargando...</p>
  }

  if (enrollments.length === 0) {
    return <p className="text-center text-slate-400 py-6 text-sm">No se encontraron matrículas.</p>
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            {columnas.map((col) => (
              <th key={col.label} className="px-4 py-3 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((matricula) => (
            <tr key={matricula.id} className="border-t border-slate-100 hover:bg-slate-50/60">
              {columnas.map((col) => (
                <td key={col.label} className="px-4 py-3 text-slate-600">
                  {col.render(matricula)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EnrollmentTable