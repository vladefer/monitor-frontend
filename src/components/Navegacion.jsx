import { useState, useEffect } from 'react'
import { Menubar } from 'primereact/menubar'
import { Avatar } from 'primereact/avatar'
import logoLocal from '../assets/perfil.png'
import { useAuth } from '../auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate();

  // Responsive: mostrar solo el item usuario en pantallas grandes (lg).
  const [isLg, setIsLg] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  })

  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fullItems = [
    { label: 'Dashboard', command: () => navigate('/') },
    { label: 'Lecturas', command: () => navigate('/lecturas') },
    { label: 'Promedios', command: () => navigate('/promedios') },
    { label: 'Gráfico Diario', command: () => navigate('/grafico') },
    { label: 'Gráfico Informe', command: () => navigate('/informes') },
    { label: 'Contactos', command: () => navigate('/contactos') },
    { label: 'Cerrar sesion', command: () => logout() },
    { label: user?.cliente_nombre || '', icon: 'pi pi-user' }
  ]

  const compactItems = [
    {
      template: () => (
        <div className="flex items-center gap-2">

          <span className="hidden sm:inline">{user?.cliente_nombre || ''}</span>
          <Avatar image={user?.avatar || logoLocal} shape="circle" size="large" />
        </div>
      )
    }
  ]

  const items = isLg ? compactItems : fullItems

  return (
    <div className='bg-white p-2 flex items-center' >

      <Menubar
        start= {<img src="img/logo.png" alt="logo" style={{ width: "180px", height: "auto" }} />}
        className={"justify-between h-16"}
        model={items}
        style={{
          fontSize: "1.2rem",
          background: "white",
          border: "none",
          width: "100%",
        }}
      />
    </div>

  )
}

export default Navbar
