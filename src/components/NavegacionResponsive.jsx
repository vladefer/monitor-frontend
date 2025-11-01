import { useState } from "react"
import NavegacionLateral from "./NavegacionLateral"
import { Button } from "primereact/button"

export default function NavegacionResponsive() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div>

      <div>
      {/* Botón hamburguesa (solo visible en móvil) */}
      <div className="fixed top-4 left-4 z-[300] lg:hidden">
        <Button
          icon={menuAbierto ? "pi pi-times" : "pi pi-bars"}
          onClick={() => setMenuAbierto((prev) => !prev)}
          aria-label="Menú"
        />
      </div>

      {/* Menú lateral deslizante */}
      <div
        className={`fixed top-0 left-0 h-full z-[250] bg-white shadow-lg transition-transform duration-300 ease-in-out
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"}
        lg:hidden w-[18rem] rounded-r-2xl border-r border-gray-100`}
      >
        {/* Reutilizamos el mismo componente, pero sin hover */}
        <NavegacionLateral expanded={true} />
      </div>

      {/* Fondo semitransparente (cierra el menú al hacer clic afuera) */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] lg:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </div>




    </div>  


    
  );
}
