import { useQuery } from "@tanstack/react-query"
import { useSensor } from "../context/SensorContext"
import GraficoInformes from "../components/GraficoInformes"
import { useAuth } from '../auth/AuthProvider'

function Informes() {
    const { sensorId, sensorNombre, sensorIdentificador, sensorMax, sensorMin, sensorTipo, informeFechaInicio, setInformeFechaInicio, informeFechaFin, setInformeFechaFin, informeRangoHora, setInformeRangoHora } = useSensor()
    const { user } = useAuth()

    const baseUrl = import.meta.env.VITE_API_URL;

    const fetchInforme = async () => {
        const res = await fetch(
            `${baseUrl}/sensors/${sensorId}/promediosGrafico?fechaInicio=${informeFechaInicio}&fechaFin=${informeFechaFin}&rango=${informeRangoHora}`
        )
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consulta = [], refetch, isFetching } = useQuery({
        queryKey: ["informe", sensorId, informeFechaInicio, informeFechaFin, informeRangoHora],
        queryFn: fetchInforme,
        enabled: !!sensorId && !!informeFechaInicio && !!informeFechaFin && !!informeRangoHora,
        staleTime: 1000 * 60 * 10, // cache 10 minutos
        refetchOnWindowFocus: false, 
        keepPreviousData: true, 
    })

    return (
        <div>
            <GraficoInformes
                consulta={consulta}
                sensorNombre={sensorNombre}
                sensorIdentificador={sensorIdentificador}
                sensorMax={sensorMax}
                sensorMin={sensorMin}
                sensorTipo={sensorTipo}
                informeFechaInicio={informeFechaInicio}
                setInformeFechaInicio={setInformeFechaInicio}
                informeFechaFin={informeFechaFin}
                setInformeFechaFin={setInformeFechaFin}
                informeRangoHora={informeRangoHora}
                setInformeRangoHora={setInformeRangoHora}
                refetch={refetch}
                isFetching={isFetching}
                user={user}
            />

        </div>
    )
}

export default Informes