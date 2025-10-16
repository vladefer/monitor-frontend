import { useQuery } from "@tanstack/react-query"
import { useSensor } from '../context/SensorContext'
import TablaPromedios from "../components/TablaPromedios"
import { useAuth } from '../auth/AuthProvider'

function Promedios() {
    const { sensorId, sensorTipo, sensorNombre, sensorMin, sensorMax, promediosFechaInicio, setPromediosFechaInicio, promediosFechaFin, setPromediosFechaFin } = useSensor()
    
    const baseUrl = import.meta.env.VITE_API_URL;
    
    const { user } = useAuth()

    const fetchPromedios = async () => {
        const res = await fetch(
            `${baseUrl}/sensors/${sensorId}/promedios?fechaInicio=${promediosFechaInicio}&fechaFin=${promediosFechaFin}`
        )
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }
    
    const { data: consulta = [], refetch, isFetching } = useQuery({
        queryKey: ["promedios", sensorId, promediosFechaInicio, promediosFechaFin],
        queryFn: fetchPromedios,
        enabled: !!sensorId && !!promediosFechaInicio && !!promediosFechaFin,
        staleTime: 1000 * 60 * 10, // cache 10 minutos
        refetchOnWindowFocus: false, 
        keepPreviousData: true, 
    })

    return (
        <div>
            <TablaPromedios
                consulta={consulta}
                promediosFechaInicio={promediosFechaInicio}
                setPromediosFechaInicio={setPromediosFechaInicio}
                promediosFechaFin={promediosFechaFin}
                setPromediosFechaFin={setPromediosFechaFin}
                sensorTipo={sensorTipo}
                sensorNombre={sensorNombre}
                sensorMin={sensorMin}
                sensorMax={sensorMax}
                refetch={refetch}
                isFetching={isFetching}
                user={user}
            />
        </div>
    )
}

export default Promedios