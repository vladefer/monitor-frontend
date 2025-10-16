import { createContext, useContext, useState} from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext()

export function AuthProvider({ children }) { 

  const navigate = useNavigate()

  // id, user, rol, cliente_id, cliente_nombre 
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("usuario")
    return localUser ? JSON.parse(localUser) : null
  })

  const baseUrl = import.meta.env.VITE_API_URL;

  const queryClient = useQueryClient();

  const loginUsuario = async ({ username, password }) => {
    const res = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      }),
    })

    if (!res.ok) throw new Error("Error en la autenticación")
    const data = await res.json();
    return data
  }

  // Login
  const login = async (credenciales) => {
    try {
      const { usuario } = await loginUsuario(credenciales)
      setUser(usuario)
      localStorage.setItem("usuario", JSON.stringify(usuario))
      navigate("/")
    }

    catch (err) {
      alert("Credenciales inválidas")
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("usuario")
     queryClient.clear();
    navigate("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
