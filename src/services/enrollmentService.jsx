import { supabase } from '../config/supabase'

export async function getEnrollments() {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      enrollment_date,
      status,
      students ( first_name, last_name ),
      courses ( name, code )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener matrículas:', error.message)
    return []
  }

  return data
}