import { supabase } from '../config/supabase'

// Trae todos los cursos, del más reciente al más antiguo
export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener cursos:', error.message)
    return []
  }

  return data
}

// Busca cursos por coincidencia parcial de nombre o código
export async function buscarCursosPorNombre(texto) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or(`name.ilike.%${texto}%,code.ilike.%${texto}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al buscar cursos:', error.message)
    return []
  }

  return data
}