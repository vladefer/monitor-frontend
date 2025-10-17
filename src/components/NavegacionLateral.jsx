import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { classNames } from "primereact/utils";

export default function NavegacionLateral() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const itemRenderer = (item) => (
        <div className="p-menuitem-content">
            <a
                className="p-menuitem-link"
                onClick={item.command}
                role="button"
                tabIndex={0}
                aria-label={item.label}
            >
                <i className={`${item.icon}`} style={{ fontSize: '1.3rem' }} />
                <span className="ml-8 p-2">{item.label}</span>
                {item.badge && (
                    <Badge className="ml-auto" value={item.badge} severity="info" />
                )}
            </a>
        </div>
    );

    // 🔸 Menú principal
    const items = [
        {
            template: () => (
                <div className="flex items-center gap-2 py-[7.5px] px-3">
                    <img
                        src="/img/logo.png"
                        alt="Logo"
                    />
                </div>
            ),
        },
        { separator: true },
        {
            label: "Dashboard",
            className: "after-separator",
            icon: "pi pi-home",
            command: () => navigate("/"),
            template: itemRenderer,
        },
        {
            label: "Lecturas",
            icon: "pi pi-database",
            command: () => navigate("/lecturas"),
            template: itemRenderer,
        },
        {
            label: "Promedios",
            icon: "pi pi-chart-line",
            command: () => navigate("/promedios"),
            template: itemRenderer,
        },
        {
            label: "Gráfico Diario",
            icon: "pi pi-calendar",
            command: () => navigate("/grafico"),
            template: itemRenderer,
        },
        {
            label: "Gráfico Informe",
            icon: "pi pi-chart-bar",
            command: () => navigate("/informes"),
            template: itemRenderer,
        },
        {
            label: "Contactos",
            icon: "pi pi-phone",
            command: () => navigate("/contactos"),
            template: itemRenderer,
        },
        {
            className: "menu-footer",
            template: () => (
                <div className="pt-2 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className={classNames("w-full flex items-center text-gray-800 hover:bg-gray-100 rounded-md py-2")}
                    >
                        <div className="flex items-center gap-8 pl-6 w-full">
                            <i className="pi pi-sign-out" style={{ fontSize: '1.5rem'}}></i>
                            <div className="flex flex-col items-start">
                                <div className="font-bold">Usuario</div>
                                <div>Cerrar sesión</div>
                            </div>

                        </div>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="sidebar-menu">
            <Menu
                model={items}
                style={{ fontSize: "1.2rem", width: "18rem", height: "100vh", borderRadius: "0rem", borderTop: "none", }}
            />
        </div>
    );
}
