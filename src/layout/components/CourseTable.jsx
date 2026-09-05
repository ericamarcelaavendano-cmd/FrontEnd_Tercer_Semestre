const columnas = [
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'max_capacity', label: 'Capacidad máxima' },
]

function CourseTable({ courses, cargando }) {
  if (cargando) {
    return <p className="text-center text-slate-400 py-6 text-sm">Cargando...</p>
  }

  if (courses.length === 0) {
    return <p className="text-center text-slate-400 py-6 text-sm">No se encontraron cursos.</p>
  }

  return (
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
    </div>
  )
}

export default CourseTable