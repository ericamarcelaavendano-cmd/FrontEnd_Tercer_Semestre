# Clase 02 — Conexión con Supabase 

**Proyecto:** Sistema de Gestión de Cursos ("Gestión Académica")
**Estudiante:** Bella
**Docente:** Luis Alberto Goenaga
**Tecnologías:** React + Vite + Tailwind CSS + React Router + Supabase (`@supabase/supabase-js`)

---

## 1. Introducción

Este documento registra el trabajo realizado para conectar el frontend construido en la Clase 01 con una base de datos real en **Supabase**, reemplazando los datos simulados que existían hasta ese momento. Parte de este trabajo se adelantó por cuenta propia antes de la clase oficial con el docente, siguiendo el **Instructivo Maestro** entregado junto con la guía de la Clase 01.

## 2. Alcance

Este documento cubre: la creación del proyecto en Supabase, el diseño y creación de las 3 tablas del sistema, la configuración segura de la conexión desde React, la construcción de un servicio de datos (`studentService.js`) y su conexión con la página `Students.jsx`, incluyendo un buscador en tiempo real contra la base de datos.

**Nota importante:** el Dashboard **no se modificó** en esta sesión. Se exploró en clase cómo el docente estaba estructurando su versión (usando `try/catch` y conteos reales), y se dejó preparado el conocimiento para implementarlo, pero se decidió mantener el Dashboard con datos simulados por el momento, a la espera de resolver dudas puntuales directamente con el profesor.

## 3. Objetivos

- Crear una cuenta y un proyecto en Supabase.
- Diseñar y crear las tablas `students`, `courses` y `enrollments`, con sus relaciones (foreign keys).
- Insertar datos de prueba y verificar las relaciones entre tablas.
- Configurar la conexión entre React y Supabase de forma segura, usando variables de entorno.
- Construir el primer servicio de datos (`studentService.js`) y conectarlo a la página `Students.jsx`.
- Implementar un buscador en tiempo real que consulte directamente la base de datos.
- Comprender la sintaxis básica de consultas SQL y su equivalente en la librería `supabase-js`.

---

## 4. ¿Qué es Supabase y cómo encaja en el proyecto?

Supabase es una plataforma que ofrece una base de datos PostgreSQL en la nube junto con herramientas para conectarse a ella fácilmente desde el frontend, sin necesidad de programar un backend propio todavía. Cumple el rol de **backend temporal**, mientras más adelante en el curso se aprende a construir el backend real con Spring Boot.

### Flujo de datos, de punta a punta

```
Usuario interactúa con la página (ej. escribe en el buscador de Students)
        │
        ▼
Students.jsx (página) llama a...
        │
        ▼
studentService.js  → funciones que hablan con Supabase
        │
        ▼
config/supabase.js  → conexión ya configurada (URL + key)
        │
        ▼
Supabase (base de datos en la nube) → devuelve los datos reales
        │
        ▼
Students.jsx recibe los datos y actualiza la tabla en pantalla
```

**Por qué se separan los "servicios" de las "páginas":** si en el futuro el proyecto migra de Supabase a Spring Boot, solo habría que reescribir los archivos de `services/`; el resto de la aplicación (páginas, componentes) no necesita cambiar, porque no habla directamente con la base de datos.

---

## 5. Creación del proyecto en Supabase

1. Registro en https://supabase.com
2. Creación de un nuevo proyecto (nombre, contraseña de base de datos, región)
3. Obtención de las credenciales de conexión, desde **Project Settings → Data API**:
   - **Project URL**
   - **anon public key**

### Incidencia registrada
Durante la configuración inicial se copiaron por error la URL y la key de un proyecto de Supabase distinto al actual, lo que generó el error `net::ERR_NAME_NOT_RESOLVED` al intentar consultar datos. Se solucionó comparando cuidadosamente la URL del proyecto activo (visible en Project Settings) contra la registrada en el archivo `.env`, y corrigiendo ambos valores.

---

## 6. Instalación de la librería de Supabase

```powershell
npm install @supabase/supabase-js
```

---

## 7. Configuración segura de la conexión

### 7.1 Por qué no se escriben las credenciales directamente en el código

Si la URL y la key se escriben directamente dentro de un archivo `.js`, cualquier persona que vea el repositorio en GitHub tendría acceso a esos datos. La práctica correcta es usar **variables de entorno**, guardadas en un archivo que nunca se sube al repositorio.

### 7.2 Archivo `.env` (en la raíz del proyecto, NO dentro de `src`)

```
VITE_SUPABASE_URL=https://egpkdedaorgjpeowddjw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Hsglcr6tcgaGyQqLYMh4Ew_5AoQShRS
```

**Reglas clave de Vite para variables de entorno:**
- Deben empezar exactamente con el prefijo `VITE_` — cualquier otro prefijo (por ejemplo `NEXT_PUBLIC_`, que es de otro framework) es ignorado silenciosamente.
- No llevan comillas alrededor del valor.
- El archivo `.env` debe estar en la raíz del proyecto; uno ubicado dentro de `src` no es leído por Vite.
- Después de crear o modificar el `.env`, es obligatorio reiniciar el servidor (`Ctrl + C` y de nuevo `npm run dev`), ya que Vite solo lee estas variables al arrancar.

### 7.3 Proteger el `.env` en `.gitignore`

```
.env
```

(El `.gitignore` también debe estar en la raíz del proyecto, no dentro de `src`, para que Git lo tenga en cuenta.)

### 7.4 `src/config/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Nota:** esta conexión se exporta de forma **nombrada** (`export const supabase = ...`), por lo que en cualquier otro archivo se debe importar con llaves: `import { supabase } from '../config/supabase'`.

---

## 8. Diseño y creación de las tablas

Se utilizó el **SQL Editor** de Supabase para crear las tablas mediante código SQL, en lugar de la interfaz visual, por mayor precisión y control sobre los tipos de datos y relaciones.

### 8.1 Tabla `students`

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  birth_date date,
  created_at timestamp with time zone default now()
);
```

### 8.2 Tabla `courses`

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  max_capacity integer not null default 30,
  created_at timestamp with time zone default now()
);
```

### 8.3 Tipo personalizado y tabla `enrollments`

```sql
create type enrollment_status as enum ('ACTIVE', 'COMPLETED', 'CANCELLED');

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  enrollment_date date not null default current_date,
  status enrollment_status not null default 'ACTIVE',
  created_at timestamp with time zone default now()
);
```

### Conceptos aplicados

- **`uuid primary key default gen_random_uuid()`**: identificador único generado automáticamente, en lugar de un número autoincremental.
- **`references students(id)`**: define una **foreign key**; garantiza que el valor guardado en `student_id` corresponda siempre a un `id` existente en la tabla `students`.
- **`on delete cascade`**: si se elimina un estudiante o un curso, sus matrículas relacionadas se eliminan automáticamente, evitando registros huérfanos.
- **`create type ... as enum (...)`**: restringe una columna a un conjunto cerrado de valores válidos, evitando errores de escritura.
- **Orden de creación obligatorio**: `students` y `courses` deben existir antes que `enrollments`, y el tipo `enrollment_status` debe crearse antes de la tabla que lo usa — de lo contrario, PostgreSQL devuelve un error indicando que la referencia no existe.

### 8.4 Row Level Security (RLS)

Al crear cada tabla, Supabase advierte que no se ha configurado seguridad a nivel de fila. Se seleccionó la opción **"Run without RLS"** para esta etapa de aprendizaje, ya que activar RLS sin definir políticas de acceso bloquearía por completo la lectura/escritura de datos, incluso desde la propia aplicación. Esta es una decisión válida en fase de desarrollo; en un entorno de producción real se configurarían políticas de seguridad específicas.

---

## 9. Inserción de datos de prueba

```sql
insert into students (first_name, last_name, email, birth_date) values
('Yeraldin', 'Gutierrez', 'yeraldin@correo.com', '2001-05-14'),
('Erica', 'Avendaño', 'erica@correo.com', '1998-03-22'),
('Maria', 'Perez', 'maria@correo.com', '2000-11-09');

insert into courses (code, name, description, max_capacity) values
('BE2-JAVA', 'Backend II - Java Spring Boot', 'Curso de backend con Spring Boot y JPA', 25),
('FE-REACT', 'Frontend con React', 'Curso de desarrollo frontend con React y Vite', 30),
('DB-SQL', 'Bases de Datos SQL', 'Fundamentos de PostgreSQL y modelado relacional', 20);

insert into enrollments (student_id, course_id, status) values
((select id from students where email = 'yeraldin@correo.com'), (select id from courses where code = 'BE2-JAVA'), 'ACTIVE'),
((select id from students where email = 'erica@correo.com'), (select id from courses where code = 'FE-REACT'), 'ACTIVE'),
((select id from students where email = 'maria@correo.com'), (select id from courses where code = 'DB-SQL'), 'COMPLETED');
```

**Concepto clave:** en `enrollments`, en lugar de escribir manualmente los `uuid` de cada estudiante y curso (identificadores largos y poco legibles), se usan **subconsultas** (`select id from students where email = '...'`) que buscan automáticamente el id correspondiente según un dato conocido (el correo o el código del curso).

### Verificación de las relaciones

```sql
select s.first_name, s.last_name, c.name as curso, e.status
from enrollments e
join students s on s.id = e.student_id
join courses c on c.id = e.course_id;
```

Resultado verificado con éxito: 3 registros combinando estudiante, curso y estado correctamente relacionados.

---

## 10. Servicio de datos: `studentService.js`

```js
import { supabase } from '../config/supabase'

// Trae todos los estudiantes, del más reciente al más antiguo
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

// Busca estudiantes por coincidencia parcial de nombre o apellido
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
```

### Equivalencia entre SQL y la librería `supabase-js`

| Consulta en SQL | Equivalente en `supabase-js` |
|---|---|
| `select * from students` | `.from('students').select('*')` |
| `where email = '...'` | `.eq('email', '...')` |
| `where first_name ilike '%texto%'` | `.ilike('first_name', '%texto%')` |
| `where a ilike '%x%' or b ilike '%x%'` | `.or('a.ilike.%x%,b.ilike.%x%')` |
| `order by columna desc` | `.order('columna', { ascending: false })` |
| `select count(*) from tabla` | `.select('*', { count: 'exact', head: true })` |

Toda función de este tipo devuelve siempre un objeto con dos posibles resultados: `{ data, error }`. Si la consulta fue exitosa, `data` contiene la información y `error` es `null`; si algo falla, `data` es `null` y `error` contiene el detalle del problema. El patrón `if (error) { ...; return [] }` evita que la aplicación se rompa cuando la consulta falla, devolviendo una lista vacía en su lugar.

---

## 11. Conexión de la página `Students.jsx` con datos reales

```jsx
import { useEffect, useState } from 'react'
import { getStudents, buscarEstudiantesPorNombre } from '../services/studentService'
import Footer from '../components/Footer'

function Students() {
  const [students, setStudents] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    async function buscar() {
      setCargando(true)
      const data = busqueda.trim() === ''
        ? await getStudents()
        : await buscarEstudiantesPorNombre(busqueda)
      setStudents(data)
      setCargando(false)
    }

    const timeoutId = setTimeout(buscar, 400)
    return () => clearTimeout(timeoutId)
  }, [busqueda])

  // ...resto del JSX: header, input de búsqueda, tabla y footer
}
```

### Conceptos nuevos aplicados

- **`useEffect` con dependencia `[busqueda]`**: hace que la consulta a Supabase se repita automáticamente cada vez que cambia el texto del buscador, sin necesidad de un botón "Buscar".
- **Debounce con `setTimeout` (400ms)**: evita disparar una consulta a la base de datos por cada tecla presionada. Espera un breve instante después de que el usuario deja de escribir antes de consultar, mejorando el rendimiento.
- **Diferencia con el buscador de la Clase 01**: en la Clase 01, el filtro (`.filter()`) se aplicaba sobre datos ya cargados en memoria (simulados). En la Clase 02, cada búsqueda genera una consulta real y nueva contra la base de datos en la nube.

---

## 12. Problemas encontrados y solución

| Problema | Causa | Solución |
|---|---|---|
| `Failed to resolve import "./utils/supabase"` | El archivo de conexión se creó en una carpeta (`config`) distinta a la que el código intentaba importar (`utils`) | Se unificó el nombre de carpeta y se corrigió la ruta de importación en `App.jsx` |
| `net::ERR_NAME_NOT_RESOLVED` al consultar datos | La URL de Supabase en el `.env` correspondía a un proyecto distinto al actual | Se comparó la URL real del proyecto (Project Settings → Data API) contra la del `.env`, y se corrigió |
| Variables de entorno no reconocidas | Se usó el prefijo `NEXT_PUBLIC_` (de Next.js) en lugar de `VITE_` (requerido por Vite) | Se renombraron las variables con el prefijo correcto |
| `.env` y `.gitignore` no funcionaban como se esperaba | Ambos archivos habían quedado guardados dentro de `src/`, en vez de la raíz del proyecto | Se movieron a la raíz con `move src\.env .env` y `move src\.gitignore .gitignore` |
| `type "enrollment_status" does not exist` | Se intentó crear la tabla `enrollments` sin haber creado antes el tipo enum que usa | Se ejecutó primero el `create type`, y después el `create table` |
| `studentService.js` no se encontraba al importarlo | El archivo se había guardado con un nombre distinto por error de tipeo (`Studenservice.js`) | Se renombró el archivo al nombre exacto usado en el `import` |

---

## 13. Checklist de la clase

- [x] Cuenta y proyecto creados en Supabase
- [x] Librería `@supabase/supabase-js` instalada
- [x] Conexión configurada de forma segura con variables de entorno
- [x] `.env` protegido en `.gitignore`
- [x] Tablas `students`, `courses` y `enrollments` creadas con relaciones correctas
- [x] Datos de prueba insertados y relaciones verificadas
- [x] `studentService.js` con funciones de listar y buscar
- [x] `Students.jsx` mostrando datos reales, con buscador en tiempo real
- [ ] Dashboard con conteos reales (pendiente, se dejó con datos simulados por decisión propia)
- [ ] `courseService.js` y conexión de `Courses.jsx`
- [ ] `enrollmentService.js` y conexión de `Enrollments.jsx`

---

## 14. Dudas a resolver con el docente

- Confirmar el patrón de nomenclatura de carpetas que utiliza el docente (`utils` vs `config` vs `services`) para mantener consistencia con el resto del curso.
- Revisar el enfoque que usa el docente para el Dashboard (`try/catch` con conteos por tabla) y decidir si se adopta tal cual o se ajusta.
- Confirmar si el uso de componentes de tabla separados (ej. `StudentTable.jsx`, como sugiere el instructivo maestro) se abordará formalmente en una clase próxima.

---

## 15. Próximos pasos

- Construir `courseService.js` y conectar `Courses.jsx` con datos reales, replicando el patrón usado en `Students`.
- Construir `enrollmentService.js`, incluyendo selects dinámicos de estudiantes y cursos para crear nuevas matrículas.
- Actualizar el Dashboard con las 6 métricas reales (Total Students, Total Courses, Total Enrollments, Active, Completed, Cancelled Enrollments).
- Iniciar la Fase 3 del instructivo maestro: CRUD completo de Students (Create, Update, Delete), actualmente solo con la operación List funcional.

Asi vamos construyendo paso a paso esta App atraves del aprendizaje donde se va viendo cada uno de los avances 