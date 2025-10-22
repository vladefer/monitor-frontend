import { useQuery } from "@tanstack/react-query"
import { useSensor } from "../context/SensorContext"
import CrearGrafico from "../components/GraficoDiario"
import { useAuth } from '../auth/AuthProvider'

function Grafico() {
  const { sensorId, sensorNombre, sensorMax, sensorMin, sensorTipo, graficoFechaInicio, graficoFecha, setGraficoFecha,setGraficoFechaInicio, graficoFechaFin, setGraficoFechaFin, graficoIntervaloHora, setGraficoIntervaloHora, sensorIdentificador } = useSensor()
  const baseUrl = import.meta.env.VITE_API_URL;
  const { user } = useAuth()

  const fetchGrafico = async () => {
        const res = await fetch(`${baseUrl}/sensors/${sensorId}/grafico?fecha=${graficoFecha}`)
        if (!res.ok) throw new Error("Error al cargar lecturas")
        return res.json()
    }

    const { data: consulta = [], refetch, isFetching } = useQuery({
        queryKey: ["grafico", sensorId, graficoFecha],
        queryFn: fetchGrafico,
        enabled: !!sensorId && !!graficoFecha,
        staleTime: 1000 * 60 * 10, // cache 10 minutos
        refetchOnWindowFocus: false, 
        keepPreviousData: true, 
    })

  return (
    <div>
      <CrearGrafico
        consulta={consulta}
        graficoFecha={graficoFecha}
        setGraficoFecha={setGraficoFecha}
        graficoFechaInicio={graficoFechaInicio}
        setGraficoFechaInicio={setGraficoFechaInicio}
        graficoFechaFin={graficoFechaFin}
        setGraficoFechaFin={setGraficoFechaFin}
        graficoIntervaloHora={graficoIntervaloHora}
        setGraficoIntervaloHora={setGraficoIntervaloHora}
        sensorNombre={sensorNombre}
        sensorIdentificador={sensorIdentificador}
        sensorMax={sensorMax}
        sensorMin={sensorMin}
        sensorTipo={sensorTipo}
        refetch={refetch}
        isFetching={isFetching}
        user={user}
      />
    </div>
  )
}

export default Grafico;