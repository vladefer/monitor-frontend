import { useQuery } from "@tanstack/react-query"
import { useSensor } from "../context/SensorContext"
import TablaLecturas from "../components/TablaLecturas"
import { useAuth } from '../auth/AuthProvider'

function Lecturas() {
    const { sensorId, sensorMin, sensorMax, sensorTipo, sensorNombre, sensorIdentificador,lecturasFechaInicio, lecturasFechaFin, setLecturasFechaInicio, setLecturasFechaFin } = useSensor()
    const baseUrl = import.meta.env.VITE_API_URL;
    const { user } = useAuth()

    const link = `${baseUrl}/sensors/${sensorId}/lecturas?fechaInicio=${lecturasFechaInicio}&fechaFin=${lecturasFechaFin}`

    const fetchLecturas = async () => {
        const res = await fetch(link)
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consulta = [], refetch, isFetching } = useQuery({
        queryKey: ["lecturas", sensorId, lecturasFechaInicio, lecturasFechaFin],
        queryFn: fetchLecturas,
        enabled: !!sensorId && !!lecturasFechaInicio && !!lecturasFechaFin,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    })

    return (
        <div>

            <TablaLecturas
                consulta={consulta}
                sensorIdentificador={sensorIdentificador}
                lecturasFechaInicio={lecturasFechaInicio}
                setLecturasFechaInicio={setLecturasFechaInicio}
                lecturasFechaFin={lecturasFechaFin}
                setLecturasFechaFin={setLecturasFechaFin}
                sensorMin={sensorMin}
                sensorMax={sensorMax}
                sensorTipo={sensorTipo}
                sensorNombre={sensorNombre}
                refetch={refetch}
                isFetching={isFetching}
                user={user}
            />
        </div>
    )
}

export default Lecturas
