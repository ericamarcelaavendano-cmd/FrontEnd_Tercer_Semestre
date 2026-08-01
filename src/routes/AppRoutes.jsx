import { Routes, Route} from 'react-router-dom'


function AppRoutes() {
  return (
    <Routes>
   <Route path="/" element={<Dashboard />} />
   <Route path="/students" element={<Students />} />
    </Routes>
  )
}

export default AppRoutes