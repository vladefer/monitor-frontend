// primeReact
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { SelectButton } from 'primereact/selectbutton'
import { Checkbox } from 'primereact/checkbox'
import { useState } from "react";


// manejo de fechas
import dayjs from "dayjs"

// grafico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from "recharts"

// pdf
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { autoTable } from 'jspdf-autotable'
import "../assets/fonts/Lato-Regular-normal"
import "../assets/fonts/Lato-Light-normal"

function GraficoInformes({ consulta, informeFechaInicio, setInformeFechaInicio, informeFechaFin, setInformeFechaFin, sensorNombre, sensorIdentificador, sensorMax, sensorMin, sensorTipo, refetch, isFetching, user, informeRangoHora, setInformeRangoHora }) {

    const [minima, setMinima] = useState(true);
    const [promedio, setPromedio] = useState(true);
    const [maxima, setMaxima] = useState(true);


    //Rango de hora
    const rangoOpcion = [
        { label: '24h', value: '24' },
        { label: '12h', value: '12' },
        { label: '6h', value: '6' },
    ]

    // Agregar unidad de medida
    const unidadMedida = () => {
        if (sensorTipo === 1) return " °C"
        if (sensorTipo === 2) return " %"
    }

    // Generar datos listos para graficar y exportar pdf
    const datosRecharts = []
    for (const registro of consulta) {
        const fecha = dayjs(registro.fecha).format("YYYY-MM-DD")
        const keys = Object.keys(registro)

        const bloques = keys
            .filter(k => k.startsWith("max_"))
            .map(k => k.replace("max_", ""));

        for (const bloque of bloques) {
            datosRecharts.push({
                fecha,
                bloque,
                max: registro[`max_${bloque}`],
                promedio: registro[`promedio_${bloque}`],
                min: registro[`min_${bloque}`],
            })
        }
    }

    // Reunir todos los valores numéricos de los datos visibles (filtrados)
    const valoresLecturas = datosRecharts.flatMap(d => [d.max ?? null, d.promedio ?? null, d.min ?? null]).filter(v => v !== null)

    // Si no hay valores válidos, usar los límites del sensor para el grafico
    const minValor = valoresLecturas.length ? Math.min(sensorMin, ...valoresLecturas) : sensorMin
    const maxValor = valoresLecturas.length ? Math.max(sensorMax, ...valoresLecturas) : sensorMax

    // Agrega un margen del 10% sobre eje Y para el grafico
    const margen = (maxValor - minValor) * 0.1
    const minValorConMargen = minValor - margen
    const maxValorConMargen = maxValor + margen

    // Crear grafico
    const graficoRecharts = (
        datosRecharts.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosRecharts}>
                    <CartesianGrid stroke="#eee" strokeDasharray="" />
                    <XAxis
                        dataKey="fecha"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickSize="0"
                        tickMargin="10"
                    />
                    <YAxis
                        domain={[minValorConMargen, maxValorConMargen]}
                        tickFormatter={(value) => `${Number(value).toFixed(1)}${unidadMedida()}`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip />
                    <Legend
                        wrapperStyle={{
                            fontFamily: 'Verdana',
                            color: '#394e60',
                        }}
                    />

                    <ReferenceArea
                        y1={sensorMin}
                        y2={sensorMax}
                        strokeOpacity={0} // sin borde
                        fill="rgba(0, 153, 255, 0.2)" // azul muy suave, puedes personalizar
                    />

                    {maxima && (
                        <Line
                            type="monotone"
                            dataKey="max"
                            stroke='var(--pink-500)'
                            name="Máximo"
                            strokeWidth={3}
                            dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                        />

                    )}


                    {promedio && (
                        <Line
                            type="monotone"
                            dataKey="promedio"
                            stroke='var(--teal-600)'
                            name="Promedio"
                            strokeWidth={3}
                            dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                        />
                    )}

                    {minima && (
                        <Line
                            type="monotone"
                            dataKey="min"
                            stroke='var(--indigo-600)'
                            name="Mínimo"
                            strokeWidth={3}
                            dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                        />

                    )}

                </LineChart>
            </ResponsiveContainer>
        ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                <i className="pi pi-info-circle" style={{ fontSize: '1.5rem' }}></i>
                <p>No hay datos disponibles para graficar.</p>
            </div>
        )
    )

    // Formatear rango de horas para imprimir en pdf
    function formatearBloque(bloque) {
        if (!bloque || bloque === "-") return "-";
        if (bloque === "AM" || bloque === "PM") return bloque;
        const partes = bloque.split("_");
        if (partes.length === 2) {
            const inicio = String(partes[0]).padStart(2, "0") + ":00";
            const fin = String(partes[1]).padStart(2, "0") + ":00";
            return `${inicio} - ${fin}`;
        }
        return bloque;
    }

    // Exportar pdf  
    const exportarPDF = async () => {
        if (datosRecharts.length > 0) {

            // convertir logo a formato requerido para pdf
            async function convertirImagen(url) {
                const res = await fetch(url)
                const blob = await res.blob()
                return new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.readAsDataURL(blob)
                })
            }


            const input = document.getElementById('grafico-a-exportar')
            const canvas = await html2canvas(input, {
                scale: 1,
                useCORS: true
            })

            const imgData = canvas.toDataURL('image/png')
            const doc = new jsPDF()

            /*  const logoData = await convertirImagen("img/logo.png")
             doc.addImage(logoData, 'PNG', 14, 8, 60, 10) */

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(50)
            doc.text(`Tecnometry monitor-app`, 14, 20)
            doc.text(`Señores`, 14, 29)

            doc.setFont("helvetica", "bold")
            doc.text(user.cliente_nombre, doc.getTextWidth("Señores ") + 14, 29)

            doc.setFont("helvetica", "normal")
            doc.text(`Este informe corresponde al registro de maximas y minimas en rango de ${informeRangoHora} horas por dia.`, 14, 35)

            doc.setFont("helvetica", "normal")
            doc.text("Nombre:", 14, 45)

            doc.setFont("helvetica", "bold")
            doc.text(sensorNombre, 14 + doc.getTextWidth("Nombre: "), 45)

            doc.setFont("helvetica", "normal")
            doc.text(`Serial: ${sensorIdentificador}`, 14, 50)

            doc.text(`Rango: ${sensorMin} ${sensorTipo === 1 ? "°C" : "%"} a ${sensorMax} ${sensorTipo === 1 ? "°C" : "%"}`, 14, 55)
            doc.text(`Fecha : ${dayjs(informeFechaInicio).format("DD/MM/YYYY")} hasta ${dayjs(informeFechaFin).format("DD/MM/YYYY")}`, 14, 60)

            doc.addImage(imgData, 'PNG', 2, 65, 205, 70)

            // Datos dinámicos según bloques
            const datos = datosRecharts.map(row => [
                sensorNombre,
                dayjs(row.fecha).format("DD/MM/YYYY"),
                formatearBloque(row.bloque),
                row.min != null ? row.min + unidadMedida(row) : "-",
                row.promedio != null ? row.promedio + unidadMedida(row) : "-",
                row.max != null ? row.max + unidadMedida(row) : "-"
            ])

            const columnas = ["Nombre", "Fecha", "Rango", "Mínimo", "Promedio", "Máximo"]

            autoTable(doc, {
                margin: { top: 30, bottom: 35 },
                startY: 140,
                head: [columnas],
                body: datos,
                styles: { fontSize: 8 },
                didDrawPage: function (data) {
                    const pageHeight = doc.internal.pageSize.height
                    const pageWidth = doc.internal.pageSize.width
                    const pageNumber = doc.internal.getNumberOfPages()

                    // Footer personalizado (en todas las páginas)
                    doc.setFontSize(10)
                    doc.setTextColor(120)

                    const footerLines = [
                        "Elaborado por: Tecnometry",
                        "Teléfono: 3028699819",
                        "Correo: admin@tecnometry.com",
                        "https://monitor-app.cloud"
                    ]

                    let y = pageHeight - 25
                    footerLines.forEach((line) => {
                        doc.text(line, 14, y)
                        y += 5
                    })

                    doc.text(`Página ${pageNumber}`, pageWidth - 40, pageHeight - 10)
                    doc.setFont("helvetica", "bold")
                    doc.setFontSize(14)
                    doc.setTextColor(41, 128, 185)
                    doc.text("Reporte Grafico - Informe", 14, 15)
                }
            })
            doc.save("grafico-informe.pdf")
        }
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div style={{ display: "flex", justifyContent: "space-between" }} >

                    <div>
                        <label style={{ color: "#4b4a4a", fontWeight: 500, paddingRight: "1rem" }}>Fecha Inicio</label>

                        <Calendar
                            value={informeFechaInicio ? dayjs(informeFechaInicio).toDate() : null}
                            showIcon
                            onChange={(newValue) => setInformeFechaInicio(dayjs(newValue.value).startOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                            placeholder="Seleccione Fecha"
                            dateFormat="dd/mm/yy "
                            style={{ height: '2.5rem', width: '15rem' }}
                        />

                        <label style={{ color: "#4b4a4a", fontWeight: 500, paddingLeft: "1rem", paddingRight: "1rem" }}>Fecha Fin</label>

                        <Calendar
                            value={informeFechaFin ? dayjs(informeFechaFin).toDate() : null}
                            showIcon
                            onChange={(newValue) => setInformeFechaFin(dayjs(newValue.value).endOf("day").format("YYYY-MM-DD HH:mm:ss"))}
                            placeholder="Seleccione Fecha"
                            dateFormat="dd/mm/yy"
                            style={{ height: '2.5rem', width: '15rem' }}
                        />
                    </div>


                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Button
                            label="PDF"
                            icon="pi pi-download"
                            onClick={exportarPDF}
                            style={{ height: '2.5rem' }}
                        />
                        <Button
                            label="Actualizar"
                            icon="pi pi-refresh"
                            loading={isFetching}
                            onClick={() => refetch()}
                            style={{ height: '2.5rem' }}
                        />
                    </div>
                </div>


                <Card
                    title="Grafico Promedios"
                    subTitle={sensorNombre}
                    style={{ padding: "0rem 2rem" }}
                >


                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <label style={{ color: "#4b4a4a", fontWeight: 500 }}>Rango</label>
                            <SelectButton
                                value={informeRangoHora}
                                onChange={(e) => setInformeRangoHora(e.value)}
                                options={rangoOpcion}
                                optionLabel="label"
                                style={{ height: '2.5rem', paddingBottom: "4rem" }}
                            />
                            

                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <label style={{ color: "#4b4a4a", fontWeight: 500 }}>Minima</label>
                            <Checkbox onChange={e => setMinima(e.checked)} checked={minima} ></Checkbox>

                            <label style={{ color: "#4b4a4a", fontWeight: 500 }}>Promedio</label>
                            <Checkbox onChange={e => setPromedio(e.checked)} checked={promedio}></Checkbox>

                            <label style={{ color: "#4b4a4a", fontWeight: 500 }}>Maxima</label>
                            <Checkbox onChange={e => setMaxima(e.checked)} checked={maxima}></Checkbox>
                        </div>
                    </div>

                    <div id="grafico-a-exportar" style={{}}>
                        <div style={{ width: "90%", margin: "0 auto" }}>
                            {graficoRecharts}
                        </div>
                    </div>

                    <p>Serial: {sensorIdentificador}</p>
                    <p>Rangos del Sensor: {sensorMin} {unidadMedida()} a {sensorMax} {unidadMedida()}</p>
                    <p>Fecha: {dayjs(informeFechaInicio).format("DD/MM/YYYY")} hasta {dayjs(informeFechaFin).format("DD/MM/YYYY")} </p>
                    <p>Rango Hora: {informeRangoHora} </p>

                </Card>
            </div>
        </div>
    )
}

export default GraficoInformes;