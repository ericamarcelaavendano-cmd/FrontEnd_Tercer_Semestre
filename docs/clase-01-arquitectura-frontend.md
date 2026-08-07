# Clase 01 — Introducción al Proyecto y Arquitectura Frontend

**Proyecto:** Sistema de Gestión de Cursos ("Gestión Académica")
**Estudiante:** Erica Avendaño
**Docente:** Luis Alberto Goenaga
**Tecnologías:** React + Vite + Java + Tailwind CSS v4 + React Router

---

## 1. Introducción

Este documento describe, paso a paso y en orden cronológico, todo el trabajo realizado durante la Clase 01 del Sistema de Gestión de Cursos: desde la creación del proyecto en la terminal hasta la construcción de la navegación, el Dashboard, la tabla de estudiantes, y la reorganización de la arquitectura de rutas siguiendo el patrón enseñado por el docente.

El propósito de este documento es doble: servir como evidencia del proceso de aprendizaje (no solo del resultado final) y como referencia técnica para retomar el proyecto en las siguientes clases.

## 2. Alcance

Cubre exclusivamente lo trabajado en la Clase 01. Todos los datos mostrados en la aplicación (estadísticas del Dashboard y listado de estudiantes) son **simulados**, escritos directamente en el código. Serán reemplazados por datos reales provenientes de Supabase en la Clase 02.

## 3. Objetivos de la clase

- Crear el proyecto desde cero con Vite + React.
- Instalar y configurar React Router y Tailwind CSS.
- Construir la arquitectura de carpetas del proyecto.
- Implementar navegación funcional mediante un Sidebar.
- Construir un Dashboard con tarjetas de estadísticas simuladas.
- Construir una tabla de estudiantes con buscador en tiempo real.
- Comprender qué archivo es el punto de entrada de la aplicación y cómo se conectan los demás.
- Subir el proyecto a GitHub, incluyendo solo lo necesario.

---

## 4. Arquitectura de la aplicación: ¿cuál es el archivo principal y cómo se conectan?

React necesita un único punto de entrada, y desde ahí todo se conecta en cadena:

```
index.html
    │
    └──▶ src/main.jsx                    (arranca React)
              │
              └──▶ src/App.jsx                    (puerta de entrada del componente principal)
                        │
                        └──▶ src/routes/AppRoutes.jsx   (define TODA la navegación)
                                  │
                                  ├──▶ src/components/Sidebar.jsx   (menú lateral, siempre visible)
                                  │
                                  └──▶ src/pages/*.jsx   (la página activa según la URL)
                                            │
                                            ├── Dashboard.jsx  → usa components/StatCard.jsx
                                            ├── Students.jsx   → contenido temporal (tabla real en Clase 02, con Supabase)
                                            ├── Courses.jsx    → contenido temporal
                                            └── Enrollments.jsx → contenido temporal
```

| Orden | Archivo | Responsabilidad |
|---|---|---|
| 1 | `index.html` | HTML base con un `<div id="root">` vacío, donde React monta la aplicación. |
| 2 | `src/main.jsx` | Punto de arranque real. Le indica a React que renderice `App` dentro del `#root`. |
| 3 | `src/App.jsx` | Componente raíz, deliberadamente simple: solo importa y retorna `<AppRoutes />`. |
| 4 | `src/routes/AppRoutes.jsx` | Contiene `BrowserRouter`, `Routes` y `Route`; decide qué página mostrar según la URL, y coloca el `Sidebar` para que sea visible siempre. |
| 5 | `src/components/Sidebar.jsx` | Menú lateral fijo con los 4 links de navegación, usando `NavLink`. |
| 6 | `src/pages/*.jsx` | El contenido específico de cada sección. |
| 7 | `src/components/StatCard.jsx` | Componente reutilizable usado 3 veces dentro de `Dashboard.jsx`. |

**Resumen:** `main.jsx` arranca React → `App.jsx` es la puerta de entrada → `AppRoutes.jsx` decide qué se ve según la URL → el `Sidebar` permite cambiar esa URL con clics → cada `page` es lo que finalmente se muestra en pantalla.

---

## 5. Estructura de carpetas final

```
src/
│
├── assets/
├── components/
│   ├── Sidebar.jsx
│   └── StatCard.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Students.jsx
│   ├── Courses.jsx
│   └── Enrollments.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/           → reservado para la Clase 02 (conexión con Supabase)
│
├── App.jsx
├── index.css
└── main.jsx
```

---

## 6. Instalación y configuración, paso a paso

### 6.1 Crear el proyecto con Vite

Desde PowerShell, ubicada dentro de la carpeta del proyecto:

```powershell
npm create vite@latest . -- --template react
```

Durante el asistente interactivo se confirmó:
- Nombre del paquete (`frontend-tercer-semestre`)
- Linter: **Oxlint** (opción por defecto)

### 6.2 Instalar dependencias base

```powershell
npm install
```

### 6.3 Instalar React Router

```powershell
npm install react-router-dom
```

### 6.4 Instalar y configurar Tailwind CSS (v4)

```powershell
npm install -D tailwindcss @tailwindcss/vite
```

En `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

En `src/index.css`:

```css
@import "tailwindcss";
```

Se verificó el funcionamiento con una prueba temporal en `App.jsx` (`bg-blue-500 text-white p-4` con el texto "Hola Tailwind"), confirmando visualmente el recuadro azul antes de continuar con el resto del desarrollo.

### 6.5 Cómo ejecutar el proyecto (uso diario)

Desde la terminal integrada de VS Code (`Ctrl + \``):

```powershell
npm run dev
```

Esto levanta el servidor de desarrollo en `http://localhost:5173/`. Puede visualizarse dentro del propio VS Code con `Ctrl + Shift + P` → `Simple Browser: Show` → pegando esa URL. Para detener el servidor: `Ctrl + C` en la terminal.

---

## 7. Construcción de la navegación (React Router)

Se definieron 4 rutas:

| Ruta | Página |
|---|---|
| `/` | Dashboard |
| `/students` | Students |
| `/courses` | Courses |
| `/enrollments` | Enrollments |

**Conceptos aplicados:**
- **`BrowserRouter`**: habilita la navegación basada en URL sin recargar la página completa.
- **`Routes`**: agrupa todas las rutas posibles de la aplicación.
- **`Route`**: asocia una ruta (`path`) con el componente a mostrar (`element`).
- **`NavLink`**: similar a un link (`<a>`), pero interceptado por React Router para cambiar de página sin recarga; además detecta cuál está activo (`isActive`) para resaltarlo visualmente.

---

## 8. Componente reutilizable: `StatCard`

Evita repetir el mismo bloque de HTML tres veces en el Dashboard. Recibe información desde afuera mediante **props**:

```jsx
<StatCard title="Students" total="50" />
<StatCard title="Courses" total="12" />
<StatCard title="Enrollments" total="145" />
```

En esta etapa no se profundizó en la teoría de props; se explicó únicamente que el componente "recibe información externa" para mostrarla.

---

## 9. Dashboard

Muestra un mensaje de bienvenida y las 3 tarjetas de estadísticas simuladas (Students: 50, Courses: 12, Enrollments: 145). Estos datos serán reemplazados por datos reales de Supabase en la Clase 02.

---

## 10. Página de estudiantes (`Students.jsx`)

En esta clase, `Students.jsx` quedó con el contenido temporal indicado por la guía (un simple `<h1>Students</h1>`), a la espera de la Clase 02. La tabla de estudiantes con datos reales, buscador y acciones (editar/eliminar) se construirá directamente conectada a **Supabase**, en lugar de usar datos simulados escritos en el código.

---

## 11. Refactor de arquitectura: separación de `App.jsx` y `AppRoutes.jsx`

Siguiendo el patrón mostrado por el docente en clase, se reorganizó el enrutamiento:

**Antes:** toda la lógica de rutas y el `Sidebar` vivían directamente en `App.jsx`.

**Después:**
- `App.jsx` quedó reducido a su mínima expresión: solo importa y retorna `<AppRoutes />`.
- `AppRoutes.jsx` (dentro de `src/routes/`) concentra toda la lógica de `BrowserRouter`, `Routes`, `Route` y el `Sidebar`.

```jsx
// src/App.jsx
import AppRoutes from './routes/AppRoutes'

function App() {
  return <AppRoutes />
}

export default App
```

```jsx
// src/routes/AppRoutes.jsx
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
  )
}

export default AppRoutes
```

**Por qué se hizo este cambio:** separar responsabilidades. `App.jsx` funciona como puerta de entrada (fácil de leer de un vistazo), y `AppRoutes.jsx` concentra exclusivamente la configuración de navegación. Es un patrón común en proyectos React reales, y coincide con el que utiliza el docente en su ejemplo de referencia.

---

## 12. Personalización visual

Siguiendo la actividad independiente sugerida por la guía, se personalizó:

- **Nombre del sistema:** "Gestión Académica" (en vez del genérico "Course Manager").
- **Paleta de color:** grafito (`slate-900`) + celeste (`sky-500`) como color de acento, aplicado en el link activo del Sidebar y en el borde superior de las tarjetas del Dashboard.
- **Tarjeta de usuario:** se agregó el nombre de la estudiante en la parte inferior del Sidebar.
- Se ajustó el título del Sidebar con `whitespace-nowrap` para evitar que el texto "Gestión Académica" se partiera en dos líneas dentro del espacio disponible.

---

## 13. Control de versiones y subida a GitHub

### 13.1 Qué se excluye del repositorio

El archivo `.gitignore`, generado automáticamente por Vite, excluye correctamente:

```
node_modules
dist
dist-ssr
*.local
```

Esto es fundamental: `node_modules` no debe subirse nunca (pesa cientos de MB y se regenera con `npm install`), y `dist` es la carpeta de compilación (se regenera con `npm run build`).

### 13.2 Comandos utilizados

```powershell
git init
git add .
git status              # se verificó que node_modules NO apareciera en la lista
git commit -m "Clase 01: estructura inicial, Sidebar, Dashboard y navegacion"
```

Luego, tras crear el repositorio vacío en GitHub (sin README ni .gitignore, para evitar conflictos):

```powershell
git remote add origin https://github.com/USUARIO/NOMBRE-REPO.git
git branch -M main
git push -u origin main
```

### 13.3 Lo que sí viaja al repositorio

`src/`, `public/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore`, `README.md`, y `docs/`.

---

## 14. Problemas encontrados y solución

| Problema | Causa | Solución |
|---|---|---|
| `cd` no encontraba la carpeta del proyecto | Se usó una ruta de ejemplo sin reemplazar por la ruta real | Se usó la ruta real del Escritorio, entre comillas dobles por el espacio en "OneDrive - CESDE" |
| `npm : no se puede cargar... la ejecución de scripts está deshabilitada` | Política de ejecución de PowerShell restringida por defecto en Windows | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `Failed to resolve import "./pages/Dashboard"` | Los archivos de páginas quedaron creados en `src/` en vez de `src/pages/` | Se movieron los archivos a la carpeta correcta |
| `ERR_CONNECTION_REFUSED` en el navegador | El servidor (`npm run dev`) se había detenido | Se volvió a ejecutar `npm run dev` |

---

## 15. Checklist final de la clase

- [x] React Router instalado y funcionando
- [x] Tailwind CSS v4 funcionando
- [x] Estructura de carpetas creada (`assets`, `components`, `pages`, `routes`, `services`)
- [x] Sidebar visible y funcional, con navegación entre 4 secciones
- [x] Dashboard visible con tarjetas de estadísticas simuladas
- [x] Personalización visual (nombre, colores, tarjeta de usuario)
- [x] Separación de responsabilidades entre `App.jsx` y `AppRoutes.jsx`
- [x] Proyecto subido a GitHub, excluyendo `node_modules` y `dist`
- [x] Documentación de la clase redactada

---

## 16. Próximos pasos (Clase 02)

Según la guía del docente, en la siguiente clase se trabajará en:

- Crear el proyecto en Supabase.
- Diseñar las tablas de la base de datos.
- Conectar React con Supabase (carpeta `src/services/`).
- Obtener datos reales.
- Reemplazar las estadísticas simuladas del Dashboard y la tabla de Students por datos reales.