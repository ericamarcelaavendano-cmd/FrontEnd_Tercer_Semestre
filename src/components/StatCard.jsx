function StatCard({ title, total }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-sky-500 p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-4xl font-bold text-slate-800 mt-2">{total}</p>
    </div>
  )
}

export default StatCard