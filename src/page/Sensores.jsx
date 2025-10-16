import TablaSensores from "../components/TablaSensores"
import { useSensor } from '../context/SensorContext'
import { useAuth } from '../auth/AuthProvider'
import { useQuery } from "@tanstack/react-query"

function Sensores() {
    const { setSensorId, setSensorNombre, setSensorMin, setSensorMax, setSensorTipo, setSensorIdentificador, sensorId, sensorNombre, setSensorEstado, setSensorUbicacion } = useSensor()
    const baseUrl = import.meta.env.VITE_API_URL;
    const { user } = useAuth()

    const fetchSensores = async () => {
        const res = await fetch(`${baseUrl}/sensors?usuarioId=${user.id}&rol=${user.rol}`)
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consulta = [], refetch,  isFetching } = useQuery({
        queryKey: ["sensores"],
        queryFn: fetchSensores,
        staleTime: 1000 * 60 * 10, 
        refetchOnWindowFocus: false, 
        keepPreviousData: true, 
    })

    return (
        <div>
            <TablaSensores
                consulta={consulta}
                setSensorId={setSensorId}
                setSensorIdentificador = {setSensorIdentificador}
                setSensorNombre={setSensorNombre}
                sensorNombre={sensorNombre}
                setSensorMin={setSensorMin}
                setSensorMax={setSensorMax}
                setSensorTipo={setSensorTipo}
                refetch={refetch}
                isFetching={isFetching}
                sensorId={sensorId}
                setSensorEstado={setSensorEstado}
                setSensorUbicacion={setSensorUbicacion}
            />
        </div>
    )
}

export default Sensores;
