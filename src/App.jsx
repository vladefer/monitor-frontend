import { SensorProvider } from "./context/SensorContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./page/Dashboard"
import Lecturas from "./page/Lecturas"
import Grafico from "./page/Grafico"
import Promedios from "./page/Promedios"
import Informes from "./page/Informes"
import Contactos from "./page/Contactos"
import { AuthProvider } from "./auth/AuthProvider"
import PrivateRoute from "./auth/PrivateRoute"
import LoginPage from "./auth/LoginPage"
import LayoutPrivado from "./components/LayoutPrivado"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient();

import "primereact/resources/themes/lara-light-cyan/theme.css"
import "primeicons/primeicons.css"

function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <SensorProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <LayoutPrivado />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="lecturas" element={<Lecturas />} />
                <Route path="grafico" element={<Grafico />} />
                <Route path="promedios" element={<Promedios />} />
                <Route path="informes" element={<Informes />} />
                <Route path="contactos" element={<Contactos />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SensorProvider>
    </QueryClientProvider>
  )
}

export default App
