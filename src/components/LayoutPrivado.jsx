import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navegacion";
import Sensores from "../page/Sensores";
import NavegacionLateral from "./NavegacionLateral";

export default function PrivateLayout() {
  const [menuExpanded, setMenuExpanded] = useState(false);

  return (
    <div className="flex min-h-screen w-full relative bg-gray-50">

      <div
        onMouseEnter={() => setMenuExpanded(true)}
        onMouseLeave={() => setMenuExpanded(false)}
        className="hidden lg:block fixed left-0  z-[200]"
      >
        <NavegacionLateral expanded={menuExpanded} />
      </div>


      {/* Contenido principal: se mueve según menuExpanded */}
      <div className={`flex flex-1 flex-col w-full pt-3 px-6 gap-4 transition-all duration-300 ease-in-out ${menuExpanded ? "lg:ml-[18rem]" : "lg:ml-[5rem]"}`}>
        <Sensores />
        <Outlet />
      </div>
    </div>
  );
}
