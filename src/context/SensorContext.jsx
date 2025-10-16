import { createContext, useState, useContext } from "react";

// Contexto para compartir el sensor seleccionado en la app
const SensorContext = createContext();

export function SensorProvider({ children }) {

    // Datos del sensor seleccionado
    const [sensorId, setSensorId] = useState("") 
    const [sensorIdentificador, setSensorIdentificador] = useState("") 
    const [sensorNombre, setSensorNombre] = useState("")
    const [sensorMin, setSensorMin] = useState("")
    const [sensorMax, setSensorMax] = useState("")
    const [sensorTipo, setSensorTipo] = useState("")
    const [sensorEstado, setSensorEstado] = useState("") 
    const [sensorUbicacion, setSensorUbicacion] = useState("")

    // Rango de fecha de tabla de lecturas
    const [lecturasFechaInicio, setLecturasFechaInicio] = useState("")
    const [lecturasFechaFin, setLecturasFechaFin] = useState("")

    // Rango de fecha y hora de grafico diario
    const [graficoFecha, setGraficoFecha] = useState("")
    const [graficoFechaInicio, setGraficoFechaInicio] = useState("")
    const [graficoFechaFin, setGraficoFechaFin] = useState("")
    const [graficoIntervaloHora, setGraficoIntervaloHora] = useState("")

    // Rango de fecha de tabla de promedios
    const [promediosFechaInicio, setPromediosFechaInicio] = useState("")
    const [promediosFechaFin, setPromediosFechaFin] = useState("")

    // Rango de fecha de Grafico Informes
    const [informeFechaInicio, setInformeFechaInicio] = useState("")
    const [informeFechaFin, setInformeFechaFin] = useState("")
    const [informeRangoHora, setInformeRangoHora] = useState("")

    return (
        <SensorContext.Provider
            value={{
                sensorId, setSensorId,
                sensorIdentificador, setSensorIdentificador,
                sensorNombre, setSensorNombre,
                sensorMin, setSensorMin,
                sensorMax, setSensorMax,
                sensorTipo, setSensorTipo,
                sensorEstado, setSensorEstado,
                lecturasFechaInicio, setLecturasFechaInicio,
                lecturasFechaFin, setLecturasFechaFin,
                graficoFecha, setGraficoFecha,
                graficoIntervaloHora, setGraficoIntervaloHora,
                graficoFechaInicio, setGraficoFechaInicio,
                graficoFechaFin, setGraficoFechaFin,
                promediosFechaInicio, setPromediosFechaInicio,
                promediosFechaFin, setPromediosFechaFin,
                informeFechaInicio, setInformeFechaInicio,
                informeFechaFin, setInformeFechaFin,
                informeRangoHora, setInformeRangoHora,
                sensorUbicacion, setSensorUbicacion
            }}>
            {children}
        </SensorContext.Provider>
    )
}

// Hook personalizado para usar el contexto de sensor
export function useSensor() {
    const context = useContext(SensorContext);
    if (!context) {
        throw new Error("useSensor debe usarse dentro de un SensorProvider");
    }
    return context;
}