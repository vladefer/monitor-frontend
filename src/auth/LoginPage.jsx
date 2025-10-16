import { useState } from "react"
import { useAuth } from "./AuthProvider"
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export default function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const enviarDatosUsuario = (e) => {
    e.preventDefault()
    login({ username, password })
  }

  // Estilos en objetos
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    padding: "1rem",
  }

  const formStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "400px", // <= Controla el ancho máximo
  }

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }

  const centerStyle = {
    display: "flex",
    justifyContent: "center",
  }

  const labelStyle = {
    fontSize: "1rem",
    fontWeight: "bold",
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={enviarDatosUsuario} style={formStyle}>
        <div style={columnStyle}>

          <div style={centerStyle}>
            <img src="/img/logo.png" alt="logo" style={{ width: "180px", height: "auto" }} />
          </div>

          <div style={centerStyle}>
            <label style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
              Bienvenido a monitor app
            </label>
          </div>

          <div>
            <label htmlFor="username" style={labelStyle}>Usuario</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              type="text"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>Contraseña</label>
            <InputText
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <Button
            type="submit"
            label="Ingrese"
            icon="pi pi-user-plus"
            style={{ width: "100%" }}
          />
        </div>
      </form>
    </div>
  )
}
