// primeReact
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Slider } from 'primereact/slider'
import { useState } from "react"
import { FaCalendarCheck } from "react-icons/fa"
import { TbTemperatureSun } from "react-icons/tb"
import { SiRainmeter } from "react-icons/si"
import { FaCheckSquare } from "react-icons/fa"
import { AiFillTag } from "react-icons/ai";
import { TbClockHour4Filled } from "react-icons/tb"

// manejo de fechas
import dayjs from "dayjs"

// grafico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from "recharts"

// pdf
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { autoTable } from 'jspdf-autotable'

function CrearGrafico({ consulta, graficoFecha, setGraficoFecha, sensorNombre, sensorMax, sensorMin, sensorTipo, refetch, isFetching, user, sensorIdentificador }) {

    const [seleccion, setSeleccion] = useState(0);

    // Agregar unidad de medida
    const unidadMedida = () => {
        if (sensorTipo === 1) return " °C"
        if (sensorTipo === 2) return " %"
    }

    // agregar rango
    const unirRango = () => {
        if (sensorTipo === 1) return `${sensorMin} C° a ${sensorMax} C°`
        if (sensorTipo === 2) return `${sensorMin} %° a ${sensorMax} %°`
    }

    const datosRecharts = consulta.map(l => ({
        fechaDayjs: dayjs(l.fecha),
        horaStr: dayjs(l.fecha).format("YY-MM-DD HH:mm"),
        horaNum: dayjs(l.fecha).hour(),
        valor: l.lectura,
    }))

    const datosFiltrados = datosRecharts.filter((d) => {
        const hora = d.horaNum
        return hora >= seleccion && hora < seleccion + 2
    })

    const datosFiltradosConLabel = datosFiltrados.map(d => ({
        ...d,
        hora: d.horaStr
    }))

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
        datosFiltrados.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosFiltradosConLabel}>
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
                        stroke='var(--indigo-600)'
                        strokeWidth={4}
                        dot={{ r: 0, strokeWidth: 2, fill: "#ffffff" }}
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
            doc.text(`Fecha: ${dayjs(graficoFecha.hora).format("DD/MM/YYYY")} ${seleccion}:00 hasta ${seleccion + 2}:00 `, 14, 60)

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
                    <label style={{ color: "#4b4a4a", fontWeight: 500, paddingRight: "1rem" }}>Fecha de Lecturas</label>
                    <Calendar
                        value={graficoFecha ? dayjs(graficoFecha).toDate() : null}
                        onChange={(e) => setGraficoFecha(dayjs(e.value).format("YYYY-MM-DD"))}
                        placeholder="Seleccione Fecha"
                        showIcon
                        dateFormat="dd/mm/yy"
                        style={{ height: '2.5rem', width: '18rem' }}
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
                className="px-0 lg:px-20 "
            >

                <div id="grafico-a-exportar" className="flex justify-center gap-6">
                    <div className="w-full h-80 sm:h-94">
                        {graficoRecharts}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <label className="text-[#4b4a4a] font-medium">Rango de Hora</label>

                        <div className="flex items-center justify-between gap-8 w-[30rem] pb-6">
                            <p>00:00</p>
                            <Slider
                                value={seleccion}
                                onChange={(e) => setSeleccion(e.value)}
                                min={0}
                                max={22}
                                step={1}
                                className="w-80"
                            />
                            <p>24:00</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-5">
                        <AiFillTag style={{ color: 'var(--cyan-500)', fontSize: "2rem" }} />
                        <p>{sensorIdentificador}</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <FaCheckSquare style={{ color: 'var(--cyan-500)', fontSize: "2rem" }} />
                        <p>{sensorMin} {unidadMedida()} a {sensorMax} {unidadMedida()}</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <FaCalendarCheck style={{ color: 'var(--cyan-500)', fontSize: "2rem" }} />
                        <p>{dayjs(graficoFecha).format("DD/MM/YYYY")}</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <TbClockHour4Filled style={{ color: 'var(--cyan-500)', fontSize: "2rem" }} />
                        <p>{seleccion}:00 hasta {seleccion + 2}:00</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CrearGrafico;