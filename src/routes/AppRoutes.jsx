import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import Courses from '../pages/Courses'
import Enrollments from '../pages/Enrollments'

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollments" element={<Enrollments />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes