import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

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

    const items = [
        {
            label: "Home",
            items: [
                {
                    label: "Dashboard",
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
            ]
        },

                {
            label: "Documentos",
            items: [
                {
                    label: 'ONAC',
                    icon: "pi pi-receipt",
                    template: itemRenderer,

                },  
            ]
        },

        {
            separator: true
        },

        {
            label: "Usuario",
            items: [
                {
                    label: 'Cerrar Sesion',
                    icon: "pi pi-sign-out",
                    command: () => logout(),
                    template: itemRenderer,

                },  
            ]
        },

    ];

    return (
        <div >
            <Menu
                model={items}
                style={{ fontSize: "1.2rem", width: "18rem", height: "100vh", }}
            />
        </div>
    );
}
