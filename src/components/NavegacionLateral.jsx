import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function NavegacionLateral({ expanded = false }) {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const items = [
      { label: "Dashboard", icon: "pi pi-home", action: () => navigate("/") },
      { label: "Lecturas", icon: "pi pi-database", action: () => navigate("/lecturas") },
      { label: "Promedios", icon: "pi pi-chart-line", action: () => navigate("/promedios") },
      { label: "Gráfico Diario", icon: "pi pi-calendar", action: () => navigate("/grafico") },
      { label: "Gráfico Informe", icon: "pi pi-chart-bar", action: () => navigate("/informes") },
      { label: "Contactos", icon: "pi pi-phone", action: () => navigate("/contactos") },
      { label: "ONAC", icon: "pi pi-receipt" },
      { label: 'Cerrar sesion', icon: "pi pi-sign-out", action: () => logout() },
      { separator: true },

   ];

   return (
      <div
         className={`h-screen transition-all duration-300 ease-in-out ${expanded ? "w-[18rem]" : "w-[5rem]"
            } overflow-hidden rounded-2xl bg-white/100 backdrop-blur-md border border-black/5 shadow-sm`}
         style={{ willChange: "width" }}
      >
         <nav className="flex flex-col justify-between h-full py-4">

            <div>
               {/* Logo superior */}
               <div className="flex items-center justify-center py-0">
                  <img
                     src="/img/logo-marca.png"
                     alt="Logo"
                     className="w-16"
                  />
               </div>

               {items
                  .filter((item) => item.label !== user?.cliente_nombre)
                  .map((item, i) =>
                     item.separator ? (
                        <hr key={i} className="my-3 border-t border-gray-200" />
                     ) : (
                        <button
                           key={i}
                           onClick={item.action}
                           className={`flex items-center gap-10 px-6 py-6 text-gray-800 w-full text-left hover:bg-gray-100 transition-colors duration-200 cursor-pointer`}
                        >
                           <i
                              className={`${item.icon} flex-shrink-0`}
                              style={{ fontSize: "1.3rem" }}
                           />
                           <span className="whitespace-nowrap overflow-hidden text-[1.2rem] font-medium transition-all duration-200">
                              {item.label}
                           </span>
                        </button>
                     )
                  )}
            </div>


            <div className="">
               <button
                  className="flex items-center gap-5 px-6 py-8 text-gray-800 w-full text-left hover:bg-cyan-100 hover:text-black transition-colors duration-200 cursor-pointer"
               >
                  <i
                     className="pi pi-user flex-shrink-0"
                     style={{ fontSize: "1.3rem" }}
                  />
                  <span className="overflow-hidden text-[1.2rem] font-medium transition-all duration-200">
                     {user?.cliente_nombre}
                  </span>
               </button>
            </div>
         </nav>
      </div>
   );
}
