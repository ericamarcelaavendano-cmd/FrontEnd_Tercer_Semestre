function StatCard({ title, total, icon: Icon, color = 'sky' }) {
  const estilos = {
    sky: { bar: 'bg-sky-500', text: 'text-sky-600' },
    violet: { bar: 'bg-violet-500', text: 'text-violet-600' },
    slate: { bar: 'bg-slate-500', text: 'text-slate-600' },
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-600' },
    rose: { bar: 'bg-rose-500', text: 'text-rose-600' },
  }

  const s = estilos[color]

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 p-5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className={`absolute top-0 left-0 h-1.5 w-full ${s.bar}`} />

      <div className="flex items-center gap-2 mt-1">
        {Icon && <Icon size={16} strokeWidth={2} className={s.text} />}
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>

      <p className="font-display text-3xl font-bold text-slate-800 mt-2">{total}</p>
    </div>
  )
}

export default StatCard