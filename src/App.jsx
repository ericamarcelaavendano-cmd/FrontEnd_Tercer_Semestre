import AppRoutes from './routes/AppRoutes'
import { useState, useEffect } from 'react'
import { supabase } from "./config/supabase";
function App() {
  return <AppRoutes />;
}

export default App;