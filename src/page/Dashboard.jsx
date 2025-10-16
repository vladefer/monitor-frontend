import { useQuery } from "@tanstack/react-query"
import { useAuth } from '../auth/AuthProvider'
import TablaDashboard from "../components/TablaDashboard"
import { useSensor } from "../context/SensorContext"
import TablaSensores from "../components/TablaSensores";

function Dashboard() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const { user } = useAuth()
    const { sensorId, sensorNombre, sensorTipo, sensorMin, sensorMax, sensorIdentificador, sensorEstado, sensorUbicacion } = useSensor()

    const fetchDashboard = async () => {
        const res = await fetch(`${baseUrl}/sensors/dashboard?usuarioId=${user.id}&rol=${user.rol}`)
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consulta = [], isError, } = useQuery({
        queryKey: ["dashboard"],
        queryFn: fetchDashboard,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    })

    const fectchDashboardLecturas = async () => {
        const res = await fetch(`${baseUrl}/sensors/${sensorId}/dashboardLecturas`)
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consultaLecturas = [], refetch,  isFetching} = useQuery({
        queryKey: ["dashboard/lecturas", sensorId],
        queryFn: fectchDashboardLecturas,
        enabled: !!sensorId,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    })

    return (
        <div>
            <TablaDashboard
                consulta={consulta}
                consultaLecturas={consultaLecturas}
                sensorNombre={sensorNombre}
                sensorTipo={sensorTipo}
                sensorMin={sensorMin} 
                sensorMax={sensorMax}
                sensorIdentificador={sensorIdentificador}
                sensorEstado={sensorEstado}
                sensorUbicacion={sensorUbicacion}
            />
        </div>
    )
}

export default Dashboard
