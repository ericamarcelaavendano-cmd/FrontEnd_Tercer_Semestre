function Header({ title, description, txtButton }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {txtButton}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header