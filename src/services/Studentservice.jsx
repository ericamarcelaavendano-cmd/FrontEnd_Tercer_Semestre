import { supabase } from '../config/supabase'

export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener estudiantes:', error.message)
    return []
  }

  return data
}

// Busca un estudiante por su correo exacto
export async function buscarEstudiantePorCorreo(email) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('email', email)

  if (error) {
    console.error('Error al buscar estudiante:', error.message)
    return []
  }

  return data
}

// Busca estudiantes por coincidencia parcial de nombre o apellido (para el buscador en vivo)
export async function buscarEstudiantesPorNombre(texto) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or(`first_name.ilike.%${texto}%,last_name.ilike.%${texto}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al buscar estudiantes:', error.message)
    return []
  }

  return data
}
export async function createStudent(student) {
  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select()

  if (error) {
    console.error('Error al crear estudiante:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data: data[0] }
}