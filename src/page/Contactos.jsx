import { useQuery } from "@tanstack/react-query"
import { useSensor } from "../context/SensorContext"
import { useAuth } from "../auth/AuthProvider"
import TablaContactos from "../components/TablaContactos"

function Contactos() {
    const { sensorNombre } = useSensor()
    const { user } = useAuth()

    const baseUrl = import.meta.env.VITE_API_URL

    const fetchContactos = async () => {
        const res = await fetch(`${baseUrl}/contactos?usuarioId=${user.id}`)
        if (!res.ok) throw new Error('Error al cargar los contactos')
        return res.json()
    }

    const { data: consulta = [], isError } = useQuery({
        queryKey: ["contactos"],
        queryFn: fetchContactos,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    })

    return (
        <TablaContactos
            consulta={consulta}
            sensorNombre={sensorNombre}
        />
    )
}

export default Contactos