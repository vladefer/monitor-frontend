// primeReact
import { Calendar } from "primereact/calendar"
import { Dropdown } from 'primereact/dropdown'
import { Button } from "primereact/button"
import { Card } from "primereact/card"

import { useEffect } from "react"

// manejo de fechas
import dayjs from "dayjs"

// grafico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from "recharts"

// pdf
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { autoTable } from 'jspdf-autotable'

function CrearGrafico({ consulta, graficoFecha, setGraficoFecha, graficoIntervaloHora, setGraficoIntervaloHora, setGraficoFechaInicio, setGraficoFechaFin, sensorNombre, sensorMax, sensorMin, sensorTipo, refetch, isFetching, user, sensorIdentificador }) {

    // Agregar unidad de medida
    const unidadMedida = () => {
        if (sensorTipo === 1) return " °C"
        if (sensorTipo === 2) return " %"
    }

    // agregar rango
    const unirRango = () => {
        if (sensorTipo === 1) return `${sensorMin} C° a ${sensorMax} C°`
        if (sensorTipo === 2) return `${sensorMin} H° a ${sensorMax} H°`
    }

    // definir intervalos de horas
    const horas = [
        { label: "00:00 - 01:59", value: "00:00:00-01:59:59" },
        { label: "02:00 - 03:59", value: "02:00:00-03:59:59" },
        { label: "04:00 - 05:59", value: "04:00:00-05:59:59" },
        { label: "06:00 - 07:59", value: "06:00:00-07:59:59" },
        { label: "08:00 - 09:59", value: "08:00:00-09:59:59" },
        { label: "10:00 - 11:59", value: "10:00:00-11:59:59" },
        { label: "12:00 - 13:59", value: "12:00:00-13:59:59" },
        { label: "14:00 - 15:59", value: "14:00:00-15:59:59" },
        { label: "16:00 - 17:59", value: "16:00:00-17:59:59" },
        { label: "18:00 - 19:59", value: "18:00:00-19:59:59" },
        { label: "20:00 - 21:59", value: "20:00:00-21:59:59" },
        { label: "22:00 - 23:59", value: "22:00:00-23:59:59" },
    ]

    // Convertir a zona horaria
    const intervaloHora = (value) => {
        const [horaInicio, horaFin] = value.split('-')

        const inicioLocal = dayjs(`${graficoFecha} ${horaInicio}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        const finLocal = dayjs(`${graficoFecha} ${horaFin}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

        setGraficoFechaInicio(inicioLocal);
        setGraficoFechaFin(finLocal)
        setGraficoIntervaloHora(value)
    }

    // actualizar cuando fecha u hora se cambian
    useEffect(() => {
        if (graficoFecha && graficoIntervaloHora) {
            intervaloHora(graficoIntervaloHora)
        }
    }, [graficoFecha])

    // Mapear la Consulta para entregar Lecturas y fecha
    const datosRecharts = consulta.map(l => {
        const horaLocal = dayjs(l.fecha).format("HH:mm")
        return {
            hora: horaLocal,
            valor: l.lectura,
        }
    })

    // Mapea los valores de lectura
    const valoresLecturas = datosRecharts.map(d => d.valor);

    // Calcula mínimo y máximo entre límites y lecturas
    const minValor = Math.min(sensorMin, ...valoresLecturas);
    const maxValor = Math.max(sensorMax, ...valoresLecturas);

    // Calcula margen del 10%
    const margen = (maxValor - minValor) * 0.1;

    // Ajusta los valores con margen
    const minValorConMargen = minValor - margen;
    const maxValorConMargen = maxValor + margen;

    // Crear grafico
    const graficoRecharts = (
        datosRecharts.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosRecharts}>
                    <CartesianGrid stroke="#eee" strokeDasharray="" />
                    <XAxis
                        dataKey="hora"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickSize="0"
                        tickMargin="10"
                    />
                    <YAxis
                        domain={[minValorConMargen, maxValorConMargen]}
                        tickFormatter={(value) => `${Number(value).toFixed(1)}${unidadMedida()}`}
                        tickCount={10}
                        tickMargin="10"
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

                    <Line
                        type="monotone"
                        dataKey="valor"
                        name={sensorNombre}
                        stroke='var(--indigo-500)'
                        strokeWidth={3}
                        dot={{ r: 2, strokeWidth: 2, fill: "#ffffff" }}
                    />

                </LineChart>
            </ResponsiveContainer>
        ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                <i className="pi pi-info-circle" style={{ fontSize: '1.5rem' }}></i>
                <p>No hay datos disponibles para graficar.</p>
            </div>
        )
    )

    // Funcion para exportar pdf 
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
            const canvas = await html2canvas(input, { scale: 1, useCORS: true })

            const imgData = canvas.toDataURL('image/png')
            const doc = new jsPDF()

            /* const logoData = await convertirImagen("img/logo-marca.png")
            doc.addImage(logoData, 'PNG', 14, 5, 16, 10) */

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(50)
            doc.text(`Tecnometry monitor-app`, 14, 20)
            doc.text(`Señores`, 14, 29)

            doc.setFont("helvetica", "bold")
            doc.text(user.cliente_nombre, doc.getTextWidth("Señores ") + 14, 29)

            doc.setFont("helvetica", "normal")
            doc.text(`Este informe corresponde al registro de lecturas de acuerdo al rango y hora seleccionada`, 14, 35)

            doc.setFont("helvetica", "normal")
            doc.text("Nombre:", 14, 45)

            doc.setFont("helvetica", "bold")
            doc.text(sensorNombre, 14 + doc.getTextWidth("Nombre: "), 45)

            doc.setFont("helvetica", "normal")
            doc.text(`Serial: ${sensorIdentificador}`, 14, 50)

            doc.text(`Rango: ${sensorMin} ${sensorTipo === 1 ? "°C" : "%"} a ${sensorMax} ${sensorTipo === 1 ? "°C" : "%"}`, 14, 55)
            doc.text(`Fecha: ${dayjs(graficoFecha).format("DD/MM/YYYY")} y rango de hora ${ graficoIntervaloHora}`, 14, 60)

            doc.addImage(imgData, 'PNG', 2, 65, 205, 70)

            const datos = consulta.map(row => [
                sensorNombre,
                row.lectura + unidadMedida(row),
                dayjs(row.fecha).format("DD/MM/YYYY HH:mm"),
                unirRango()
            ])

            const columnas = ["Nombre", "Lectura", "Fecha", "Rango"]

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
                    doc.text("Reporte Grafico - Fecha - Hora", 14, 15)
                }
            })
            doc.save("grafico-diario.pdf");
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div style={{ display: "flex", justifyContent: "space-between" }} >

                <div>
                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingRight: "1rem" }}>Fecha</label>

                    <Calendar
                        value={graficoFecha ? dayjs(graficoFecha).toDate() : null}
                        onChange={(e) => setGraficoFecha(dayjs(e.value).format("YYYY-MM-DD"))}
                        placeholder="Seleccione Fecha"
                        showIcon
                        dateFormat="dd/mm/yy"
                        style={{ height: '2.5rem', width: '15rem' }}
                    />

                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingLeft: "1rem", paddingRight: "1rem" }}>Hora</label>

                    <Dropdown
                        value={graficoIntervaloHora}
                        options={horas}
                        onChange={(e) => intervaloHora(e.value)}
                        placeholder="Seleccione la hora"
                        checkmark={true}
                        highlightOnSelect={false}
                        style={{ fontSize: '0.75rem', height: '2.5rem', width: '15rem', alignItems: 'center' }}
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
                title="Grafico Diario"
                subTitle={sensorNombre}
                style={{ padding: "0rem 2rem" }}
            >
                <div id="grafico-a-exportar" style={{}}>
                    <div style={{ width: "90%", margin: "0 auto" }}>
                        {graficoRecharts}
                    </div>
                </div>


                <p>Serial: {sensorIdentificador}</p>
                <p>Rangos del Sensor: {sensorMin} {unidadMedida()} a {sensorMax} {unidadMedida()}</p>
                <p>Fecha: {dayjs(graficoFecha).format("DD/MM/YYYY")}</p>
                <p>IntervaloHora: {graficoIntervaloHora}</p>

            </Card>
        </div>
    )
}

export default CrearGrafico;