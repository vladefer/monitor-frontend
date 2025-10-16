import { Outlet } from "react-router-dom"
import Navbar from "./Navegacion"
import Sensores from "../page/Sensores"
import NavegacionLateral from "./NavegacionLateral"

export default function PrivateLayout() {

  return (
 <div className="flex min-h-screen w-full relative bg-gray-50">
  {/* 🧭 Menú lateral fijo y sobre todo */}
  
  <div className="hidden lg:block fixed top-0 left-0 h-screen z-[200]">
    <NavegacionLateral />
  </div>

  {/* 🔝 Navbar fija (debajo del lateral en orden visual) */}
  <div className="fixed inset-x-0 top-0 z-[100] w-full shadow-ssm border-b border-gray-200">
    <Navbar />
  </div>

  {/* 📄 Contenido principal */}
  <div className="flex flex-1 flex-col w-full pt-24 pl-0 lg:pl-78 px-2 gap-4">
    <Sensores />
    <Outlet />
  </div>
</div>



  )
}
